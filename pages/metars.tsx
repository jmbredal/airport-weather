import { Card, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { Metar } from '../interfaces/metar';
import styles from '../styles/Metars.module.css';
import { getMetars } from '../utils/metar-service';

type OrderBy = 'icao' | 'wind' | 'temp';

export default function Metars() {
  console.log('Metars render');
  

  const [metars, setMetars] = useState<Metar[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>('icao');

  const handleToggleChange = (event: any, value: any) => {
    setOrderBy(value);
  }

  useEffect(() => {
    console.log('useEffect');
    
    getMetars().then(metars => setMetars(metars));
  }, []);

  const metarElements = metars.sort(getSortFunction(orderBy)).map(metar => {
    const clouds = metar.clouds?.map(c => {
      return c.code === 'CAVOK' ? 'No clouds' : `${c.text} ${c.meters} m`
    }).join(', ');
    const observed = new Date(metar.observed);
    const conditions = metar.conditions?.map(c => c.text).join(', ');

    return <Card className={styles.card} variant='outlined' key={metar.icao}>
      <header className={styles.header}>
        <h1 className={styles.h1}>{metar.icao}</h1>
        <span>{metar.station.name} ({metar.elevation.meters} m)</span>
      </header>

      <div>
        <p>{observed.toISOString()}</p>

        <ul>
          {metar.wind && <li>Wind: {metar.wind?.speed_mps} m/s ({getWindDescription(metar.wind?.speed_kts)})</li>}
          <li>Temp: {metar.temperature?.celsius}° C</li>
          <li>Visibility: {metar.visibility?.meters} meter</li>
          {clouds && <li>Clouds: {clouds}</li>}
          {conditions && <li>Conditions: {conditions}</li>}
        </ul>
      </div>
    </Card>
  });

  return (
    <Container className={styles.container} maxWidth={'sm'}>
      <h1>Weather at Norwegian airports</h1>

      <small>Sort: </small>
      <ToggleButtonGroup
        color="primary"
        value={orderBy}
        exclusive
        onChange={handleToggleChange}
        aria-label="Platform"
      >
        <ToggleButton value="icao">Icao</ToggleButton>
        <ToggleButton value="temp">Temp</ToggleButton>
        <ToggleButton value="wind">Wind</ToggleButton>
      </ToggleButtonGroup>

      <p></p>

      {metarElements}
    </Container>
  )
}

function getSortFunction(key: OrderBy) {

  // const sortByString = (a: string, b: string) => a.localeCompare(b);
  // const sortByNumber = (a: number, b: number) => a - b;

  return (a: Metar, b: Metar) => {
    switch (key) {
      case 'icao':
        return a.icao.localeCompare(b.icao);
      case 'temp':
        return a.temperature?.celsius - b.temperature.celsius;
      case 'wind':
        return b.wind?.speed_mps - a.wind?.speed_mps;
    }
  }
}

const between = function (n: number, a: number, b: number, inclusive: boolean = true) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return inclusive ? n >= min && n <= max : n > min && n < max;
}

function getWindDescription(knots: number) {
  if (knots === 0) return 'Stille vind';
  if (between(knots, 1, 3)) return 'Flau vind';
  if (between(knots, 4, 6)) return 'Svak vind';
  if (between(knots, 7, 10)) return 'Lett bris';
  if (between(knots, 11, 16)) return 'Laber bris';
  if (between(knots, 17, 21)) return 'Frisk bris';
  if (between(knots, 22, 27)) return 'Liten kuling';
  if (between(knots, 28, 33)) return 'Stiv kuling';
  if (between(knots, 34, 40)) return 'Sterk kuling';
  if (between(knots, 41, 47)) return 'Liten storm';
  if (between(knots, 48, 55)) return 'Full storm';
  if (between(knots, 56, 63)) return 'Sterk storm';
  if (knots > 63) return 'Orkan';
}
