module.exports = function approx (t, a, b) {
  var ep0 = ep(a[0],b[0])
  var ep1 = ep(a[1],b[1])
  var ep2 = ep(a[2],b[2])
  t.ok(almost(a[0], b[0], ep0), `${a[0]} ~~ ${b[0]}`)
  t.ok(almost(a[1], b[1], ep1), `${a[1]} ~~ ${b[1]}`)
  t.ok(almost(a[2], b[2], ep2), `${a[2]} ~~ ${b[2]}`)
}

function almost (a, b, e) {
  return a > b - e && a < b + e
}

function ep (a, b) {
  return Math.max(4, Math.pow(2,
    Math.log(Math.max(Math.abs(a),Math.abs(b)))/Math.log(2)-10))
}
