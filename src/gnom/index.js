import defined from 'defined';

import gnom_t from './t.glsl';
import gnom_forward from './forward.glsl';
import gnom_inverse from './inverse.glsl';

import glsl_constants  from '../lib/constants.glsl';
import glsl_adjust_lon  from '../lib/adjust_lon.glsl';
import glsl_asinz  from '../lib/asinz.glsl';

class gnom {
  constructor(p, e) {
    this.lon0 = p.long0;
    this.lat0 = p.lat0;
    this.p0 = [defined(p.x0,0), defined(p.y0,0), defined(p.z0,0)];
    this.a = defined(p.a,e.a);
    this.k0 = defined(p.k0,p.k,1);
    this.sin_p14 = Math.sin(p.lat0);
    this.cos_p14 = Math.cos(p.lat0);
    this.rc = defined(p.rc, 1);
    this.infinity_dist = 1000 * this.a;
  }
  glsl_type() { return gnom_t; }
  glsl_forward() { return gnom_t + glsl_constants + gnom_forward; }
  glsl_inverse() { return gnom_t + glsl_constants + glsl_adjust_lon + glsl_asinz + gnom_inverse; }
  glsl() { return gnom_t + glsl_constants + glsl_adjust_lon + glsl_asinz + gnom_forward + gnom_inverse; }
}

export default gnom;
