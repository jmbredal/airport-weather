
interface Props {
  windSpeed: number;
}

export function WindGauge({ windSpeed }: Props) {
  const height = 80;
  const width = 700;
  const mainLineX = windSpeed * 20;

  const viewBox = `0 0 ${width + 20} ${height}`;

  const mainWindStrengths = [
    { maxSpeed: 108, minSpeed: 34, label: 'Bris' },
    { maxSpeed: 208, minSpeed: 108, label: 'Kuling' },
    { maxSpeed: 326, minSpeed: 208, label: 'Storm' },
    { maxSpeed: 600, minSpeed: 326, label: 'Orkan' },
  ];

  const mainWindStrengthLines = mainWindStrengths.map((w, i) => {
    const x = w.minSpeed * 2;

    return <line
      key={i}
      x1={x}
      x2={x}
      y1={height / 4}
      y2={height / 4 * 3}
      stroke='#333'
      strokeWidth={1}
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
          fill='lightgreen'
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