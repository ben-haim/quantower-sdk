/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Quantower LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
import Big from "big.js"
import * as converters from "./converters"
import * as ByteBuffer from "bytebuffer"

export function isPublicKey(publicKeyHex: string): boolean {
  // if (parseInt(publicKeyHex, 16).toString(16) === publicKeyHex.toLowerCase()) {
  //   return converters.hexStringToByteArray(publicKeyHex).length == 32
  // }
  // return false
  var regExp = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/
  if (regExp.test(publicKeyHex)) return converters.hexStringToByteArray(publicKeyHex).length == 32
  return false
}

export function unformat(commaFormatted: string): string {
  return commaFormatted ? commaFormatted.replace(/,/g, "") : "0"
}

export function commaFormat(amount: string) {
  if (typeof amount == "undefined") {
    return "0"
  }
  let neg = amount.indexOf("-") == 0
  if (neg) {
    amount = amount.substr(1)
  }
  let dec = amount.split(".") // input is result of convertNQT
  let parts = dec[0]
    .split("")
    .reverse()
    .join("")
    .split(/(\d{3})/)
    .reverse()
  let format = []
  for (var i = 0; i < parts.length; i++) {
    if (parts[i]) {
      format.push(
        parts[i]
          .split("")
          .reverse()
          .join("")
      )
    }
  }
  return (neg ? "-" : "") + format.join(",") + (dec.length == 2 ? "." + dec[1] : "")
}

export function isNumber(value: string) {
  var num = String(value).replace(/,/g, "")
  if (num.match(/^\d+$/)) {
    return true
  } else if (num.match(/^\d+\.\d+$/)) {
    return true
  }
  return false
}

/**
 * Very forgiving test to determine if the number of fractional parts
 * exceeds @decimals param.
 *
 * @param value String number value, can contain commas
 * @param decimals Number max allowed number of decimals.
 * @return boolean
 */
export function hasToManyDecimals(value: string, decimals: number) {
  var num = String(value).replace(/,/g, "")
  var parts: Array<string> = num.split(".")
  if (parts[1]) {
    var fractional = parts[1].replace(/[\s0]*$/g, "")
    if (fractional.length > decimals) return true
  }
  return false
}

export function timestampToDate(timestamp: number) {
  return new Date(Date.UTC(2013, 10, 24, 12, 0, 0, 0) + timestamp * 1000)
}

export function epochTime() {
  return Math.round((Date.now() - 1385294400000 + 500) / 1000)
}

export function roundTo(value: string, decimals: number): string {
  return String(parseFloat(value).toFixed(decimals))
}

export function formatQNT(
  quantity: string,
  decimals: number,
  returnNullZero?: boolean
): string | null {
  var asfloat = convertToQNTf(quantity)
  var cf = commaFormat(asfloat)
  var parts = cf.split(".")
  var ret
  if (!parts[1]) ret = parts[0] + "." + "0".repeat(decimals)
  else if (parts[1].length > decimals) {
    var i = parts[1].length - 1
    while (parts[1].length > decimals) {
      if (parts[1][i] == "0") {
        parts[1] = parts[i].slice(0, -1)
        i--
        continue
      }
      break
    }
    ret = parts[0] + "." + parts[1]
  } else ret = parts[0] + "." + parts[1] + "0".repeat(decimals - parts[1].length)
  return returnNullZero && !ret.match(/[^0\.]/) ? null : ret
}

export function trimDecimals(formatted: string, decimals: number): string {
  var parts = formatted.split(".")
  if (!parts[1]) parts[1] = "0".repeat(decimals)
  else parts[1] = parts[1].substr(0, decimals)
  if (parts[1].length < decimals) parts[1] += "0".repeat(decimals - parts[1].length)
  return parts[0] + "." + parts[1]
}

export function convertToQNTf(quantity: string): string {
  var decimals = 8
  if (typeof quantity == "undefined") {
    return "0"
  }
  if (quantity.length < decimals) {
    for (var i = quantity.length; i < decimals; i++) {
      quantity = "0" + quantity
    }
  }
  var afterComma = ""
  if (decimals) {
    afterComma = "." + quantity.substring(quantity.length - decimals)
    quantity = quantity.substring(0, quantity.length - decimals)
    if (!quantity) {
      quantity = "0"
    }
    afterComma = afterComma.replace(/0+$/, "")
    if (afterComma == ".") {
      afterComma = ""
    }
  }
  return quantity + afterComma
}

