vec3 gnom_inverse (gnom_t t, vec3 p) {
  p = (p - t.p0) / t.k0;
  p.xy /= t.a;
  float rh = length(p.xy);
  float c = atan(rh, t.rc);
  float sinc = sin(c);
  float cosc = cos(c);
  return vec3(
    adjust_lon(t.lon0+atan(p.x*sinc,rh*t.cos_p14*cosc-p.y*t.sin_p14*sinc)),
    asinz(cosc*t.sin_p14+(p.y*sinc*t.cos_p14)/rh),
    p.z
  );
}
vec3 gnom_inverse (gnom_t t, vec2 p) {
  return gnom_inverse(t, vec3(p,0));
}
