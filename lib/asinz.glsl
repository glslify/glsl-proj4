float asinz (float x) {
  return asin(clamp(x, -1.0, 1.0));
}

#pragma glslify: export(asinz)
