vec3 geocent_forward (geocent_t t, vec3 p) { // lon lat height
  vec2 cosp = cos(p.xy);
  vec2 sinp = sin(p.xy);
  float N = t.a / sqrt(1.0-t.e2*sinp.y*sinp.y);
  float Npz = N + p.z;
  vec2 q = (Npz * cosp.y) * vec2(cosp.x, sinp.x);
  return t.p0 + t.k0 * vec3(q, (Npz-N*t.e2)*sinp.y);
}
vec3 geocent_forward (geocent_t t, vec2 p) {
  return geocent_forward(t,vec3(p,0));
}
