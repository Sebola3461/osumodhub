export function hexToRGB(color: string) {
  color = color.replace(/#/g, "");

  if (color.length != 6) {
    throw "Only six-digit hex colors are allowed.";
  }

  var aRgbHex = color.match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];

  return aRgb;
}
