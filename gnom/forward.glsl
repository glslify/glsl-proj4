#pragma glslify: gnom_t = require('./t.glsl')
#pragma glslify: adjust_lon = require('../lib/adjust_lon.glsl')
#pragma glslify: asinz = require('../lib/asinz.glsl')

const float EPSILON = 1.0e-10;
const float PI = 3.141592653589793;

vec2 gnom_forward (gnom_t t, vec2 p) {
  float lon = p.x, lat = p.y;
  float dlon = adjust_lon(lon - t.lon0);
  float sinphi = sin(lat);
  float cosphi = cos(lat);
  float coslon = cos(dlon);
  float g = t.sin_p14 * sinphi + t.cos_p14 * cosphi * coslon;
  float ksp = 1.0;
  if ((g > 0.0) || (abs(g) <= EPSILON)) {
    return vec2(
      t.x0+t.a*ksp*cosphi*sin(dlon)/g,
      t.y0+t.a*ksp*(t.cos_p14*sinphi-t.sin_p14*cosphi*coslon)/g
    );
  } else {
    return vec2(
      t.x0+t.infinity_dist*cosphi*sin(dlon),
      t.y0+t.infinity_dist*(t.cos_p14*sinphi-t.sin_p14*cosphi*coslon)
    );
  }
}
#pragma glslify: export(gnom_forward)
