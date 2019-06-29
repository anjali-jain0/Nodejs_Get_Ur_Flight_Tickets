# fast-args [![NPM version](https://badge.fury.io/js/fast-args.svg)](https://npmjs.org/package/fast-args) [![Build Status](https://travis-ci.org/jamen/fast-args.svg?branch=master)](https://travis-ci.org/jamen/fast-args)

> Very fast way to turn a function's `arguments` into an array.

```js
var fargs = require('fast-args');

function foo() {
  return fargs(arguments);
}

foo(1, 2, 3);
// => [1, 2, 3]
```

Most functions don't get called with more than 6 params, so this module uses a switch for manually making an array when `arguments.length` is 1 through 6.  It can fall back on a fast slice for any number of params higher than 6.

**Note:** This module is best for ES5 and below. Use [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) for the fastest method (by far) in ES6+.

## Installation

```sh
$ npm install --save fast-args
```

## API

### `fargs(args, [offset])`
Turn the `arguments` object of a function  into an array.
 - `args` (`arguments`): The `arguments` object of a function.
 - `offset` (`Number`): The index to start on `arguments`.

```js
var fargs = require('fast-args');

function foo() {
  var args = fargs(arguments, 1);
  // ...
}
```

This is the only export of the module.

## Meta

 - `npm test`: Run tests.
 - `npm run bench`: Run benchmarks.

## License

MIT © [Jamen Marz](https://github.com/jamen)
