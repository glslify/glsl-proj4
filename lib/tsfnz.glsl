const float PI = 3.141592653589793;

float tsfnz (float eccent, float phi, float sinphi) {
  float con = eccent * sinphi;
  float com = 0.5 * eccent;
  con = pow(((1.0-con)/(1.0+con)),com);
  return tan(0.5*(PI*0.5-phi))/con;
}
#pragma glslify: export(tsfnz)
