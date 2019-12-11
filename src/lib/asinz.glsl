#ifndef ASINZ_GLSL
#define ASINZ_GLSL
float asinz (float x) {
  return asin(clamp(x, -1.0, 1.0));
}
#endif
