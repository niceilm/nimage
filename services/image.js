var _ = require('lodash');
var imageMagick = require('gm').subClass({ imageMagick: true });
var validator = require('validator');
var async = require('async');
var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var cv = require('opencv');
var path = require('path');
var request = require('request');
var imageUtil = require('./image-util');
var db = require('../models/image');
var config = global.config;
var Image = db.Image;

module.exports.uploadFromFile = uploadFromFile;
module.exports.uploadFromUrl = uploadFromUrl;
module.exports.uploadFromUrlWithCrop = uploadFromUrlWithCrop;
module.exports.loadImagePath = loadImagePath;
module.exports.findAndCountAll = findAndCountAll;

function loadImagePath(params, callback) {
  var savePath = Image.getSavePath(params.hashedId);

  if(params.width || params.height) {
    if(!(validator.isInt(params.width) && validator.isInt(params.height))) {
      return cb({status: 400, message: '숫자만 넣어주세요.'});
    }
    imageMagick(savePath).size(function(err, size) {
      _generateThumbnail(savePath, size, params, callback);
    });
  } else {
    callback(null, savePath);
  }
}

function _generateThumbnail(savePath, size, params, callback) {
  var resizeInfo = imageUtil.getResizeInfo(size.width, size.height, params.width, params.height);
  var resizeWidth = resizeInfo.resizeWidth;
  var resizeHeight = resizeInfo.resizeHeight;
  var resizeRatio = resizeInfo.resizeRatio;
  var thumbnailWidth = resizeInfo.thumbnailWidth;
  var thumbnailHeight = resizeInfo.thumbnailHeight;
  var newPath = Image.getThumbnailPath(params.hashedId, resizeInfo.thumbnailWidth, resizeInfo.thumbnailHeight, 'type');

  fs.stat(newPath, function(err, stats) {
    if(!err) {
      return callback(null, newPath);
    }

    if(resizeInfo.imageAspectRatio === resizeInfo.thumbnailAspectRatio) {
      imageMagick(savePath)
        .resize(resizeWidth, resizeHeight)
        .interlace('Partition')
        .write(newPath, writeComplete);
    } else {
      // TODO 0 으로 나누는 케이스는 따로 처리
      cv.readImage(savePath, function(err, im) {
        im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
          var faceX = 0;
          var faceY = 0;
          var len = faces.length;
          for(var i = 0; i < len; i++) {
            var face = faces[i];
            faceX += face.x + face.width / 2;
            faceY += face.y + face.height / 2;
          }
          faceX /= len;
          faceY /= len;

          var cropX = (faceX / resizeRatio) - thumbnailWidth / 2;
          var cropY = (faceY / resizeRatio) - thumbnailHeight / 2;

          // crop 위치 보정
          cropX = cropX < 0 ? 0 : cropX;
          cropY = cropY < 0 ? 0 : cropY;
          if(thumbnailWidth + cropX > resizeWidth) {
            cropX -= thumbnailWidth + cropX - resizeWidth;
          }
          if(thumbnailHeight + cropY > resizeHeight) {
            cropY -= thumbnailHeight + cropY - resizeHeight;
          }
          imageMagick(savePath)
            .resize(resizeWidth, resizeHeight)
            .crop(thumbnailWidth, thumbnailHeight, cropX, cropY)
            .interlace('Partition')
            .write(newPath, writeComplete);
        });
      });
    }
  });

  function writeComplete(err) {
    callback(err, newPath);
  }
}

function findAndCountAll(params, callback) {
  Image.findAndCountAll({
    limit: params.limit || 10,
    offset: params.offset || 0,
    attributes: ['url', 'width', 'height', 'size', 'type']
  }).done(callback);
}

