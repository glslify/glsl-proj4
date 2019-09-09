vec3 aea_forward (aea_t t, vec3 p) {
  p.x = t.ns0 * (p.x - t.lon0);
  vec2 sinp = sin(p.xy);
  float qs = qsfnz(t.e3, sinp.y);
  float rh1 = t.a_ns0 * sqrt(t.c - t.ns0 * qs);
  return t.p0 + t.k0 * vec3(
    rh1*sinp.x,
    t.rh-rh1*cos(p.x),
    p.z
  );
}
vec3 aea_forward (aea_t t, vec2 p) {
  return aea_forward(t,vec3(p.xy,0));
}
