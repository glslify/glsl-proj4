struct gnom_t {
  float lon0, lat0, x0, y0, z0;
  float sin_p14, cos_p14;
  float a, k0;
  float infinity_dist, rc;
};
#pragma glslify: export(gnom_t)
