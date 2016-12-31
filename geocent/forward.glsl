#pragma glslify: geocent_t = require('./t.glsl')
const float PI = 3.141592653589793;

vec3 geocent_forward (geocent_t t, vec3 p) { // lon lat height
  float f = 1.0-t.b/t.a;
  float e2 = (2.0-f)*f;
  float rlon = p.x/180.0*PI;
  float rlat = p.y/180.0*PI;
  float clat = cos(rlat);
  float slat = sin(rlat);
  float N = t.a / sqrt(1.0-e2*slat*slat);
  return vec3(
    (N+p.z)*clat*cos(rlon),
    (N+p.z)*clat*sin(rlon),
    (N*(1.0-e2)+p.z)*slat
  );
}
#pragma glslify: export(geocent_forward)
