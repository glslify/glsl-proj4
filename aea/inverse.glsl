#pragma glslify: aea_t = require('./t.glsl')
#pragma glslify: adjust_lon = require('../lib/adjust_lon.glsl')
#pragma glslify: asinz = require('../lib/asinz.glsl')

const float EPSILON = 1.0e-10;
const float PI = 3.141592653589793;

float phi1z (float eccent, float qs) {
  float phi = asinz(0.5 * qs);
  if (eccent < EPSILON) return phi;
  float e2 = eccent*eccent;
  float sinphi, cosphi, con, com, dphi;
  for (int i = 1; i <= 25; i++) {
    sinphi = sin(phi);
    cosphi = cos(phi);
    con = eccent * sinphi;
    com = 1.0 - con*con;
    dphi = 0.5 * com*com / cosphi * (qs/(1.0-e2)-sinphi/com
      + 0.5/eccent*log((1.0-con)/(1.0+con)));
    phi += dphi;
    if (abs(dphi) < 1e-6) return phi;
  }
  return 1e400;
}
vec3 aea_inverse (aea_t t, vec3 p) {
  float px = p.x - t.x0, py = t.rh - p.y + t.y0;
  float con = sign(t.ns0);
  float rh1 = con * sqrt(px*px + py*py);
  float theta = step(EPSILON,abs(rh1)) * atan(con * px, con * py);
  con = rh1 * t.ns0 / t.a;
  return vec3(
    adjust_lon(theta / t.ns0 + t.lon0)*180.0/PI,
    (t.sphere > EPSILON
      ? asin((t.c-con*con)/(2.0*t.ns0))
      : phi1z(t.e3,(t.c-con*con)/t.ns0))*180.0/PI,
    p.z
  );
}
vec3 aea_inverse (aea_t t, vec2 p) {
  return aea_inverse(t,vec3(p,0));
}
#pragma glslify: export(aea_inverse)