function uploadFromFile(file, callback) {
  if(!(file.path && file.size)) {
    callback(new Error("파일 타입 확인"));
  }

  async.waterfall([
    function(cb) {
      imageMagick(file.path).identify(cb);
    },
    function(identify, cb) {
      var imageInfo = {
        width: identify.size.width,
        height: identify.size.height,
        signature: identify.Properties.signature,
        path: file.path,
        size: file.size,
        name: file.name,
        type: file.type
      };

      Image.findOrCreate({signature: imageInfo.signature}, imageInfo).done(function(err, image, created) {
        cb(err, imageInfo, image, created);
      });
    },
    function(imageInfo, image, created, cb) {
      mkdirp(image.getDirPath(), function(err) {
        cb(err, imageInfo, image);
      });
    },
    function(imageInfo, image, cb) {
      fs.rename(imageInfo.path, image.getSavePath(), function(err) {
        cb(err, image);
      });
    }
  ], function(err, image) {
    if(err) {
      return callback(err);
    }
    callback(null, _.pick(image, ['url', 'width', 'height', 'size', 'type', 'hashedId']));
  });
}

function uploadFromUrl(url, callback) {
  if(!url) {
    return callback({message: '파일 주소를 정확하게 적으세요.'});
  }

  var tempFilePath = path.join(__dirname, 'tmp.png');

  // base64 encode upload
  if(validator.matches(url, /^data:image/)) {
    convert(url, tempFilePath, callback);
  } else if(validator.isURL(url)) {
    download(url, tempFilePath, callback);
  } else {
    return callback({message: "잘못된 이미지 주소를 넣었습니다."});
  }
}

function uploadFromUrlWithCrop(params, callback) {
  var tempFilePath = path.join(__dirname, 'tmp.jpeg');

  if(!params.src) {
    return callback({message: '파일 주소를 정확하게 적으세요.'});
  } else if(!validator.isURL(url)) {
    return callback({message: "잘못된 이미지 주소를 넣었습니다."});
  }

  imageMagick(params.src).crop(params.cropwidth, params.cropheight, params.x, params.y).write(tempFilePath, function(err) {
    if(err) {
      return callback(err);
    }
    getImageInfoThenMoveNewPath(tempFilePath, callback);
  });
}

function convert(url, tempFilePath, callback) {
  try {
    var imageBuffer = decodeBase64Image(url);
    fs.writeFile(tempFilePath, imageBuffer.data, function(err) {
      if(err) {
        return callback(err);
      }
      getImageInfoThenMoveNewPath(tempFilePath, callback);
    });
  } catch(me) {
    callback(me);
  }
}

function download(uri, tempFilePath, callback) {
  var r = request.defaults();
  r(uri).pipe(fs.createWriteStream(tempFilePath)).on('close', function(err) {
    if(err) {
      return callback(err);
    }
    getImageInfoThenMoveNewPath(tempFilePath, callback);
  });
}

function getImageInfoThenMoveNewPath(tempFilePath, callback) {
  async.waterfall([
    function getImageInfo(cb) {
      imageMagick(tempFilePath).identify(function(err, info) {
        if(err) {
          return cb({status: 400, message: "정상적인 이미지가 아닙니다."});
        }
        cb(null, info);
      });
    },
    function getFileSize(info, cb) {
      fs.stat(tempFilePath, function(err, fileInfo) {
        cb(err, info, fileInfo.size);
      });
    },
    function moveNewPath(info, size, cb) {
      var fileType = getFileType(info.format);
      var fileExtension = fileType.replace("image/", ".")
      var fileName = info.Properties.signature + fileExtension;
      var filePath = path.join(__dirname, fileName);
      fs.rename(tempFilePath, filePath, function(err) {
        cb(err, {
          type: fileType,
          size: size,
          name: fileName,
          path: filePath
        });
      });
    }
  ], callback);
}

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if(!matches || matches.length !== 3) {
    throw {message: "정상적인 이미지가 아닙니다.", status: 400};
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function getFileType(format) {
  format = format.toLowerCase();
  return util.format("image/%s", format);

}