var express = require('express');
var async = require('async');
var _ = require('lodash');
var multipart = require('connect-multiparty');
var ImageService = require('../services/image');
var router = express.Router();

router.post('/', multipart({keepExtensions: true, limit: '100mb'}), uploadFiles);
router.post('/url', uploadFileFromUrl, uploadFiles);
router.post('/crop', cropImage, uploadFiles);

module.exports = router;


function uploadFiles(req, res, next) {
  var files = _.isArray(req.files.file) ? req.files.file : [req.files.file];
  async.mapSeries(files, ImageService.uploadFromFile, function(err, results) {
    if(err) {
      return next(err);
    }
    res.json(results);
  });
}

function uploadFileFromUrl(req, res, next) {
  var urls = _.isArray(req.param('url')) ? req.param('url') : [req.param('url')];
  async.mapSeries(urls, ImageService.uploadFromUrl, function(err, results) {
    req.files = {file: results};
    next(err);
  })
}

function cropImage(req, res, next) {
  ImageService.uploadFromUrlWithCrop(req.body, function(err, file) {
    req.files = {file: file};
    next(err);
  });
}
