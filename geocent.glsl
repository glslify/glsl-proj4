const float PI = 3.141592653589793;

struct geocent_t {
  float a, b, e, eprime;
  vec3 forward (vec3 p) { // lon lat height
    float f = 1.0 - b/a;
    float e2 = (2.0-f)*f;
    float rlon = p.x/180.0*PI;
    float rlat = p.y/180.0*PI;
    float clat = cos(rlat);
    float slat = sin(rlat);
    float N = a / sqrt(1.0-e2*slat*slat);
    return vec3(
      (N+p.z)*clat*cos(rlon),
      (N+p.z)*clat*sin(rlon),
      (N*(1.0-e2)+p.z)*slat
    );
  }
  vec3 inverse (vec3 p) {
    float f = 1.0 - b/a;
    float pp = sqrt(p.x*p.x+p.y*p.y);
    float theta = atan(p.z*a,pp*b);
    float sintheta = sin(theta);
    float costheta = cos(theta);
    float num = p.z+eprime*eprime*b*sintheta*sintheta*sintheta;
    float denom = pp-e*e*a*costheta*costheta*costheta;
    float lat = atan(num,denom);
    float lon = atan(Y,X);
    float sinlat = sin(lat);
    float denom = sqrt(1.0-e*e*sinlat*sinlat);
    float alt = (pp/cos(lat)) - (a / denom);
    if (p.x < 0.0 && p.y < 0.0) lon -= PI;
    if (p.x < 0.0 && p.y > 0.0) lon += PI;
    return vec3(lon,lat,alt);
  }
};

#pragma glslify: export(geocent_t)
