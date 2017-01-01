#pragma glslify: geocent_t = require('./t.glsl')
const float PI = 3.141592653589793;

vec3 geocent_forward (geocent_t t, vec3 p) { // lon lat height
  vec2 r = p.xy*180.0/PI;
  float coslon = cos(r.x), coslat = cos(r.y);
  float sinlon = sin(r.x), sinlat = sin(r.y);
  float f = 1.0-t.b/t.a;
  float e2 = (2.0-f)*f;
  float N = t.a / sqrt(1.0-e2*sin(r.y)*sin(r.y));
  return vec3(
    -(N+p.z)*coslon*coslat,
    (N*(1.0-e2)+p.z)*sinlat,
    (N+p.z)*sinlon*coslat
  );
}
#pragma glslify: export(geocent_forward)
