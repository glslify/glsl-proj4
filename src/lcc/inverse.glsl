vec3 lcc_inverse (lcc_t t, vec3 p) {
  p = (p - t.p0) / t.k0;
  p.y = t.rh - p.y;
  float rh1 = length(p.xy);

  float theta = rh1 > EPSILON ? atan(p.x, p.y) : 0.0;
  if (t.ns < 0.0) {
    rh1 = -rh1;
    theta += PI;
  }
  theta = theta/t.ns + t.lon0;

  float phi = -HALFPI;
  if (abs(rh1) > EPSILON || t.ns > 0.0) {
    float ts = pow(rh1 / t.af0, 1.0 / t.ns);
    phi = phi2z(t.e, ts);
  }

  return vec3(theta, phi, p.z);
}
vec3 lcc_inverse (lcc_t t, vec2 p) {
  return lcc_inverse(t,vec3(p,0));
}
