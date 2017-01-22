#pragma glslify: geocent_t = require('./t.glsl')
const float PI = 3.141592653589793;

vec3 geocent_forward (geocent_t t, vec3 p) { // lon lat height
  vec2 r = p.xy*PI/180.0;
  float coslon = cos(PI+r.x), coslat = cos(r.y);
  float sinlon = sin(PI+r.x), sinlat = sin(r.y);
  float f = 1.0-t.b/t.a;
  float e2 = (2.0-f)*f;
  float N = t.a / sqrt(1.0-e2*sinlat*sinlat);
  return vec3(
    t.x0-t.k0*(N+p.z)*coslon*coslat,
    t.y0-t.k0*(N+p.z)*sinlon*coslat,
    t.z0+t.k0*(N*(1.0-e2)+p.z)*sinlat
  );
}
vec3 geocent_forward (geocent_t t, vec2 p) {
  return geocent_forward(t,vec3(p,0));
}
#pragma glslify: export(geocent_forward)