export function calculateTotalOrderPriceQNT(quantityQNT: string, priceQNT: string): string {
  return new Big(quantityQNT)
    .times(new Big(priceQNT).div(new Big(100000000)))
    .round()
    .toString()
}

class ConvertToQNTError implements Error {
  public name = "ConvertToQNTError"
  constructor(public message: string, public code: number) {}
}

/**
 * Converts a float to a QNT based on the number of decimals to use.
 * Note! That this method throws a ConvertToQNTError in case the
 * input is invalid. Callers must catch and handle this situation.
 *
 * @throws utils.ConvertToQNTError
 */
export function convertToQNT(quantity: string /*, decimals: number = 8 */): string {
  var decimals = 8 // qnts all have 8 decimals.
  var parts = quantity.split(".")
  var qnt = parts[0]
  if (parts.length == 1) {
    if (decimals) {
      for (var i = 0; i < decimals; i++) {
        qnt += "0"
      }
    }
  } else if (parts.length == 2) {
    var fraction = parts[1]
    if (fraction.length > decimals) {
      throw new ConvertToQNTError("Fraction can only have " + decimals + " decimals max.", 1)
    } else if (fraction.length < decimals) {
      for (var i = fraction.length; i < decimals; i++) {
        fraction += "0"
      }
    }
    qnt += fraction
  } else {
    throw new ConvertToQNTError("Incorrect input", 2)
  }
  //in case there's a comma or something else in there.. at this point there should only be numbers
  if (!/^\d+$/.test(qnt)) {
    throw new ConvertToQNTError("Invalid input. Only numbers and a dot are accepted.", 3)
  }
  //remove leading zeroes
  return qnt.replace(/^0+/, "")
}

/**
 * Count bytes in a string's UTF-8 representation.
 * @param   string
 * @return  number
 */
export function getByteLen(value: string): number {
  var byteLen = 0
  for (var i = 0; i < value.length; i++) {
    var c = value.charCodeAt(i)
    byteLen +=
      c < 1 << 7
        ? 1
        : c < 1 << 11
          ? 2
          : c < 1 << 16 ? 3 : c < 1 << 21 ? 4 : c < 1 << 26 ? 5 : c < 1 << 31 ? 6 : Number.NaN
  }
  return byteLen
}

export function debounce(func: Function, wait?: number, immediate?: boolean) {
  var timeout: any
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait || 100)
    if (callNow) func.apply(context, args)
  }
}

export function repeatWhile(delay: number, cb: () => boolean) {
  var fn = () => {
    if (cb()) {
      clearInterval(interval)
    }
  }
  var interval = setInterval(fn, delay)
}

export function emptyToNull(input: string): string | null {
  return isString(input) && input.trim().length == 0 ? null : input
}

export function isString(input: any): boolean {
  return !!(input && typeof input == "string")
}

export function isDefined(input: any): boolean {
  return typeof input != "undefined"
}

export function isObject(input: any): boolean {
  return !!(input && typeof input == "object")
}

export function isArray(input: any): boolean {
  return Array.isArray(input)
}

export function extend(destination: { [key: string]: any }, source: { [key: string]: any }) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) destination[key] = source[key]
  }
  return destination
}

export function isEmpty(obj: { [key: string]: any }) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

export function readBytes(buffer: ByteBuffer, length: number, offset?: number): number[] {
  if (offset) buffer.offset = offset
  let array = []
  for (let i = 0; i < length; i++) array.push(buffer.readByte())
  return array
}

export function writeBytes(buffer: ByteBuffer, bytes: number[]) {
  for (let i = 0; i < bytes.length; i++) buffer.writeByte(bytes[i])
}

/* inpired by: https://italonascimento.github.io/applying-a-timeout-to-your-promises/ */
export function setPromiseTimeout<T>(milliseconds: number, promise: Promise<any>): Promise<T> {
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id)
      reject("Timed out in " + milliseconds + "ms.")
    }, milliseconds)
  })
  return Promise.race([promise, timeout])
}
