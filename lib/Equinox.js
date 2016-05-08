'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moonbeams = require('moonbeams');
var moment = require('moment-timezone');
var pad0 = require('./internal/utils').pad0;
var CalEvent = require('./CalEvent');
var CalDate = require('./CalDate');

var SEASON = {
  spring: 0,
  summer: 1,
  autumn: 2,
  winter: 3
};

var Equinox = function (_CalEvent) {
  _inherits(Equinox, _CalEvent);

  /**
   * @param {object} [opts]
   * @param {string} opts.season - type of season (spring|summer|autumn|winter)
   * @param {number|string} opts.offset - offset in days
   */

  function Equinox(opts) {
    _classCallCheck(this, Equinox);

    opts = opts || {};

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Equinox).call(this, opts));

    _this._season = SEASON[opts.season];
    _this._timezone = opts.timezone || 'GMT';
    return _this;
  }

  _createClass(Equinox, [{
    key: 'inYear',
    value: function inYear(year) {
      var jd = moonbeams.season(this._season, year);
      var mbdate = moonbeams.jdToCalendar(jd);
      var mbhour = moonbeams.dayToHms(mbdate.day);

      // str is needed to get date in GMT
      var str = pad0(mbdate.year, 4) + '-' + pad0(mbdate.month) + '-' + pad0(Math.floor(mbdate.day)) + 'T' + pad0(mbhour.hour) + ':' + pad0(mbhour.minute) + ':' + pad0(mbhour.second) + 'Z';

      var date = moment(str).tz(this._timezone);
      var floor = {
        year: year,
        month: date.month() + 1,
        day: date.date()
      };

      var d = new CalDate(floor).setOffset(this.offset);
      this.dates.push(d);
      return this;
    }
  }]);

  return Equinox;
}(CalEvent);

module.exports = Equinox;