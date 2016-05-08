'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var _data = require('../data/holidays.json');

/**
 * Handler for holiday data provided in the Json file
 * @class
 * @param {Object} [opts]
 * @param {Object} opts.optional - include optional holidays
 */

var Data = function () {
  function Data(country, state, region, data) {
    _classCallCheck(this, Data);

    if (!(this instanceof Data)) {
      return new Data(country, state, region, data);
    }
    if ((typeof region === 'undefined' ? 'undefined' : _typeof(region)) === 'object') {
      data = region;
      region = null;
    } else if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) === 'object') {
      data = state;
      state = null;
    }

    this.opts = Data.splitName(country, state, region);
    this.data = data || _data;
  }

  /**
   * get all countries from the data
   * @param {String} lang - Iso-639 shortcode
   * @return {Object} shortcode-name value pairs. E.g. `{ AT: 'Österreich', ... }`
   */


  _createClass(Data, [{
    key: 'getCountries',
    value: function getCountries(lang) {
      var o = {};
      var countries = this.data.holidays;
      Object.keys(countries).forEach(function (k) {
        var l = countries[k].langs[0];
        if (countries[k].names[lang]) {
          l = lang;
        }
        o[k] = countries[k].names[l] || k;
      });
      return o;
    }

    /**
     * get all states for a given country from the data
     * @param {String} country
     * @return {Object} shortcode-name value pairs. E.g. `{ b: 'Burgenland', ... }`
     */

  }, {
    key: 'getStates',
    value: function getStates(country) {
      country = country.toUpperCase();
      var o = {};
      var states = _.get(this.data, ['holidays', country, 'states']) || _.get(this.data, ['holidays', country, 'regions']);
      if (states) {
        Object.keys(states).forEach(function (k) {
          o[k] = states[k].name || k;
        });
        return o;
      }
    }

    /**
     * get all regions for a given country/ state from the data
     * @param {String} country
     * @param {String} state
     * @return {Object} shortcode-name value pairs.
     */

  }, {
    key: 'getRegions',
    value: function getRegions(country, state) {
      var tmp;
      if (tmp = Data.splitName(country, state)) {
        state = tmp.state;
        country = tmp.country;
      }
      country = country.toUpperCase();
      var o = {};
      var regions = _.get(this.data, ['holidays', country, 'states', state, 'regions']);

      if (regions) {
        Object.keys(regions).forEach(function (k) {
          o[k] = regions[k].name || k;
        });
        return o;
      }
    }

    /**
     * get languages for selected country, state, region
     * @return {Array} containing ISO 639-1 language shortcodes
     */

  }, {
    key: 'getLanguages',
    value: function getLanguages() {
      return this._getValue('langs');
    }

    /**
     * get default day off as weekday
     * @return {String} weekday of day off
     */

  }, {
    key: 'getDayOff',
    value: function getDayOff() {
      return this._getValue('dayoff');
    }

    /**
     * get timezones for country, state, region
     * @return {Array} of {String}s containing the timezones
     */

  }, {
    key: 'getTimezones',
    value: function getTimezones() {
      return this._getValue('zones');
    }

    /**
     * get list of holidays for country/ state/ region
     * @return {Object} holidayname <-> unparsed rule or date pairs
     */

  }, {
    key: 'getHolidays',
    value: function getHolidays() {
      var self = this;
      var tmp;
      var o;

      if (!(this.opts && this.opts.country)) {
        return;
      }

      var country = this.opts.country.toUpperCase();
      var state = this.opts.state;
      var region = this.opts.region;

      if (tmp = this.data.holidays[country]) {
        o = {};
        this._assign(o, tmp);
        if (state && tmp.regions && (tmp = tmp.regions[state]) || state && tmp.states && (tmp = tmp.states[state])) {
          this._assign(o, tmp);
          if (region && tmp.regions && (tmp = tmp.regions[region])) {
            this._assign(o, tmp);
          }
        }
        Object.keys(o).forEach(function (key) {
          // assign name references with `_name`
          var _name = o[key]._name;
          if (_name && self.data.names[_name]) {
            delete o[key]._name;
            o[key] = _.merge({}, self.data.names[_name], o[key]);
          }
        });
      }
      return o;
    }

    /**
     * get name for substitute name
     * @return {Object} translations of substitute day names
     */

  }, {
    key: 'getSubstitueNames',
    value: function getSubstitueNames() {
      return _.get(this.data, ['names', 'substitutes', 'name']);
    }

    /**
     * helper to assign objects based on properties
     * @private
     * @param {Object} out - object where obj gets assigned into
     * @param {Object} obj - input obj
     * @return {Object}
     */

  }, {
    key: '_assign',
    value: function _assign(out, obj) {
      var days;
      if (obj._days) {
        // resolve reference
        days = _.assign({}, _.get(this.data, ['holidays'].concat(obj._days, 'days')), obj.days);
      }
      if (obj.days) {
        days = days || obj.days;
        Object.keys(days).forEach(function (p) {
          if (days[p] === false) {
            // remove rules
            if (out[p]) {
              delete out[p];
            }
            return;
          }
          out[p] = _.assign({}, out[p], days[p]);
          if (!days[p].type) {
            out[p].type = 'public';
          }
        });
      }
      return out;
    }

    /**
     * get a object from the data tree
     * @private
     * @param {String} key - key to look at
     * @return {Object} return object
     */

  }, {
    key: '_getValue',
    value: function _getValue(key) {
      return _.get(this.data, ['holidays', this.opts.country, 'states', this.opts.state, key]) || _.get(this.data, ['holidays', this.opts.country, key]);
    }
  }]);

  return Data;
}();

module.exports = Data;

// static functions
/**
 * split country state names if they appear in concatenated format e.g. 'at.b'
 * @param {String|Object} country
 * @param {String} [state]
 * @param {String} [region]
 * @return {Object}
 */
Data.splitName = function (country, state, region) {
  if (!country) {
    return;
  } else if ((typeof country === 'undefined' ? 'undefined' : _typeof(country)) === 'object' && country.country) {
    return country;
  }
  var o = {};
  var a = country.split(/[.-]/);
  o.country = a.shift().toUpperCase();
  o.state = (a.shift() || state || '').toUpperCase();
  o.region = (a.shift() || region || '').toUpperCase();
  return o;
};