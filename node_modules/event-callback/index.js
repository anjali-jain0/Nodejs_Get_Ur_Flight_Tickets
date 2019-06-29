'use strict'
eventCallback.persist = eventCallbackPersist
module.exports = eventCallback
const args = require('fast-args')

function eventCallback (emitter, pass, fail, callback) {
  if (typeof fail === 'function') {
    callback = fail
    fail = null
  }

  // Success handler
  function passHandler () {
    emitter.removeListener(fail, failHandler)
    const input = args(arguments)
    input.unshift(null)
    callback.apply(emitter, input)
  }

  // Success handler
  function failHandler () {
    emitter.removeListener(pass, passHandler)
    callback.apply(emitter, args(arguments))
  }

  // Bind listeners
  emitter.once(pass, passHandler)
  emitter.once(fail || 'error', failHandler)
}

function eventCallbackPersist (emitter, pass, fail, callback) {
  if (typeof fail === 'function') {
    callback = fail
    fail = null
  }

  // Pass handler
  emitter.on(pass, function handler () {
    const input = args(arguments)
    input.unshift(null)
    callback.apply(emitter, input)
  })

  // Fail handler
  emitter.on(fail || 'error', function () {
    callback.apply(emitter, args(arguments))
  })
}
