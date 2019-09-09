float adjust_lon (float x) {
  //return abs(x) <= SPI ? x : (x - sign(x) * TAU);
	return fract((x+PI)/TAU)*TAU - PI;
}
