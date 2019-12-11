import defined from 'defined';
import msfnz from 'proj4/lib/common/msfnz.js';
import tsfnz from 'proj4/lib/common/tsfnz.js';

import lcc_t from './t.glsl';
import lcc_forward from './forward.glsl';
import lcc_inverse from './inverse.glsl';

import glsl_constants  from '../lib/constants.glsl';
import glsl_tsfnz  from '../lib/tsfnz.glsl';
import glsl_phi2z  from '../lib/phi2z.glsl';

class lcc {
  constructor(p, e_) {
    const a = defined(p.a,e_.a);
    const b = defined(p.b,e_.b);
    const e = Math.sqrt(1-(b/a)*(b/a));
    const ms1 = msfnz(e, Math.sin(p.lat1), Math.cos(p.lat1));
    const ms2 = msfnz(e, Math.sin(p.lat2), Math.cos(p.lat2));
    const ts0 = tsfnz(e, p.lat0, Math.sin(p.lat0));
    const ts1 = tsfnz(e, p.lat1, Math.sin(p.lat1));
    const ts2 = tsfnz(e, p.lat2, Math.sin(p.lat2));
    const ns = Math.abs(p.lat1 - p.lat2) > 1e-10
      ? Math.log(ms1/ms2)/Math.log(ts1/ts2)
      : Math.sin(p.lat1);
    if (isNaN(ns)) ns = Math.sin(p.lat1);
    const f0 = ms1 / (ns * Math.pow(ts1, ns));
    this.lon0 = p.long0;
    this.p0 = [defined(p.x0,0), defined(p.y0,0), defined(p.z0,0)];
    this.k0 = defined(p.k0,p.k,1);
    this.e = e;
    this.ns = ns;
    this.af0 = a * f0;
    this.rh = this.af0 * Math.pow(ts0, ns);
  }
  glsl_type() { return lcc_t; }
  glsl_forward() { return lcc_t + glsl_constants + glsl_tsfnz + lcc_forward; }
  glsl_inverse() { return lcc_t + glsl_constants + glsl_phi2z + lcc_inverse; }
  glsl() { return lcc_t + glsl_constants + glsl_tsfnz + glsl_phi2z + glsl_phi2z + lcc_forward + lcc_inverse; }
}

export default lcc;
