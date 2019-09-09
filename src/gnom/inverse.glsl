vec3 gnom_inverse (gnom_t t, vec3 p) {
  p = (p - t.p0) / t.k0;
  float px = p.x/t.a;
  float py = p.y/t.a;
  float rh = sqrt(max(0.0, px * px + py * py));
  float c = atan(rh, t.rc);
  float sinc = sin(c);
  float cosc = cos(c);
  return vec3(
    adjust_lon(t.lon0+atan(px*sinc,rh*t.cos_p14*cosc-py*t.sin_p14*sinc)),
    asinz(cosc*t.sin_p14+(py*sinc*t.cos_p14)/rh),
    (p.z-t.z0)/t.k0
  );
}
vec3 gnom_inverse (gnom_t t, vec2 p) {
  return gnom_inverse(t, vec3(p,0));
}
