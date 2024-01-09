function interpolate(start: number, end: number, percent: number) {
  return start + percent * (end - start);
}

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

function generateGradientArray(
  startColor: string,
  endColor: string,
  steps: number
) {
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  const gradientArray = [];

  for (let i = 0; i < steps; i++) {
    const percent = i / (steps - 1);
    const interpolatedColor = [
      Math.round(interpolate(startRgb[0], endRgb[0], percent)),
      Math.round(interpolate(startRgb[1], endRgb[1], percent)),
      Math.round(interpolate(startRgb[2], endRgb[2], percent)),
    ];
    gradientArray.push(`rgb(${interpolatedColor.join(",")})`);
  }

  return gradientArray;
}

export function generateLinearGradientArray(
  startColor: string,
  endColor: string
) {
  const steps = 100;

  return generateGradientArray(startColor, endColor, steps);
}
