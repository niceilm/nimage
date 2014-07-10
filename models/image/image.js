"use strict";
var config = global.config;
var path = require("path");
var Hashids = require("hashids");
var hashids = new Hashids(config.db.salt, 16);
var util = require("util");
module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define('Image', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    hashedId: {type: DataTypes.STRING(16), get: function() {
      return hashids.encrypt(this.getDataValue('id'));
    }},
    url: {type: DataTypes.STRING(1024), get: function() {
      return util.format(config.downloadUrl, this.hashedId);
    }},
    signature: {type: DataTypes.STRING(512)},
    name: {type: DataTypes.STRING(1024)},
    type: {type: DataTypes.STRING(20)},
    size: {type: DataTypes.INTEGER},
    width: {type: DataTypes.INTEGER},
    height: {type: DataTypes.INTEGER},
    createdAt: {type: DataTypes.DATE},
    updatedAt: {type: DataTypes.DATE}
  }, {
    tableName: 'image',
    classMethods: {
      associate: function(models) {
      },
      decrypt: function(source) {
        var results = hashids.decrypt(source);
        return results.length === 0 ? null : results[0];
      },
      getThumbnailPath: function(hashedId, thumbnailWidth, thumbnailHeight, type) {
        return path.resolve(config.uploadPath, hashedId, util.format(config.imageNameWithWidthHeight, thumbnailWidth, thumbnailHeight, type));
      },
      getSavePath: function(hashedId) {
        return path.resolve(config.uploadPath, hashedId, config.imageName);
      }
    },
    instanceMethods: {
      getDirPath: function() {
        return path.resolve(config.uploadPath, this.hashedId);
      },
      getSavePath: function() {
        return path.resolve(config.uploadPath, this.hashedId, config.imageName);
      }
    }

  });

  return Image;
};