#ifndef TMERC_T_GLSL
#define TMERC_T_GLSL
struct tmerc_t {
  float lon0, lat0;
  vec3 p0;
  float a, sphere, k0;
  float ml0, ep2, es;
  vec4 e; // e0, e1, e2, e3
};
#endif
