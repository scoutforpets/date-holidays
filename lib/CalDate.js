'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');
var toNumber = require('./internal/utils').toNumber;
var isDate = require('./internal/utils').isDate;
var pad0 = require('./internal/utils').pad0;

var PROPS = ['year', 'month', 'day', 'hour', 'minute', 'second'];

var CalDate = function () {
  function CalDate(opts) {
    _classCallCheck(this, CalDate);

    this.set(opts);
  }

  _createClass(CalDate, [{
    key: 'set',
    value: function set(opts) {
      var _this = this;

      if (isDate(opts)) {
        this.year = opts.getFullYear();
        this.month = opts.getMonth() + 1;
        this.day = opts.getDate();
        this.hour = opts.getHours();
        this.minute = opts.getMinutes();
        this.second = opts.getSeconds();
      } else {
        PROPS.forEach(function (p) {
          _this[p] = toNumber(opts[p]) || 0;
        });
      }
      this.duration = opts.duration || 24; // duration is in hours
      return this;
    }
  }, {
    key: 'isEqual',
    value: function isEqual(calDate) {
      var _this2 = this;

      var res = true;['year', 'month', 'day'].forEach(function (p) {
        res &= _this2[p] === calDate[p];
      });
      return res;
    }
  }, {
    key: 'getDay',
    value: function getDay() {
      return this.toDate().getDay();
    }
  }, {
    key: 'setOffset',
    value: function setOffset(number, unit) {
      if (number) {
        if ((typeof number === 'undefined' ? 'undefined' : _typeof(number)) === 'object') {
          number = number.number;
          unit = number.unit;
        }
        number = toNumber(number);
        switch (unit) {
          case 'd':
            {
              this.day += number;
              break;
            }
          case 'h':
            {
              this.hour += number;
              break;
            }
          default:
            {
              this.day += number;
            }
        }
      }
      this.update();
      return this;
    }
  }, {
    key: 'setTime',
    value: function setTime(hour, minute) {
      // the holiday usually ends at midnight - if this is not the case different set duration explicitely
      this.duration = 24 - (hour + minute / 60);
      this.hour = hour;
      this.minute = minute;
      this.update();
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration) {
      this.duration = duration;
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      if (this.year) {
        var d = new CalDate(this.toDate());
        PROPS.forEach(function (p) {
          _this3[p] = d[p];
        });
      }
    }
  }, {
    key: 'toEndDate',
    value: function toEndDate() {
      var d = new CalDate(this.toDate());
      d.minute += this.duration * 60 | 0;
      d.update();
      return d;
    }
  }, {
    key: 'toTimezone',
    value: function toTimezone(timezone) {
      if (timezone) {
        return new Date(moment.tz(this.toString(), timezone).format());
      } else {
        return this.toDate();
      }
    }
  }, {
    key: 'toDate',
    value: function toDate() {
      return new Date(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, 0);
    }
  }, {
    key: 'toISOString',
    value: function toISOString() {
      return this.toString(true);
    }
  }, {
    key: 'toString',
    value: function toString(iso) {
      var d = new CalDate(this.toDate());
      return pad0(d.year, 4) + '-' + pad0(d.month) + '-' + pad0(d.day) + (iso ? 'T' : ' ') + pad0(d.hour) + ':' + pad0(d.minute) + ':' + pad0(d.second) + (iso ? 'Z' : '');
    }
  }]);

  return CalDate;
}();

module.exports = CalDate;