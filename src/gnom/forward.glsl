vec3 gnom_forward (gnom_t t, vec3 p) {
  p.x -= t.lon0;
  vec2 sinp = sin(p.xy);
  vec2 cosp = cos(p.xy);
  vec3 v = vec3(sinp.y, cosp.y*sinp.x, cosp.y*cosp.x);
  float g = t.sin_p14 * v.x + t.cos_p14 * v.z;
  float aksp_g = (g >= -EPSILON) ? t.a/g : t.infinity_dist;
  return t.p0+t.k0*vec3(
    aksp_g*v.y,
    aksp_g*(t.cos_p14*v.x-t.sin_p14*v.z),
    p.z
  );
}
vec3 gnom_forward (gnom_t t, vec2 p) {
  return gnom_forward(t,vec3(p,0));
}
