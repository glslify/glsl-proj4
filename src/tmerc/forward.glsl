vec3 tmerc_forward (tmerc_t t, vec3 p) {
  float lon = p.x, lat = p.y;
  float dlon = lon - t.lon0;
  float sinphi = sin(lat), cosphi = cos(lat);
  float con;
  if (t.sphere > 0.5) {
    float b = cosphi * sin(dlon);
    con = acos(cosphi*cos(dlon)/sqrt(1.0-b*b))*sign(lat);
    return t.p0+t.k0*vec3(
      0.5*t.a*log((1.0+b)/(1.0-b)),
      t.a*(con-t.lat0),
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
  float ml = t.a*mlfn(t.e,lat);
  return t.p0+t.k0*vec3(
    n*al*(1.0+als/6.0*(1.0-tq2+c+als/20.0
      *(5.0-18.0*tq2+tq2*tq2+72.0*c-58.0*t.ep2))),
    ml-t.ml0+n*tq*(als*(0.5+als/24.0*(5.0-tq2+9.0*c+4.0*c*c+als/30.0
      *(61.0-58.0*tq2+tq2*tq2+600.0*c-330.0*t.ep2)))),
    p.z
  );
}
vec3 tmerc_forward (tmerc_t t, vec2 p) {
  return tmerc_forward(t,vec3(p,0));
}
