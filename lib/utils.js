'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.isDate = isDate
exports.pad0 = pad0
exports.toNumber = toNumber
function objectToString (o) {
  return Object.prototype.toString.call(o)
}

function isDate (d) {
  return isObject(d) && objectToString(d) === '[object Date]'
}

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
function pad0 (number, len) {
  len = len || 2
  number = Array(len).join('0') + number
  return number.substr(number.length - len, len)
}

/**
 * convert string to number
 * @private
 * @param {String} str
 * @return {Number} converted number or undefined
 */
function toNumber (str) {
  var num = parseInt(str, 10)
  if (!isNaN(num)) {
    return num
  }
}
