'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CalEvent = require('./CalEvent');
var Easter = require('./Easter');
var Equinox = require('./Equinox');
var Hebrew = require('./Hebrew');
var Hijri = require('./Hijri');

var CalEventFactory = function CalEventFactory(opts) {
  _classCallCheck(this, CalEventFactory);

  switch (opts.fn) {
    case 'easter':
      {
        return new Easter(opts);
      }
    case 'equinox':
      {
        return new Equinox(opts);
      }
    case 'hebrew':
      {
        return new Hebrew(opts);
      }
    case 'islamic':
      {
        return new Hijri(opts);
      }
    default:
      {
        return new CalEvent(opts);
      }
  }
};

module.exports = CalEventFactory;