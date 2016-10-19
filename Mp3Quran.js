#!/usr/bin/env node

var EventEmitter = require('events'),
  util = require('util'),
  jsdom = require('jsdom'),
  fs = require('fs')

function Mp3Quran () {
  EventEmitter.call(this)
  this.baseUrl = 'http://www.mp3quran.net/eng/'
  this.recitors = []
  // kick things off.
  this.init()
}
util.inherits(Mp3Quran, EventEmitter)

Mp3Quran.prototype.getRecitors = function () {
  return this.recitors
}
Mp3Quran.prototype.add = function (recitor) {
  this.recitors.push(recitor)
  this.emit('recitor-added', {recitor: recitor})
}

Mp3Quran.prototype.ready = function () {
  this.emit('ready', this.recitors)
}

Mp3Quran.prototype.save = function (destinationFile) {
  destinationFile = (destinationFile) ? destinationFile : './resources/recitors.json'
  var that = this
  fs.writeFile(destinationFile, JSON.stringify(that.recitors, null, 4), function (err) {
    if (err) {console.log("Can't save recitor list to ", destinationFile)}
    that.emit('recitors-saved', {destination: destinationFile})
  })

}

Mp3Quran.prototype.init = function () {
  var that = this
  jsdom.env(
    that.baseUrl,
    [],
    function (err, window) {
      var recitorSelector = '.readerP a',
        recitorsDOM = window.document.querySelectorAll(recitorSelector),
        length = recitorsDOM.length,
        i = 0,
        obj = {}

      for (;i < length;i++) {
        // NOTE: use .textContent instead of .innerText in order to work!!!
        that.add({ name: recitorsDOM[i].textContent, url: recitorsDOM[i].href })
      }
      that.save()
      that.ready()
    }
  )
  return this
}

module.exports = Mp3Quran
