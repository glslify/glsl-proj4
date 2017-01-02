#pragma glslify: geocent_t = require('./t.glsl')
const float PI = 3.141592653589793;
vec3 geocent_inverse (geocent_t t, vec3 p) {
  float sqp = sqrt(p.x*p.x+p.z*p.z);
  float theta = atan(p.y*t.a,sqp*t.b);
  float sintheta = sin(theta), costheta = cos(theta);
  float lat = atan(
    p.y+t.eprime*t.eprime*t.b*sintheta*sintheta*sintheta,
    sqp-t.e*t.e*t.a*costheta*costheta*costheta
  );
  float lon = atan(p.x,p.z);
  float sinlat = sin(lat);
  float alt = (sqp/cos(lat))-t.a/sqrt(1.0-t.e*t.e*sinlat*sinlat);
  return vec3(lon*180.0/PI,lat*180.0/PI,alt);
}
#pragma glslify: export(geocent_inverse)
