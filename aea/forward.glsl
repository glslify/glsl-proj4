#pragma glslify: aea_t = require('./t.glsl')
#pragma glslify: qsfnz = require('../lib/qsfnz.glsl')

const float PI = 3.141592653589793;

vec2 aea_forward (aea_t t, vec2 p) {
  float lon = p.x/180.0*PI, lat = p.y/180.0*PI;
  float sinphi = sin(lat);
  float cosphi = cos(lat);
  float qs = qsfnz(t.e3, sinphi);
  float rh1 = t.a * sqrt(t.c - t.ns0 * qs) / t.ns0;
  float theta = t.ns0 * (lon - t.lon0/180.0*PI);
  return vec2(
    rh1 * sin(theta) + t.x0,
    t.rh - rh1 * cos(theta) + t.y0
  );
}
#pragma glslify: export(aea_forward)
