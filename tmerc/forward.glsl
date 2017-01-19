#pragma glslify: tmerc_t = require('./t.glsl')
#pragma glslify: mlfn = require('../lib/mlfn.glsl')

const float PI = 3.141592653589793;
const float EPSILON = 1e-10;

vec3 tmerc_forward (tmerc_t t, vec3 p) {
  float lon = p.x/180.0*PI, lat = p.y/180.0*PI;
  float dlon = lon - t.lon0;
  float sinphi = sin(lat), cosphi = cos(lat);
  float con;
  if (t.sphere > 0.5) {
    float b = cosphi * sin(dlon);
    con = acos(cosphi*cos(dlon)/sqrt(1.0-b*b))*sign(lat);
    return vec3(
      0.5*t.a*t.k0*log((1.0+b)/(1.0-b)),
      t.a*t.k0*(con-t.lat0),
      p.z
    );
  }
  float al = cosphi*dlon;
  float als = al*al;
  float c = t.ep2*cosphi*cosphi;
  float tq = tan(lat);
  float tq2 = tq*tq;
  con = 1.0-t.es*sinphi*sinphi;
  float n = t.a/sqrt(con);
  float ml = t.a*mlfn(t.e0,t.e1,t.e2,t.e3,lat);
  return vec3(
    t.k0*n*al*(1.0+als/6.0*(1.0-tq2+c+als/20.0
      *(5.0-18.0*tq2+tq2*tq2+72.0*c-58.0*t.ep2)))+t.x0,
    t.k0*(ml-t.ml0+n*tq*(als*(0.5+als/24.0*(5.0-tq2+9.0*c+4.0*c*c+als/30.0
      *(61.0-58.0*tq2+tq2*tq2+600.0*c-330.0*t.ep2)))))+t.y0,
    p.z
  );
}
vec3 tmerc_forward (tmerc_t t, vec2 p) {
  return tmerc_forward(t,vec3(p,0));
}
#pragma glslify: export(tmerc_forward)
