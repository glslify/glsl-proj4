vec3 geocent_inverse (geocent_t t, vec3 p) {
  p = (p-t.p0)/t.k0;
  float sqp = length(p.xy);
  float theta = atan(p.z*t.a,sqp*t.b);
  float sintheta = sin(theta);
  float costheta = cos(theta);
  float lat = atan(
    p.z+t.eprime*t.eprime*t.b*sintheta*sintheta*sintheta,
    sqp-t.e*t.e*t.a*costheta*costheta*costheta
  );
  float lon = atan(p.y,p.x);
  float sinlat = sin(lat);
  float coslat = cos(lat);
  float alt = (sqp/coslat)-t.a/sqrt(1.0-t.e*t.e*sinlat*sinlat);
  return vec3(lon,lat,alt);
}
