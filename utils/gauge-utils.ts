export function getIndicatorPath(height: number, mainLineX: number) {
  const indicatorSize = 10;
  const indicatorHeight = 13;
  const indicatorYmin = height / 4;
  const startPoint = `${mainLineX} ${indicatorYmin}`;
  const line1 = `L${mainLineX + indicatorSize} ${indicatorYmin - indicatorHeight}`;
  const line2 = `L${mainLineX - indicatorSize} ${indicatorYmin - indicatorHeight}`;
  const indicatorCoords = `M${startPoint} ${line1} ${line2} Z`;

  return indicatorCoords;
}