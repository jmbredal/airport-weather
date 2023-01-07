import { Container } from "@mui/material";
import { WindGauge } from "../../components/WindGauge";
import { getWindDescription } from "../../utils/windspeed";

// range(0, 2) => [0, 1, 2]
// range(0, 10, 2) => [0, 2, 4, 6, 8, 10]
function range(from: number, to: number, step = 1): number[] {
  const _range = [];
  for (let index = from; index <= to; index += step) {
    _range.push(index);
  }

  return _range;
}

export default function Test() {

  const gauges = range(0, 35).map((ms, index) => {

    return <div key={index} style={{ borderBottom: '1px solid black' }}>
      <small>Windspeed {ms} {getWindDescription(ms)}</small>
      <WindGauge windSpeed={ms} />
    </div>
  });

  return (
    <Container maxWidth={'sm'}>
      {gauges}
    </Container>
  );
}