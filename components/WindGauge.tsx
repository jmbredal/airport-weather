
interface Props {
  windSpeed: number;
}

export function WindGauge({ windSpeed }: Props) {
  const height = 80;
  const width = 700;
  const mainLineX = windSpeed * 20;

  const viewBox = `0 0 ${width + 20} ${height}`;

  const mainWindStrengths = [
    { maxSpeed: 108, minSpeed: 34, label: 'Bris', color: '#2ECC40' },
    { maxSpeed: 208, minSpeed: 108, label: 'Kuling', color: '#FF851B' },
    { maxSpeed: 326, minSpeed: 208, label: 'Storm', color: '#FF645C' },
    { maxSpeed: 350, minSpeed: 326, label: 'Orkan', color: '#B10DC9' },
  ];

  const mainWindStrengthLines = mainWindStrengths.map((w, i) => {
    const x = w.minSpeed * 2;
    const width = (w.maxSpeed - w.minSpeed) * 2;

    return <rect
      key={i}
      x={x}
      width={width}
      y={height / 4}
      height={height / 2}
      fill={w.color}
      stroke='black'
    />
  });

  const mainWindStrengthLabels = mainWindStrengths
    .filter(w => w.label !== 'Orkan')
    .map((w, i) => {
      const x = ((w.maxSpeed - w.minSpeed) / 2) + w.minSpeed;

      return <text
        key={i}
        x={x * 2}
        y={(height / 2) + 2}
        stroke='#333'
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={28}
      >{w.label}</text>
    });

  return (
    <svg
      viewBox={viewBox}
    >

      <g transform="translate(10 0)">
        <rect
          y={height / 4}
          width={width}
          height={height / 2}
          stroke='black'
          fill='#01FF70'
        />

        {mainWindStrengthLines}
        {mainWindStrengthLabels}

        <line
          x1={mainLineX}
          x2={mainLineX}
          y1={0}
          y2={height}
          stroke='red'
          strokeWidth={3}
        />
      </g>

    </svg>
  );
}