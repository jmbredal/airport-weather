import { FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { amber } from "@mui/material/colors";
import styles from '../styles/SortIcaoComponent.module.css';

interface Props {
  onChange: any;
  orderBy: any;
}

export default function SortIcaoComponent({ onChange, orderBy }: Props) {
  return (
    <>
      <FormLabel style={{ color: 'black' }}>Sort</FormLabel>
      <ToggleButtonGroup
        className={styles.togglebuttongroup}
        value={orderBy}
        exclusive
        onChange={onChange}
        aria-label='Sort'
        size='small'
        fullWidth={true}
        style={{ backgroundColor: amber[500] }}
      >
        <ToggleButton value="icao">Icao</ToggleButton>
        <ToggleButton value="temp">Temp</ToggleButton>
        <ToggleButton value="wind">Wind</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
