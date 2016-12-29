var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')
var defined = require('defined')

module.exports = function (str) {
  var p = parse(str)
  var e = ellipsoid[p.ellps]
  if (p.projName === 'geom') {
    return {
      name: p.projName,
      members: function (name) {
        var members = {}
        members[name+'.'+'lon0'] = p.long0
        members[name+'.'+'lat0'] = p.lat0
        members[name+'.'+'x0'] = p.x0
        members[name+'.'+'y0'] = p.y0
        members[name+'.'+'a'] = e.a
        members[name+'.'+'k0'] = p.k0
        members[name+'.'+'sin_p14'] = Math.sin(p.lat0)
        members[name+'.'+'cos_p14'] = Math.cos(p.lat0)
        members[name+'.'+'infinity_dist'] = 1000 * e.a
        members[name+'.'+'rc'] = defined(p.rc, 1)
        return members
      }
    }
  }
}
