
interface Props {
  temp: number;
}

export function TempGauge({ temp }: Props) {
  const height = 80;
  const width = 700;
  const mainLineX = temp * 20;

  const viewBox = `0 0 ${width} ${height}`;

  return (
    <svg
      viewBox={viewBox}
    >
      <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>

      <rect
        y={height / 4}
        width={width}
        height={height / 2}
        stroke='black'
        fill='lightgreen'
      />

      <line
        x1={mainLineX}
        x2={mainLineX}
        y1={0}
        y2={height}
        stroke='red'
        strokeWidth={3}
      />

    </svg>
  );
}