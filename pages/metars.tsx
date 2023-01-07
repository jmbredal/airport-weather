import { Visibility, CloudOutlined } from '@mui/icons-material';
import { Card, Container, Divider, FormControl, Grid, Icon, InputLabel, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { TempGauge } from '../components/TempGauge';
import { WindGauge } from '../components/WindGauge';
import { Metar } from '../interfaces/metar';
import styles from '../styles/Metars.module.css';
import { getMetars } from '../utils/metar-service';
import { getWindDescription } from '../utils/windspeed';

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
      return c.code === 'CAVOK' ? 'No clouds' : `${c.text} ${c.meters ? `${c.meters} m` : ''}`
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

        {metar.wind &&
          <div>
            <h3 className={styles.h3}>Wind: {metar.wind?.speed_mps} m/s ({getWindDescription(metar.wind?.speed_mps)})</h3>
            <WindGauge windSpeed={metar.wind.speed_mps} />
          </div>
        }

        {metar.temperature &&
          <div>
            <h3 className={styles.h3}>Temp: {metar.temperature?.celsius}° C</h3>
            <TempGauge temp={metar.temperature.celsius} />
          </div>
        }

        {metar.visibility &&
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Visibility />
            <span>Visibility: {metar.visibility?.meters} meter</span>
          </div>
        }

        {(clouds || conditions) &&
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CloudOutlined />
            <div>
              {clouds && <div>Clouds: {clouds}</div>}
              {conditions && <div>Conditions: {conditions}</div>}
            </div>
          </div>
        }

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
