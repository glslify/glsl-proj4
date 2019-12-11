#ifndef QSFNZ_GLSL
#define QSFNZ_GLSL
float qsfnz (float eccent, float sinphi) {
  if (eccent <= 1.0e-7) return 2.0*sinphi;
  float c = eccent * sinphi;
  return (1.0-eccent*eccent)*(sinphi/(1.0-c*c)-(0.5/eccent)*log((1.0-c)/(1.0+c)));
}
#endif
