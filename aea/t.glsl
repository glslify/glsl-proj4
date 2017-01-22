struct aea_t {
  float lon0, lat0, lat1, lat2;
  float x0, y0, z0, e3;
  float ns0, rh, a, c;
  float sphere;
};
#pragma glslify: export(aea_t)
