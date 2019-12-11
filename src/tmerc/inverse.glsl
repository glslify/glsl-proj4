vec3 tmerc_inverse (tmerc_t t, vec3 p) {
  float con;
  if (t.sphere > 0.5) {
    p.z -= t.p0.z;
    p /= t.k0;
    float f = exp(p.x/t.a);
    float g = 0.5*(f-1.0/f);
    con = t.lat0+(p.y/t.a);
    float h = cos(con);
    return vec3(
      atan(g,h)+t.lon0,
      asinz(sqrt(1.0-h*h)/(1.0+g*g))*sign(con),
      p.z
    );
  }
  p = (p-t.p0)/t.k0;
  con = (t.ml0+p.y)/t.a;
  float phi = con;
  float dphi;
  for (int i = 0; i < 25; i++) {
    dphi = (con-mlfn(t.e,phi))/t.e[0];
    phi += dphi;
    if (abs(dphi) < EPSILON) break;
  }
  if (abs(phi) >= HALFPI) {
    return vec3(t.lon0,HALFPI*sign(p.y),p.z);
  }
  float sinphi = sin(phi), cosphi = cos(phi), tanphi = tan(phi);
  float c = t.ep2*cosphi*cosphi;
  float cs = c*c;
  float t2 = tanphi*tanphi;
  float ts = t2*t2;
  con = 1.0-t.es*sinphi*sinphi;
  float n = t.a/sqrt(con);
  float r = n*(1.0-t.es)/con;
  float d = p.x/n;
  float ds = d*d;
  return vec3(
    t.lon0+(d*1.0-ds/6.0*(1.0+2.0*t2+c-ds/20.0*
      (5.0-2.0*c+28.0*t2-3.0*cs+8.0*t.ep2+24.0*ts)))/cosphi,
    phi-(n*tanphi*ds/r)*(0.5-ds/24.0*(5.0+3.0*t2+10.0*c-4.0*cs-9.0*t.ep2
      -ds/30.0*(61.0+90.0*t2+298.0*c+45.0*ts-252.0*t.ep2-3.0*cs))),
    p.z
  );
}
vec3 tmerc_inverse (tmerc_t t, vec2 p) {
  return tmerc_inverse(t, vec3(p,0));
}
