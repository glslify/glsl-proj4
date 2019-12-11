import defined from 'defined';
import e0fn from 'proj4/lib/common/e0fn.js';
import e1fn from 'proj4/lib/common/e1fn.js';
import e2fn from 'proj4/lib/common/e2fn.js';
import e3fn from 'proj4/lib/common/e3fn.js';
import mlfn from 'proj4/lib/common/mlfn.js';

import tmerc_t from './t.glsl';
import tmerc_forward from './forward.glsl';
import tmerc_inverse from './inverse.glsl';

import glsl_constants from '../lib/constants.glsl';
import glsl_mlfn from '../lib/mlfn.glsl';
import glsl_asinz from '../lib/asinz.glsl';

class tmerc {
  constructor(p, e) {
    const a = defined(p.a,e.a);
    const b = defined(p.b,e.b);
    const es = defined(p.es, e.es, (a*a-b*b)/(a*a));
    this.lon0 = p.long0;
    this.lat0 = p.lat0;
    this.p0 = [defined(p.x0,0), defined(p.y0,0), defined(p.z0,0)];
    this.a = defined(p.a,e.a);
    this.k0 = defined(p.k0,p.k,1);
    this.sphere = p.sphere ? 1.0 : 0.0;
    const e0 = e0fn(es);
    const e1 = e1fn(es);
    const e2 = e2fn(es);
    const e3 = e3fn(es);
    this.es = (a*a-b*b)/(a*a);
    this.ep2 = (a*a-b*b)/(b*b);
    this.ml0 = a * mlfn(e0, e1, e2, e3,this.lat0)
    this.e = [e0, e1, e2, e3];
  }
  glsl_type() { return tmerc_t; }
  glsl_forward() { return tmerc_t + glsl_mlfn + tmerc_forward; }
  glsl_inverse() { return tmerc_t + glsl_constants + glsl_asinz + glsl_mlfn + tmerc_inverse; }
  glsl() { return tmerc_t + glsl_constants + glsl_asinz + glsl_mlfn + tmerc_forward + tmerc_inverse; }

}

export default tmerc;
