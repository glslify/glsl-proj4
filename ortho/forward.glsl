#pragma glslify: ortho_t = require('./t.glsl')
const float PI = 3.141592653589793;

vec3 ortho_forward (ortho_t t, vec3 p) { // lon lat height
  vec2 r = p.xy*PI/180.0;
  vec2 q = vec2(t.lon0,t.lat0);
  float coslon = cos(PI+r.x-q.x), coslat = cos(r.y);
  float sinlon = sin(PI+r.x-q.x), sinlat = sin(r.y);
  float z = t.z0+t.a*t.k0*(sin(q.y)*sinlat+cos(q.y)*coslat*coslon);
  // In the gdal version, when z is < 0.0, the result is infinity but we can't do that here.
  return vec3(
    t.x0+t.a*t.k0*coslat*sinlon,
    t.y0+t.a*t.k0*(cos(q.y)*sinlat-sin(q.y)*coslat*coslon),
    z // the gdal version passes through p.z but that is far less useful
  );
}
vec3 ortho_forward (ortho_t t, vec2 p) {
  return ortho_forward(t,vec3(p,0));
}
#pragma glslify: export(ortho_forward)
