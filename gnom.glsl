#pragma glslify: adjust_lon = require('./lib/adjust_lon.glsl')
#pragma glslify: asinz = require('./lib/asinz.glsl')

const float EPSILON = 1.0e-10;

struct gnom_t {
  float lon0;
  float lat0;
  float x0;
  float y0;
  float sin_p14;
  float cos_p14;
  float a;
  float k0;
  float infinity_dist;
  float rc;
  gnom_t (float _lon0, float _lat0, float _x0, float _y0, float _a, float _k0)
  : lon0(_lon0), lat0(_lat0), x0(_x0), y0(_y0), a(_a), k0(_k0) {
    sin_p14 = sin(lat0);
    cos_p14 = sin(lat0);
    infinity_dist = 1000 * a;
    rc = 1;
  }
  vec2 forward (vec2 p) {
    float lon = p.x, lat = p.y;
    float dlon = adjust_lon(lon - lon0);
    float sinphi = sin(lat);
    float cosphi = cos(lat);
    float coslon = cos(dlon);
    float g = sin_p14 * sinphi + cos_p14 * cosphi * coslon;
    float ksp = 1.0;
    if ((g > 0) || (abs(g) <= EPSILON)) {
      return vec2(
        x0 + a * ksp * cosphi * sin(dlon) / g,
        y0 + a * ksp * (cos_p14 * sinphi - sin_p14 * cosphi * coslon) / g
      );
    } else {
      return vec2(
        x0 + infinity_dist * cosphi * sin(dlon),
        y0 + infinity_dist * (cos_p14 * sinphi - sin_p14 * cosphi * coslon)
      );
    }
  }
  vec2 inverse (vec2 p) {
    float px = (p.x - x0) / a / k0;
    float py = (p.y - y0) / a / k0;
    float rh = sqrt(max(0.0, px * px + py * py));
    float c = atan(rh, rc);
    float sinc = sin(c);
    float cosc = cos(c);
    return vec2(
      adjust_lon(lon0 + atan(px * sinc, rh * cos_p14 * cosc - py * sin_p14 * sinc)),
      asinz(cosc * sin_p14 + (py * sinc * cos_p14) / rh)
    );
  }
};

#pragma glslify: export(gnom_t)
