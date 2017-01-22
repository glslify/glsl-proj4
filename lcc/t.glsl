struct lcc_t {
  float lon0, lat0, lat1, lat2;
  float x0, y0, z0;
  float a, b, e;
  float k0, ns, f0, rh;
};
#pragma glslify: export(lcc_t)
