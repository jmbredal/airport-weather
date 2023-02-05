import { Alert, Button, Container, Grid, SelectChangeEvent, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { MetarComponent } from '../components/MetarComponent';
import PageHeader from '../components/PageHeader';
import SelectAirportComponent from '../components/SelectAirportComponent';
import SortIcaoComponent from '../components/SortIcaoComponent';
import { Metar } from '../interfaces/metar';
import { Order, OrderBy } from '../interfaces/order';
import styles from '../styles/Metars.module.css';
import { getMetars } from '../utils/metar-service';

export default function Metars() {
  console.log('Metars render');

  const [metars, setMetars] = useState<Metar[]>([]);
  const [renderedMetars, setRenderedMetars] = useState<Metar[]>([]);
  const [order, setOrder] = useState<Order>({ orderBy: 'icao', direction: 'asc' });
  const [selectedAirport, setSelectedAirport] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // Handle sort change
  const handleToggleChange = (event: any, value: OrderBy) => {
    if (value) {
      setOrder({ orderBy: value, direction: 'asc' })
    } else {
      const direction = order.direction === 'asc' ? 'desc' : 'asc';
      setOrder({ ...order, direction });
    }
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
        const _metars = result.value as Metar[];
        setMetars(_metars);
        setRenderedMetars(_metars);
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
    const metarsToRender = !!selectedAirport
      ? (metars.filter(m => m.icao === selectedAirport))
      : metars;
    setRenderedMetars(metarsToRender);
  }, [selectedAirport]);

  const metarElements = [...renderedMetars]
    .sort(getSortFunction(order))
    .map(metar => <MetarComponent key={metar.icao} metar={metar} />);

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
            <SortIcaoComponent onChange={handleToggleChange} order={order} />
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

function getSortFunction(order: Order) {
  return (a: Metar, b: Metar) => {
    switch (order.orderBy) {
      case 'icao':
        return order.direction === 'asc' 
          ? a.icao.localeCompare(b.icao) 
          : b.icao.localeCompare(a.icao);
      case 'temp':
        return order.direction === 'asc' 
          ? !a.temperature ? 100 : !b.temperature ? -100 : a.temperature?.celsius - b.temperature.celsius
          : !a.temperature ? 100 : !b.temperature ? -100 : b.temperature?.celsius - a.temperature.celsius;
      case 'wind':
        return order.direction === 'asc' 
          ? !a.wind ? 100 : !b.wind ? -100 : a.wind?.speed_mps - b.wind?.speed_mps
          : !a.wind ? 100 : !b.wind ? -100 : b.wind?.speed_mps - a.wind?.speed_mps
    }
  }
}
