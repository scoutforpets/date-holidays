'use strict'

const CalEvent = require('./CalEvent')
const Easter = require('./Easter')
const Equinox = require('./Equinox')
const Hebrew = require('./Hebrew')
const Hijri = require('./Hijri')

class CalEventFactory {
  constructor (opts) {
    switch (opts.fn) {
      case 'easter': {
        return new Easter(opts)
      }
      case 'equinox': {
        return new Equinox(opts)
      }
      case 'hebrew': {
        return new Hebrew(opts)
      }
      case 'islamic': {
        return new Hijri(opts)
      }
      default: {
        return new CalEvent(opts)
      }
    }
  }
}
module.exports = CalEventFactory
