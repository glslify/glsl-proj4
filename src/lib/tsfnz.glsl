#ifndef TSFNZ_GLSL
#define TSFNZ_GLSL
float tsfnz (float eccent, float phi, float sinphi) {
  float con = eccent * sinphi;
  float com = 0.5 * eccent;
  con = pow(((1.0-con)/(1.0+con)),com);
  return tan(0.5*(HALFPI-phi))/con;
}
#endif
