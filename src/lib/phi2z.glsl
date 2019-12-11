#ifndef PHI2Z_GLSL
#define PHI2Z_GLSL
float phi2z (float eccent, float ts) {
  float eccnth = 0.5 * eccent;
  float con, dphi;
  float phi = HALFPI-2.0*atan(ts);
  for (int i = 0; i <= 15; i++) {
    con = eccent * sin(phi);
    dphi = PI*0.5-2.0*atan(ts*pow((1.0-con)/(1.0+con),eccnth))-phi;
    phi += dphi;
    if (abs(dphi) <= EPSILON) return phi;
  }
  return -9999.0;
}
#endif
