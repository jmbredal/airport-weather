import Metars from './metars'
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

export default function Home() {
  return (
    <>
      <Switch {...label} defaultChecked />
      <Switch {...label} />
      <Switch {...label} disabled defaultChecked />
      <Metars />
    </>
  )
}
