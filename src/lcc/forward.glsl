vec3 lcc_forward (lcc_t t, vec3 p) { // lat lon height -> x y z
  p.x = t.ns * (p.x - t.lon0);
  // p.y = clamp(p.y, -HALFPI, HALFPI); // optional ?
  vec2 sintl = sin(p.xy);
  float ts = tsfnz(t.e, p.y, sintl.y);
  float rh1 = t.af0 * pow(ts, t.ns);
  return t.p0 + t.k0 * vec3(
    rh1*sintl.x,
    t.rh-rh1*cos(p.x),
    p.z
  );
}
vec3 lcc_forward (lcc_t t, vec2 p) {
  return lcc_forward(t,vec3(p.xy,0));
}
