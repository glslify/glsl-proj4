#pragma glslify: adjust_lon = require('./lib/adjust_lon.glsl')
#pragma glslify: asinz = require('./lib/asinz.glsl')

const float EPSILON = 1.0e-10;

struct gnom_t {
  float lon0, lat0, x0, y0;
  float sin_p14, cos_p14;
  float a, k0;
  float infinity_dist, rc;
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
