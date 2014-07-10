'use strict';

var path = require('path');
var util = require('util');
var querystring = require('querystring');
var rootPath = path.normalize(__dirname + '/../..');
var port = process.env.PORT || 3007;
module.exports = {
  root: rootPath,
  port: port,
  uploadPath: path.resolve(rootPath, 'upload'),
  downloadUrl: 'http://local.i.niceilm.net/dn/%s',
  imageName: 'image.jpg',
  imageNameWithWidthHeight: 'image_%s_%s_%s.jpg',
  placeholderImagePath: path.resolve(rootPath, "public/img/no-image-avaliable.jpeg"),
  log: {
    morgan: 'dev'
  },
  db: {
    salt: "nimage salt!!",
    sync: false || process.env.DBSYNC,
    image: { user: 'root', password: '', host: '127.0.0.1', port: 3306, database: 'image' }
  }
};
