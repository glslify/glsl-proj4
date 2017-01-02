struct tmerc_t {
  float lon0, lat0, x0, y0;
  float a, sphere, k0;
  float e0, e1, e2, e3, ml0, ep2, es;
};
#pragma glslify: export(tmerc_t)
