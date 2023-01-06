import { Card, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { TempGauge } from '../components/TempGauge';
import { WindGauge } from '../components/WindGauge';
import { Metar } from '../interfaces/metar';
import styles from '../styles/Metars.module.css';
import { getMetars } from '../utils/metar-service';

type OrderBy = 'icao' | 'wind' | 'temp';

export default function Metars() {
  console.log('Metars render');

  const [metars, setMetars] = useState<Metar[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>('icao');
  const [selectedAirport, setSelectedAirport] = useState('');

  // Handle sort change
  const handleToggleChange = (event: any, value: any) => {
    setOrderBy(value);
  }

  // Handle selected airport change
  const handleSelectChange = (event: SelectChangeEvent) => {
    const icao = event.target.value;
    setSelectedAirport(icao);
  };

  useEffect(() => {
    console.log('effect getmetars');
    getMetars().then(metars => setMetars(metars));
  }, []);

  useEffect(() => {
    if (selectedAirport) {
      const element = document.getElementById(selectedAirport);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAirport]);

  // Airports in the dropdown
  const airportMenuItems = [...metars].sort(sortByName).map(m => {
    return <MenuItem key={m.icao} value={m.icao}>{m.icao}: {m.station.name}</MenuItem>
  });

  // All metar cards
  const metarElements = [...metars].sort(getSortFunction(orderBy)).map(metar => {
    const clouds = metar.clouds?.map(c => {
      return c.code === 'CAVOK' ? 'No clouds' : `${c.text} ${c.meters} m`
    }).join(', ');
    const observed = new Date(metar.observed);
    const conditions = metar.conditions?.map(c => c.text).join(', ');

    return <Card id={metar.icao} className={styles.card} variant='outlined' key={metar.icao}>
      <header className={styles.header}>
        <h1 className={styles.h1}>{metar.icao}</h1>
        <span>{metar.station.name}</span>
      </header>

      <Divider />

      <div>
        <p>Observed: {observed.toLocaleString('no')}</p>

        <div style={{ width: '400px' }}>
          {metar.wind && <WindGauge windSpeed={metar.wind.speed_mps} />}
          {metar.temperature && <TempGauge temp={metar.temperature.celsius} />}
        </div>

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
      <h1 style={{ fontSize: '1.8rem' }}>Norwegian airports weather</h1>

      <Grid container spacing={2} mb={1}>
        <Grid item xs={6}>
          <small>Sort: </small>
          <ToggleButtonGroup
            color='primary'
            value={orderBy}
            exclusive
            onChange={handleToggleChange}
            aria-label='Sort'
            size='small'
          >
            <ToggleButton value="icao">Icao</ToggleButton>
            <ToggleButton value="temp">Temp</ToggleButton>
            <ToggleButton value="wind">Wind</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={6}>
          <FormControl size="small" sx={{ width: '100%' }}>
            <InputLabel id="input-label-id">Airport</InputLabel>
            <Select value={selectedAirport} labelId='input-label-id' label='Airport' onChange={handleSelectChange}>
              <MenuItem value="">-- See all --</MenuItem>
              {airportMenuItems}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {metarElements}
    </Container>
  )
}

function sortByName(a: Metar, b: Metar): number {
  return a.station.name.localeCompare(b.station.name, 'no');
}

function getSortFunction(key: OrderBy) {
  return (a: Metar, b: Metar) => {
    switch (key) {
      case 'icao':
        return a.icao.localeCompare(b.icao);
      case 'temp':
        return !a.temperature ? 100 : !b.temperature ? -100 : a.temperature?.celsius - b.temperature.celsius;
      case 'wind':
        return !a.wind ? 100 : !b.wind ? -100 : b.wind?.speed_mps - a.wind?.speed_mps;
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
