var express = require('express');
var async = require('async');
var _ = require('lodash');
var ImageService = require('../services/image');
var router = express.Router();
var config = global.config;
router.get('/:hashedId', loadImage);

module.exports = router;

function loadImage(req, res, next) {
  ImageService.loadImagePath({
    hashedId: req.param('hashedId'),
    width: req.param('width') || 0,
    height: req.param('height') || 0
  }, function(err, path) {
    if(err) return next(err);
    res.sendfile(path, function(err) {
      if(err) {
        res.sendfile(config.placeholderImagePath);
      }
    });
  });
}