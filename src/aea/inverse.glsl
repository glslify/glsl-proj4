vec3 aea_inverse (aea_t t, vec3 p) {
  p = (p - t.p0) / t.k0;
  p.y -= t.rh;
  float absrh1 = length(p.xy);
  float theta = atan(t.ns0 * p.x, -t.ns0 * p.y);
  float con = absrh1 / t.a_ns0;
  float qs = (t.c - con*con) / t.ns0;
  return vec3(
    adjust_lon(theta / t.ns0 + t.lon0),
    phi1z(t.e3, qs), // t.sphere > EPSILON ? asin(0.5 * qs) : phi1z(t.e3, qs),
    p.z
  );
}
vec3 aea_inverse (aea_t t, vec2 p) {
  return aea_inverse(t,vec3(p,0));
}
