import defined from 'defined';
import qsfnz from 'proj4/lib/common/qsfnz.js';
import msfnz from 'proj4/lib/common/msfnz.js';

import aea_t from './t.glsl';
import aea_forward from './forward.glsl';
import aea_inverse from './inverse.glsl';

import glsl_constants  from '../lib/constants.glsl';
import glsl_adjust_lon  from '../lib/adjust_lon.glsl';
import glsl_qsfnz  from '../lib/qsfnz.glsl';
import glsl_asinz  from '../lib/asinz.glsl';
import glsl_phi1z  from '../lib/phi1z.glsl';

class aea {
  constructor(p, e) {
    this.lon0 = p.long0;
    this.p0 = [defined(p.x0,0), defined(p.y0,0), defined(p.z0,0)];
    this.k0 = defined(p.k0,p.k,1);
    const a = defined(p.a,e.a);
    const b = defined(p.b,e.b);
    // this.sphere = p.sphere ? 1.0 : 0.0;
    this.e3 = Math.sqrt(1 - Math.pow(b/a, 2));
    const qs0 = qsfnz(this.e3, Math.sin(p.lat0));
    const qs1 = qsfnz(this.e3, Math.sin(p.lat1));
    const qs2 = qsfnz(this.e3, Math.sin(p.lat2));
    const ms1 = msfnz(this.e3, Math.sin(p.lat1), Math.cos(p.lat1));
    const ms2 = msfnz(this.e3, Math.sin(p.lat2), Math.cos(p.lat2));
    this.ns0 = Math.abs(p.lat1 - p.lat2) > 1.0e-10
      ? (ms1*ms1 - ms2*ms2) / (qs2 - qs1)
      : Math.sin(p.lat1);
    this.a_ns0 = a / this.ns0;
    this.c = ms1*ms1 + this.ns0*qs1;
    this.rh = e.a * Math.sqrt(this.c - this.ns0 * qs0) / this.ns0;
  }
  glsl_type() { return aea_t; }
  glsl_forward() { return aea_t + glsl_qsfnz + aea_forward; }
  glsl_inverse() { return aea_t + glsl_constants + glsl_adjust_lon + glsl_asinz + glsl_phi1z + aea_inverse; }
  glsl() { return aea_t + glsl_constants + glsl_adjust_lon + glsl_asinz + glsl_phi1z + glsl_qsfnz + aea_forward + aea_inverse; }
}

export default aea;
