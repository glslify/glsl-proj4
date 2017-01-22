#pragma glslify: gnom_t = require('./t.glsl')
#pragma glslify: adjust_lon = require('../lib/adjust_lon.glsl')
#pragma glslify: asinz = require('../lib/asinz.glsl')

const float PI = 3.141592653589793;

vec3 gnom_inverse (gnom_t t, vec3 p) {
  float px = (p.x-t.x0)/t.a/t.k0;
  float py = (p.y-t.y0)/t.a/t.k0;
  float rh = sqrt(max(0.0, px * px + py * py));
  float c = atan(rh, t.rc);
  float sinc = sin(c);
  float cosc = cos(c);
  return vec3(
    adjust_lon(t.lon0+atan(px*sinc,rh*t.cos_p14*cosc-py*t.sin_p14*sinc))*180.0/PI,
    asinz(cosc*t.sin_p14+(py*sinc*t.cos_p14)/rh)*180.0/PI,
    (p.z-t.z0)/t.k0
  );
}
vec3 gnom_inverse (gnom_t t, vec2 p) {
  return gnom_inverse(t, vec3(p,0));
}
#pragma glslify: export(gnom_inverse)
