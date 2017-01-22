#pragma glslify: lcc_t = require('./t.glsl')
#pragma glslify: phi2z = require('../lib/phi2z.glsl')

const float PI = 3.141592653589793;

vec3 lcc_inverse (lcc_t t, vec3 p) {
  float rh1, con;
  float x = (p.x - t.x0) / t.k0;
  float y = t.rh - (p.y - t.y0) / t.k0;
  if (t.ns > 0.0) {
    rh1 = sqrt(x*x+y*y);
    con = 1.0;
  } else {
    rh1 = -sqrt(x*x+y*y);
    con = -1.0;
  }
  float theta = abs(rh1) > 1e-10
    ? atan(con*x, con*y)
    : 0.0
  ;
  float ts;
  if (abs(rh1) > 1e-10 || t.ns > 0.0) {
    con = 1.0 / t.ns;
    ts = pow(rh1 / (t.a*t.f0), con);
    return vec3(
      (theta/t.ns + t.lon0)*180.0/PI,
      phi2z(t.e, ts)*180.0/PI,
      (p.z-t.z0)/t.k0
    );
  } else {
    return vec3(
      (theta/t.ns + t.lon0)*180.0/PI,
      -90.0,(p.z-t.z0)/t.k0);
  }
}
vec3 lcc_inverse (lcc_t t, vec2 p) {
  return lcc_inverse(t,vec3(p,0));
}
#pragma glslify: export(lcc_inverse)
