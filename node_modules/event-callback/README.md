# event-callback [![NPM version](https://badge.fury.io/js/event-callback.svg)](https://npmjs.org/package/event-callback) [![Build Status](https://travis-ci.org/jamen/event-callback.svg?branch=master)](https://travis-ci.org/jamen/event-callback)

> Attempt to turn a pass/fail event combo into a Node-style callback.

```js
const eventcb = require('event-callback')

const req = http.get('http://example.com')

eventcb(req, 'response', function (err, resp) {
  // ...
})
```

## Installation

```sh
$ npm install --save event-callback
```

## API

### `eventcb(emitter, pass, [fail], callback)`

Handle the `pass` and `fail` events on `emitter` to trigger `callback` once.

 - `emitter` (`EventEmitter`): The event emitter you want to handle on.
 - `pass` (`String`): The event that passes the callback.  i.e. `data`.
 - `fail` (`String`): The event that fails the callback.  Defaults to `error`.
 - `callback` (`Function`): A node-style callback that gets triggered per your events.

### `eventcb.persist(emitter, pass, [fail], callback)`

The same as above, except the callback gets triggered each time the events happen.

## License

MIT © [Jamen Marz](https://github.com/jamen)
