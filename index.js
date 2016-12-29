var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')

module.exports = function (str) {
  var p = parse(str)
  var e = ellipsoid[p.ellps]
  if (p.projName === 'geom') {
    return {
    }
  }
  console.log(p, e)
  return 'todo'
}
