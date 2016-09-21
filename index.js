'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

function Locker (options) {
  this.opts = _.extend({
    path: '/var/run',
    name: 'fs-locker'
  }, options);
  this.locked = false;
}

Locker.prototype.acquire = function (fn) {
  if (!fn) {
    throw Error('fn required.');
  }
  var lock_file = path.join(this.opts.path, this.opts.name);
  var err = null;

  var ctx = {
    release: function(callback) {
      try {
        var r_ = fs.unlinkSync(lock_file);
        callback && callback(r_); // r_ is undefined if rm done.
      } catch (e) {
        callback && callback(e);
      }
    }
  };

  try {
    fs.openSync(lock_file, 'wx+');  // error raised if lock file exists
  } catch (e) {
    err = e;
  }

  fn.apply(, [err]);
};

module.exports = function(options) {
  return new Locker(options);
};
