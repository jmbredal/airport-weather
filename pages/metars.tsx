import { Air } from '@mui/icons-material';
import { Box, Container, FormControl, FormLabel, Grid, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { amber } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { MetarComponent } from '../components/MetarComponent';
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
  const metarElements = [...metars].sort(getSortFunction(orderBy)).map(metar => <MetarComponent metar={metar} />);

  return (
    <>
      <Box mb={3} sx={{ backgroundColor: 'primary.dark' }} padding={2}>
        <header style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Air fontSize='large' />

          <h1 className={styles.h1}>
            Airport Weather
          </h1>
        </header>
      </Box>

      <Container className={styles.container} maxWidth={'sm'}>
        <Grid container spacing={2} mb={1} alignItems={'end'}>
          <Grid item xs={6}>
            <FormLabel style={{ color: 'black' }}>Sort</FormLabel>
            <ToggleButtonGroup
              className={styles.togglebuttongroup}
              value={orderBy}
              exclusive
              onChange={handleToggleChange}
              aria-label='Sort'
              size='small'
              fullWidth={true}
              style={{ backgroundColor: amber[500] }}
            >
              <ToggleButton value="icao">Icao</ToggleButton>
              <ToggleButton value="temp">Temp</ToggleButton>
              <ToggleButton value="wind">Wind</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={6}>
            <FormLabel style={{ color: 'black' }}>Airport</FormLabel>
            <FormControl size="small" fullWidth={true}>
              <Select value={selectedAirport}
                labelId='input-label-id'
                onChange={handleSelectChange}
                displayEmpty
                style={{ backgroundColor: amber[500] }}
              >
                <MenuItem value="">All</MenuItem>
                {airportMenuItems}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {metarElements}
      </Container>
    </>
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
