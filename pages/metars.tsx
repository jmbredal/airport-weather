import { useEffect, useState } from 'react';
import { Metar } from './interfaces/metar';
import Button from '@mui/material/Button';
import styles from '../styles/Metar.module.css'

type OrderBy = 'icao' | 'wind' | 'temp';

export default function Metars() {

  const [metars, setMetars] = useState<Metar[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>('icao');

    useEffect(() => {
    fetch('/api/metars')
      .then(res => res.json())
      .then(metars => setMetars(metars));
  }, []);

  const metarElements = metars.sort(getSortFunction(orderBy)).map(metar => {
    return <section key={metar.icao}>
      <header>s
        <h1>{metar.icao}</h1>
        <span>{metar.station.name}</span>
      </header>

      <div>
        <ul>
          <li>Vind: {metar.wind?.speed_mps} m/s ({getWindDescription(metar.wind?.speed_kts)})</li>
          <li>Temp: {metar.temperature?.celsius}° C</li>
        </ul>
      </div>
    </section>
  });

  return (
    <>
      <>
        <Button variant='contained' onClick={() => { setOrderBy('icao') }}>Icao</Button>
        <Button variant='outlined' onClick={() => { setOrderBy('wind') }}>Vind</Button>
        <Button onClick={() => { setOrderBy('temp') }}>Temp</Button>
      </>

      {metarElements}
    </>
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
        return a.wind?.speed_mps - b.wind?.speed_mps;
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
