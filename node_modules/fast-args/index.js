module.exports = fargs;
/** @module fast-args
  *
  * Very fast way to turn a function's `arguments` into an array.
  *
  * Name key:
  * a = arguments
  * o = offset
  *
  * Example:
  * ```js
  * function foo() {
  *   var args = fargs(arguments);
  *   // ...
  * }
  * ```
  */

function fargs (a, o) {
  o = o || 0;
  var length = a.length - o;

  // Handle most common lengths manually.
  // This is where the speed comes in.
  if (length <= 0) return [];
  switch (length) {
    case 1: return [a[o]];
    case 2: return [a[o++], a[o++]];
    case 3: return [a[o++], a[o++], a[o++]];
    case 4: return [a[o++], a[o++], a[o++], a[o++]];
    case 5: return [a[o++], a[o++], a[o++], a[o++], a[o++]];
    case 6: return [a[o++], a[o++], a[o++], a[o++], a[o++], a[o++]];
  }

  // Fall back on a fast slice.
  var result = new Array(length);
  for (var i = 0; i < length; i++) result[i] = a[o + i];
  return result;
}
