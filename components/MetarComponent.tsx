import { CloudOutlined, Visibility } from "@mui/icons-material";
import { Card, Divider, Icon } from "@mui/material";
import { Metar } from "../interfaces/metar";
import styles from '../styles/MetarComponent.module.css';
import { getWindDescription } from "../utils/windspeed";
import { TempGauge } from "./TempGauge";
import { WindDirection } from "./WindDirection";
import { WindGauge } from "./WindGauge";

interface Props {
  metar: Metar;
}

export function MetarComponent({ metar }: Props) {
  const clouds = metar.clouds?.map(c => {
    return c.code === 'CAVOK' ? 'No clouds' : `${c.text} ${c.meters ? `${c.meters} m` : ''}`
  }).join(', ');
  const observed = new Date(metar.observed);
  const conditions = metar.conditions?.map(c => c.text).join(', ');

  return (
    <Card id={metar.icao} className={styles.card} variant='outlined' sx={{ backgroundColor: 'primary.main' }}>
      <header className={styles.header}>
        <h1 className={styles.h1}>{metar.icao}</h1>
        <span>{metar.station.name}</span>
      </header>

      <Divider />

      <div>
        <p>Observed: {observed.toLocaleString('no')}</p>

        {metar.wind &&
          <div>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 50, position: 'absolute', right: 0, top: -15 }}><WindDirection direction={metar.wind?.degrees} /></div>
              <h3 className={styles.h3}>
                Wind: {metar.wind?.speed_mps} m/s ({getWindDescription(metar.wind?.speed_mps)})
              </h3>
            </div>

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

        {metar.barometer?.hpa &&
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon><img alt='' className='imageIcon' src="/aw/pressure.svg" /></Icon>
            <span>Pressure: {metar.barometer.hpa} hPa</span>
          </div>
        }
      </div>
    </Card>
  );
}
