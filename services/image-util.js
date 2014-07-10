var _ = require('lodash');

module.exports.getResizeInfo = getResizeInfo;

function getResizeInfo(imageWidth, imageHeight, thumbnailWidth, thumbnailHeight) {
  var resizeWidth;
  var resizeHeight;
  var resizeRatio;
  thumbnailWidth = parseFloat(thumbnailWidth);
  thumbnailHeight = parseFloat(thumbnailHeight);

  if(thumbnailWidth && !thumbnailHeight) {
    resizeRatio = imageWidth / thumbnailWidth;
    resizeWidth = thumbnailWidth;
    resizeHeight = thumbnailHeight = imageHeight / resizeRatio;
  } else if(!thumbnailWidth && thumbnailHeight) {
    resizeRatio = imageHeight / thumbnailHeight;
    resizeWidth = thumbnailWidth = imageWidth / resizeRatio;
    resizeHeight = thumbnailHeight;
  } else if(thumbnailWidth && thumbnailHeight) {
    resizeRatio = imageWidth / thumbnailWidth;
    resizeWidth = thumbnailWidth;
    resizeHeight = imageHeight / resizeRatio;
    if(resizeHeight < thumbnailHeight) {
      resizeRatio = imageHeight / thumbnailHeight;
      resizeWidth = imageWidth / resizeRatio;
      resizeHeight = thumbnailHeight;
    }
  }

  return {
    resizeWidth: parseInt(resizeWidth, 10),
    resizeHeight: parseInt(resizeHeight, 10),
    thumbnailWidth: parseInt(thumbnailWidth, 10),
    thumbnailHeight: parseInt(thumbnailHeight, 10),
    resizeRatio: resizeRatio,
    imageAspectRatio: imageWidth / imageHeight,
    thumbnailAspectRatio: thumbnailWidth / thumbnailHeight
  };
}

