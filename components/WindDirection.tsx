interface Props {
  direction: number;
}

export function WindDirection({ direction }: Props) {
  const height = 100;
  const width = 100;
  const radius = width / 2;
  const strokeWidth = 5;

  const viewBox = `0 0 ${width} ${height}`;
  const transform = `rotate(${direction - 90} ${radius} ${radius})`;

  return (
    <svg
      viewBox={viewBox}
    >

      <circle cx={radius} cy={radius} r={radius - strokeWidth}
        fill={'none'} stroke='black' strokeWidth={strokeWidth}
      />

      <g transform={transform}>
        <path d={getArrowPath(radius)} />
      </g>
    </svg>);
}

const getArrowPath = (radius: number) => {
  const arrowWidth = 15;
  const width = radius * 2;
  const distanceFromPoint = 15;
  const distanceFromBack = 20;
  const startPoint = `${distanceFromPoint} ${radius}`;
  const line1 = `L${width - distanceFromBack} ${radius + arrowWidth}`;
  const line2 = `L${width - distanceFromBack} ${radius - arrowWidth}`;
  const arrowPath = `M${startPoint} ${line1} ${line2} Z`;
  return arrowPath;  
}