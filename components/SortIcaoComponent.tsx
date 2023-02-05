import { North, South } from "@mui/icons-material";
import { FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { amber } from "@mui/material/colors";
import { Order } from "../interfaces/order";
import styles from '../styles/SortIcaoComponent.module.css';

interface Props {
  onChange: any;
  order: Order;
}

export default function SortIcaoComponent({ onChange, order }: Props) {

  const toggleButtons = ['icao', 'temp', 'wind'].map((value) => {
    return <ToggleButton value={value} key={value}>
      <span style={{ textTransform: 'capitalize' }}>{value}</span>
      {order.orderBy === value && order.direction === 'asc' && <North fontSize="small" />}
      {order.orderBy === value && order.direction === 'desc' && <South fontSize="small" />}
    </ToggleButton>
  });

  return (
    <>
      <FormLabel style={{ color: 'black' }}>Sort</FormLabel>
      <ToggleButtonGroup
        className={styles.togglebuttongroup}
        value={order.orderBy}
        exclusive
        onChange={onChange}
        aria-label='Sort'
        size='small'
        fullWidth={true}
        style={{ backgroundColor: amber[500] }}
      >
        {toggleButtons}
      </ToggleButtonGroup>
    </>
  );
}
