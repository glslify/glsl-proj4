#ifndef GNOM_T_GLSL
#define GNOM_T_GLSL
struct gnom_t {
  float lon0, lat0;
  vec3 p0;
  float sin_p14, cos_p14;
  float a, k0;
  float infinity_dist, rc;
};
#endif
