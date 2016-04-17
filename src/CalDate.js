'use strict'

const moment = require('moment-timezone')
const toNumber = require('./internal/utils').toNumber
const isDate = require('./internal/utils').isDate
const pad0 = require('./internal/utils').pad0

const PROPS = ['year', 'month', 'day', 'hour', 'minute', 'second']

class CalDate {
  constructor (opts) {
    this.set(opts)
  }

  set (opts) {
    if (isDate(opts)) {
      this.year = opts.getFullYear()
      this.month = opts.getMonth() + 1
      this.day = opts.getDate()
      this.hour = opts.getHours()
      this.minute = opts.getMinutes()
      this.second = opts.getSeconds()
    } else {
      PROPS.forEach((p) => {
        this[p] = toNumber(opts[p]) || 0
      })
    }
    this.duration = opts.duration || 24 // duration is in hours
    return this
  }

  isEqual (calDate) {
    var res = true
    ;['year', 'month', 'day'].forEach((p) => {
      res &= (this[p] === calDate[p])
    })
    return res
  }

  getDay () {
    return this.toDate().getDay()
  }

  setOffset (number, unit) {
    if (number) {
      if (typeof number === 'object') {
        number = number.number
        unit = number.unit
      }
      number = toNumber(number)
      switch (unit) {
        case 'd': {
          this.day += number
          break
        }
        case 'h': {
          this.hour += number
          break
        }
        default: {
          this.day += number
        }
      }
    }
    this.update()
    return this
  }

  setTime (hour, minute) {
    // the holiday usually ends at midnight - if this is not the case different set duration explicitely
    this.duration = 24 - (hour + minute / 60)
    this.hour = hour
    this.minute = minute
    this.update()
  }

  setDuration (duration) {
    this.duration = duration
  }

  update () {
    if (this.year) {
      var d = new CalDate(this.toDate())
      PROPS.forEach((p) => {
        this[p] = d[p]
      })
    }
  }

  toEndDate () {
    var d = new CalDate(this.toDate())
    d.minute += ((this.duration * 60) | 0)
    d.update()
    return d
  }

  toTimezone (timezone) {
    if (timezone) {
      return new Date(moment.tz(this.toString(), timezone).format())
    } else {
      return this.toDate()
    }
  }

  toDate () {
    return new Date(
      this.year, this.month - 1, this.day,
      this.hour, this.minute, this.second, 0
    )
  }

  toISOString () {
    return this.toString(true)
  }

  toString (iso) {
    var d = new CalDate(this.toDate())
    return (
      pad0(d.year, 4) + '-' +
      pad0(d.month) + '-' +
      pad0(d.day) +
      (iso ? 'T' : ' ') +
      pad0(d.hour) + ':' +
      pad0(d.minute) + ':' +
      pad0(d.second) +
      (iso ? 'Z' : '')
    )
  }
}
module.exports = CalDate
