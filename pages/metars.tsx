import { Alert, Button, Container, Grid, SelectChangeEvent, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { MetarComponent } from '../components/MetarComponent';
import PageHeader from '../components/PageHeader';
import SelectAirportComponent from '../components/SelectAirportComponent';
import SortIcaoComponent from '../components/SortIcaoComponent';
import { Metar } from '../interfaces/metar';
import styles from '../styles/Metars.module.css';
import { getMetars } from '../utils/metar-service';

type OrderBy = 'icao' | 'wind' | 'temp';

export default function Metars() {
  console.log('Metars render');

  const [metars, setMetars] = useState<Metar[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>('icao');
  const [selectedAirport, setSelectedAirport] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // Handle sort change
  const handleToggleChange = (event: any, value: any) => {
    setOrderBy(value);
  }

  // Handle selected airport change
  const handleSelectChange = (event: SelectChangeEvent) => {
    const icao = event.target.value;
    setSelectedAirport(icao);
  };

  // Handle snackbar close
  const handleClose = () => {
    setIsErrorOpen(false);
  }

  const updateMetars = () => {
    setIsErrorOpen(false);

    getMetars().then(result => {
      if (result.ok) {
        setMetars(result.value as Metar[]);
      } else {
        setIsErrorOpen(true);
      }
    });
  }

  useEffect(() => {
    console.log('effect getmetars');
    updateMetars();
  }, []);

  useEffect(() => {
    if (selectedAirport) {
      const element = document.getElementById(selectedAirport);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAirport]);

  // All metar cards
  const metarElements = [...metars].sort(getSortFunction(orderBy)).map(metar => <MetarComponent metar={metar} />);

  return (
    <>
      <PageHeader />

      <Snackbar open={isErrorOpen} onClose={handleClose}>
        <Alert severity="error" sx={{ width: '100%' }} action={<Button onClick={updateMetars}>Reload metars</Button>}>
          Error fetching metars
        </Alert>
      </Snackbar>

      <Container className={styles.container} maxWidth={'sm'}>
        <Grid container spacing={2} mb={1} alignItems={'end'}>
          <Grid item xs={6}>
            <SortIcaoComponent onChange={handleToggleChange} orderBy={orderBy} />
          </Grid>

          <Grid item xs={6}>
            <SelectAirportComponent metars={metars} onChange={handleSelectChange} selectedAirport={selectedAirport} />
          </Grid>
        </Grid>

        {metarElements}
      </Container>
    </>
  )
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
