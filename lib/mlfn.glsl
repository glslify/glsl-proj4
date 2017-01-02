float mlfn (float e0, float e1, float e2, float e3, float phi) {
  return e0*phi-e1*sin(2.0*phi)+e2*sin(4.0*phi)-e3*sin(6.0*phi);
}
#pragma glslify: export(mlfn)
