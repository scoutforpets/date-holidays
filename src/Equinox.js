'use strict'

const moonbeams = require('moonbeams')
const moment = require('moment-timezone')
const pad0 = require('./internal/utils').pad0
const CalEvent = require('./CalEvent')
const CalDate = require('caldate')

const SEASON = {
  spring: 0,
  summer: 1,
  autumn: 2,
  winter: 3
}

class Equinox extends CalEvent {
  /**
   * @param {object} [opts]
   * @param {string} opts.season - type of season (spring|summer|autumn|winter)
   * @param {number|string} opts.offset - offset in days
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)

    this._season = SEASON[opts.season]
    this._timezone = opts.timezone || 'GMT'
  }

  inYear (year) {
    var jd = moonbeams.season(this._season, year)
    var mbdate = moonbeams.jdToCalendar(jd)
    var mbhour = moonbeams.dayToHms(mbdate.day)

    // str is needed to get date in GMT
    var str = pad0(mbdate.year, 4) + '-' +
      pad0(mbdate.month) + '-' +
      pad0(Math.floor(mbdate.day)) + 'T' +
      pad0(mbhour.hour) + ':' +
      pad0(mbhour.minute) + ':' +
      pad0(mbhour.second) + 'Z'

    var date = moment(str).tz(this._timezone)
    var floor = {
      year: year,
      month: date.month() + 1,
      day: date.date()
    }

    var d = new CalDate(floor).setOffset(this.offset)
    this.dates.push(d)
    return this
  }
}
module.exports = Equinox
