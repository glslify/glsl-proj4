#pragma glslify: geocent_t = require('./t.glsl')
const float PI = 3.141592653589793;
vec3 geocent_inverse (geocent_t t, vec3 p) {
  float f = 1.0 - t.b/t.a;
  float pp = sqrt(p.x*p.x+p.y*p.y);
  float theta = atan(p.z*a,pp*b);
  float sintheta = sin(theta);
  float costheta = cos(theta);
  float num = p.z+t.eprime*t.eprime*b*sintheta*sintheta*sintheta;
  float denom = pp-t.e*t.e*a*costheta*costheta*costheta;
  float lat = atan(num,denom);
  float lon = atan(p.y,p.x);
  float sinlat = sin(lat);
  float denom = sqrt(1.0-e*e*sinlat*sinlat);
  float alt = (pp/cos(lat)) - (t.a / denom);
  if (p.x < 0.0 && p.y < 0.0) lon -= PI;
  if (p.x < 0.0 && p.y > 0.0) lon += PI;
  return vec3(lon,lat,alt);
}
#pragma glslify: export(geocent_inverse)
