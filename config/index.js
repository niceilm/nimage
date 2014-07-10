'use strict';
var util = require('util');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
// Load configurations
// Set the node environment variable if not set before
process.env.NODE_ENV = ~fs.readdirSync('./config/env').map(function(file) {
  return file.slice(0, -3);
}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

// Extend the base configuration in all.js with environment
// specific configuration
var config = _.extend(
  require('./env/all'),
    require('./env/' + process.env.NODE_ENV) || {}
);
module.exports = config;