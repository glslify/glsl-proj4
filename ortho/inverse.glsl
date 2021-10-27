#pragma glslify: ortho_t = require('./t.glsl')
#pragma glslify: asinz = require('../lib/asinz.glsl')

const float PI = 3.141592653589793;
const float EPSILON = 1e-10;
vec3 ortho_inverse (ortho_t t, vec3 p) {
  float px = (p.x-t.x0)/t.k0;
  float py = (p.y-t.y0)/t.k0;
  float rh = length(p.xy);
  float z = asinz(rh / t.a);
  float sinz = sin(z);
  float cosz = cos(z);
  float alt = p.z;
  if (abs(rh) <= EPSILON) return vec3(t.lon0, t.lat0, alt);
  float lon = t.lon0;
  float sinlat = sin(t.lat0), coslat = cos(t.lat0);
  float lat = asinz(cosz*sinlat + (p.y*sinz*coslat) / rh);
  float con = abs(t.lat0) - PI*0.5;
  if (abs(con) <= EPSILON) {
    float w = step(0.0,t.lat0)*2.0-1.0;
    lon = t.lon0 + atan(p.x*w,-p.y*w);
    return vec3(lon*180.0/PI,lat*180.0/PI,alt);
  }
  lon = t.lon0 + atan((p.x*sinz),rh*coslat*cosz-p.y*sinlat*sinz);
  //float alt = (sqp/cos(lat))-t.a/sqrt(1.0-t.e*t.e*sinlat*sinlat);
  return vec3(lon*180.0/PI,lat*180.0/PI,alt);
}
#pragma glslify: export(ortho_inverse)
