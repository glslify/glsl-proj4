var almost = require('almost-equal')

module.exports = function approx (t, a, b) {
  var ep0 = Math.pow(2,Math.log(Math.max(a[0],b[0]))/Math.log(2)-17)
  var ep1 = Math.pow(2,Math.log(Math.max(a[1],b[1]))/Math.log(2)-17)
  var ep2 = Math.pow(2,Math.log(Math.max(a[2],b[2]))/Math.log(2)-17)
  t.ok(almost(a[0], b[0], ep0), `${a[0]} cmp ${b[0]}`)
  t.ok(almost(a[1], b[1], ep1), `${a[1]} cmp ${b[1]}`)
  t.ok(almost(a[2], b[2], ep2), `${a[2]} cmp ${b[2]}`)
}
