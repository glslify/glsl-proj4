
#pragma glslify: adjust_lon = require('../lib/adjust_lon.glsl')
#pragma glslify: asinz = require('../lib/asinz.glsl')

const float EPSILON = 1.0e-10;

  vec2 forward (vec2 p) {
    float lon = p.x, lat = p.y;
    float sin_phi = sin(lat);
    float cos_phi = cos(lat);
    float qs = qsfnz(e3, sin_phi, cos_phi);
    float rh1 = a * sqrt(c - ns0 * qs) / ns0;
    float theta = ns0 * adjust_lon(lon - lon0);
    return vec2(
      rh1 * sin(theta) + x0,
      rh - rh1 * cos(theta) + y0
    );
  }
  float _phi1z (float eccent, float qs) {
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
      if (abs(dphi) < 1e-7) return phi;
    }
    return Infinity;
  }
  vec2 inverse (vec2 p) {
    float px = p.x - x0, py = r - p.y + y0;
    float con = sign(ns0);
    float rh1 = con * sqrt(px*px + py*py);
    float theta = step(EPSILON,abs(rh1)) * atan(con * px, con * py);
    con = rh1 * ns0 / a;
    return vec2(
      adjust_lon(theta / ns0 + lon0),
      sphere > EPSILON
        ? asin((c - con*con) / (2.0*ns0))
        : philz(e3, (c - con*con) / ns0)
    );
  }
};

#pragma glslify: export(aea_t)
