#!/usr/bin/env node

var EventEmitter = require('events'),
  util = require('util'),
  jsdom = require('jsdom'),
  fs = require('fs')

function QuranRecitors () {
  EventEmitter.call(this)
  this.baseUrl = 'http://www.mp3quran.net/eng/'
  this.recitors = []
  // kick things off.
  this.init()
}
util.inherits(QuranRecitors, EventEmitter)

QuranRecitors.prototype.getRecitors = function () {
  return this.recitors
}
QuranRecitors.prototype.add = function (recitor) {
  this.recitors.push(recitor)
  this.emit('recitor-added', {recitor: recitor})
}

QuranRecitors.prototype.ready = function () {
  this.emit('ready', this.recitors)
}

QuranRecitors.prototype.save = function (destinationFile) {
  destinationFile = (destinationFile) ? destinationFile : './resources/recitors.json'
  var that = this
  fs.writeFile(destinationFile, JSON.stringify(that.recitors, null, 4), function (err) {
    if (err) {
      console.log("Can't save recitor list to ", destinationFile)
    } else {
      that.emit('recitors-saved', {destination: destinationFile})
    }

  })

}

QuranRecitors.prototype.init = function () {
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
      
      that.ready()
      // you can save recitors list if you want.
      //that.save()
    }
  )
  return this
}

module.exports = QuranRecitors
