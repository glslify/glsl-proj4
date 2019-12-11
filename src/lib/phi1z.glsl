#ifndef PHI1Z_GLSL
#define PHI1Z_GLSL
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
  return 3.402823466e+38; // FLT_MAX
}
#endif
