#pragma glslify: lcc_t = require('./t.glsl')
#pragma glslify: tsfnz = require('../lib/tsfnz.glsl')

const float PI = 3.141592653589793;

vec3 lcc_forward (lcc_t t, vec3 p) {
  float lon = p.x/180.0*PI, lat = p.y/180.0*PI;
  if (abs(2.0*abs(lat)-PI) <= 1e-10) {
    lat = sign(lat) * (PI*0.5 - 2e-10);
  }
  float con = abs(abs(lat) - PI*0.5);
  float ts, rh1;
  if (con > 1e-10) {
    rh1 = t.a * t.f0 * pow(tsfnz(t.e, lat, sin(lat)), t.ns);
  } else {
    con = lat * t.ns;
    rh1 = 0.0;
  }
  float theta = t.ns * (lon - t.lon0);
  return vec3(
    t.x0+t.k0*rh1*sin(theta),
    t.y0+t.k0*(t.rh-rh1*cos(theta)),
    t.z0+t.k0*p.z
  );
}
vec3 lcc_forward (lcc_t t, vec2 p) {
  return lcc_forward(t,vec3(p.xy,0));
}
#pragma glslify: export(lcc_forward)
