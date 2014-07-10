"use strict";
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');

module.exports = function(options, filepath) {
  var sequelize = new Sequelize(options.database, options.user, options.password, {
    host: options.host,
    port: options.port,
    dialect: 'mysql',
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    pool: {
      minConnections: 0,
      maxConnections: 20,
      maxIdleTime: 100
    },
    define: {
      syncOnAssociation: false,
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: false,
      getterMethods: {
        createdAt: function() {
          var createdAt = this.getDataValue('createdAt');
          return createdAt ? createdAt.getTime() : null;
        },
        updatedAt: function() {
          var updatedAt = this.getDataValue('updatedAt');
          return updatedAt ? updatedAt.getTime() : null;
        }
      },
      classMethods: {
      },
      instanceMethods: {
      }
    }
  });
  var db = {};


  fs.readdirSync(filepath)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function(file) {
      var model = sequelize.import(path.join(filepath, file));
      db[model.name] = model
    });

  Object.keys(db).forEach(function(modelName) {
    if('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
  });

  if(global.config.db.sync) {
    sequelize.sync({force: true}).success(function() {
      console.log(arguments);
    });
  }

  return lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
  }, db);
};