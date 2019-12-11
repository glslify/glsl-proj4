#ifndef MLFN_GLSL
#define MLFN_GLSL
float mlfn (vec4 e, float phi) {
  return dot(e,vec4(phi,sin(phi*vec3(-2.0,4.0,-6.0))));
  // e0*phi-e1*sin(2.0*phi)+e2*sin(4.0*phi)-e3*sin(6.0*phi);
}

float mlfn (float e0, float e1, float e2, float e3, float phi) {
  return mlfn(vec4(e0,e1,e2,e3),phi);
}
#endif
