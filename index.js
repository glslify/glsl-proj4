var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')
var derive = require('proj4/lib/deriveConstants')
var qsfnz = require('proj4/lib/common/qsfnz.js')
var msfnz = require('proj4/lib/common/msfnz.js')
var tsfnz = require('proj4/lib/common/tsfnz.js')
var e0fn = require('proj4/lib/common/e0fn.js')
var e1fn = require('proj4/lib/common/e1fn.js')
var e2fn = require('proj4/lib/common/e2fn.js')
var e3fn = require('proj4/lib/common/e3fn.js')
var mlfn = require('proj4/lib/common/mlfn.js')
var defined = require('defined')

module.exports = function (str) {
  var p = parse(str)
  var e = ellipsoid[p.ellps || p.datumCode || 'WGS84'] || {}
  if (e && p) e = derive.sphere(e.a, e.b, e.rf, p.ellps, p.sphere)
  var members = null
  if (p.projName === 'gnom') {
    members = {
      lon0: p.long0,
      lat0: p.lat0,
      x0: defined(p.x0,0),
      y0: defined(p.y0,0),
      z0: defined(p.z0,0),
      a: defined(p.a,e.a),
      k0: defined(p.k0,p.k,1),
      sin_p14: Math.sin(p.lat0),
      cos_p14: Math.cos(p.lat0),
      rc: defined(p.rc, 1)
    }
    members.infinity_dist = 1000 * members.a
  } else if (p.projName === 'aea') {
    members = {
      lon0: p.long0,
      lat0: p.lat0,
      lat1: p.lat1,
      lat2: p.lat2,
      x0: defined(p.x0,0),
      y0: defined(p.y0,0),
      z0: defined(p.z0,0),
      k0: defined(p.k0,p.k,1),
      a: defined(p.a,e.a),
      sphere: p.sphere ? 1.0 : 0.0
    }
    members.e3 = Math.sqrt(1 - Math.pow(defined(p.b,e.b) / members.a, 2))
    var qs0 = qsfnz(members.e3, Math.sin(members.lat0))
    var qs1 = qsfnz(members.e3, Math.sin(members.lat1))
    var qs2 = qsfnz(members.e3, Math.sin(members.lat2))
    var ms1 = msfnz(members.e3, Math.sin(members.lat1),
      Math.cos(members.lat1))
    var ms2 = msfnz(members.e3, Math.sin(members.lat2),
      Math.cos(members.lat2))
    members.ns0 = Math.abs(members.lat1 - members.lat2) > 1.0e-10
      ? (ms1*ms1 - ms2*ms2) / (qs2 - qs1)
      : Math.sin(members.lat1),
    members.c = ms1*ms1 + members.ns0*qs1
    members.rh = e.a * Math.sqrt(members.c - members.ns0 * qs0) / members.ns0
  } else if (p.projName === 'geocent') {
    var a = defined(p.a,e.a), b = defined(p.b,e.b)
    members = {
      a: a,
      b: b,
      e: Math.sqrt((a*a-b*b)/(a*a)),
      eprime: Math.sqrt((a*a-b*b)/(b*b)),
      x0: defined(p.x0,0),
      y0: defined(p.y0,0),
      z0: defined(p.z0,0),
      k0: defined(p.k0,p.k,1)
    }
  } else if (p.projName === 'tmerc') {
    var a = defined(p.a,e.a), b = defined(p.b,e.b)
    var es = defined(p.es, e.es, (a*a-b*b)/(a*a))
    members = {
      lon0: p.long0,
      lat0: p.lat0,
      x0: defined(p.x0,0),
      y0: defined(p.y0,0),
      z0: defined(p.z0,0),
      a: defined(p.a,e.a),
      k0: defined(p.k0,p.k,1),
      sphere: p.sphere ? 1.0 : 0.0,
      e0: e0fn(es),
      e1: e1fn(es),
      e2: e2fn(es),
      e3: e3fn(es),
      es: (a*a-b*b)/(a*a),
      ep2: (a*a-b*b)/(b*b)
    }
    members.ml0 = a * mlfn(members.e0,members.e1,
      members.e2,members.e3,members.lat0)
  } else if (p.projName === 'lcc') {
    var a = defined(p.a,e.a), b = defined(p.b,e.b)
    var e = Math.sqrt(1-(b/a)*(b/a))
    var ms1 = msfnz(e, Math.sin(p.lat1), Math.cos(p.lat1))
    var ms2 = msfnz(e, Math.sin(p.lat2), Math.cos(p.lat2))
    var ts0 = tsfnz(e, p.lat0, Math.sin(p.lat0))
    var ts1 = tsfnz(e, p.lat1, Math.sin(p.lat1))
    var ts2 = tsfnz(e, p.lat2, Math.sin(p.lat2))
    var ns = Math.abs(p.lat1 - p.lat2) > 1e-10
      ? Math.log(ms1/ms2)/Math.log(ts1/ts2)
      : Math.sin(p.lat1)
    if (isNaN(ns)) ns = Math.sin(p.lat1)
    var f0 = ms1 / (ns * Math.pow(ts1, ns))
    members = {
      lon0: p.long0,
      lat0: p.lat0,
      lat1: p.lat1,
      lat2: defined(p.lat2, p.lat1),
      x0: defined(p.x0, 0),
      y0: defined(p.y0, 0),
      z0: defined(p.z0,0),
      k0: defined(p.k0,p.k,1),
      a: a,
      b: b,
      e: e,
      ns: ns,
      f0: f0,
      rh: a * f0 * Math.pow(ts0, ns)
    }
  } else return null
  return {
    name: p.projName,
    members: function (name) {
      var m = {}
      Object.keys(members).forEach(function (key) {
        m[name+'.'+key] = members[key]
      })
      return m
    }
  }
}
