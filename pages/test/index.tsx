import { Container } from "@mui/material";
import { TempGauge } from "../../components/TempGauge";
import { WindDirection } from "../../components/WindDirection";
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

  const directions = range(0, 360, 10).map((direction, index) => {
    return <div key={index} style={{ flex: '0 0 5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <small>{direction}</small>
      <WindDirection direction={direction} />
    </div>
  });

  const gauges = range(0, 35).map((ms, index) => {
    return <div key={index} style={{ borderBottom: '1px solid black' }}>
      <small>Windspeed {ms} {getWindDescription(ms)}</small>
      <WindGauge windSpeed={ms} />
    </div>
  });

  const temps = range(-30, 40).map((temp, index) => {
    return <div key={index} style={{ borderBottom: '1px solid black' }}>
      <small>Temp {temp}</small>
      <TempGauge temp={temp} />
    </div>
  });

  return (
    <Container maxWidth={'sm'}>
      <h1>TestPage</h1>

      <h2>Wind direction</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap'}}>
        {directions}
      </div>

      <h2>Windgauges</h2>

      {gauges}

      <h2>Tempgauges</h2>
      {temps}
    </Container>
  );
}