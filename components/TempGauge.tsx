import { getIndicatorPath } from "../utils/gauge-utils";

interface Props {
  temp: number;
}

export function TempGauge({ temp }: Props) {
  const height = 80;
  const width = 700;
  const tempMax = 40;
  const tempMin = -30;

  const getX = (temp: number): number => {
    const diff = tempMax - tempMin;
    const pixelsPerDegree = width / diff;

    return (pixelsPerDegree * (temp + Math.abs(tempMin)));
  }

  const mainLineX = getX(temp);

  const viewBox = `0 0 ${width + 20} ${height}`;

  const markerTemps = [-30, -20, -10, 0, 10, 20, 30, 40];
  const tempLines = markerTemps.map((t, i) => {
    const x = getX(t);

    return <line
      key={i}
      x1={x}
      x2={x}
      y1={0}
      y2={height / 4}
      stroke='black'
      strokeWidth={1}
    />
  });

  const tempLabels = markerTemps.map((t, i) => {
    return <text
      key={i}
      x={getX(t)}
      y={height - 2}
      textAnchor="middle"
    >{t}</text>
  });

  return (
    <svg
      viewBox={viewBox}
    >
      <linearGradient id="GradientLow" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stopColor="blue" />
        <stop offset="100%" stopColor="lightblue" />
      </linearGradient>

      <linearGradient id="GradientHigh" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stopColor="#2ECC40" />
        <stop offset="50%" stopColor="yellow" />
        <stop offset="100%" stopColor="#FF645C" />
      </linearGradient>

      <g transform="translate(10 0)">
        <rect
          x={0}
          y={height / 4}
          width={width / 7 * 3}
          height={height / 2}
          fill="url(#GradientLow)"
        />

        <rect
          x={width / 7 * 3}
          y={height / 4}
          width={width / 7 * 4}
          height={height / 2}
          fill="url(#GradientHigh)"
        />

        {tempLines}
        {tempLabels}

        {/* Temp Indicator */}

        <path d={getIndicatorPath(height, mainLineX)} />
      </g>

    </svg>
  );
}
