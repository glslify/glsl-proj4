const float SPI = 3.14159265359;
const float TAU = 6.283185307179586;

float adjust_lon (x) {
  return abs(x) <= SPI ? x : (x - sign(x) * TAU);
}

#pragma glslify: export(adjust_lon)
