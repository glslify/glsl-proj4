import defined from 'defined';

import geocent_t from './t.glsl';
import geocent_forward from './forward.glsl';
import geocent_inverse from './inverse.glsl';

class geocent {
  constructor(p, e) {
    const a = defined(p.a,e.a);
    const b = defined(p.b,e.b);
    const a2 = a*a;
    const b2 = b*b;
    this.a = a;
    this.b = b;
    this.e = Math.sqrt((a2-b2)/a2);
    this.eprime = Math.sqrt((a2-b2)/b2);
    const f = 1-b/a;
    this.e2 = (2-f)*f;
    this.p0 = [defined(p.x0,0), defined(p.y0,0), defined(p.z0,0)];
    this.k0 = defined(p.k0,p.k,1);
  }
  glsl_type() { return geocent_t; }
  glsl_forward() { return geocent_t + geocent_forward; }
  glsl_inverse() { return geocent_t + geocent_inverse; }
  glsl() { return geocent_t + geocent_forward + geocent_inverse; }
}

export default geocent;
