import { FormControl, FormLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { amber } from "@mui/material/colors";
import { Metar } from "../interfaces/metar";

interface Props {
  metars: Metar[];
  onChange: (event: SelectChangeEvent) => void;
  selectedAirport: string;
}

export default function SelectAirportComponent({ metars, onChange, selectedAirport }: Props) {
  // Airports in the dropdown
  const airportMenuItems = [...metars].sort(sortByName).map(m => {
    return <MenuItem key={m.icao} value={m.icao}>{m.icao}: {m.station.name}</MenuItem>
  });


  return (
    <>
      <FormLabel style={{ color: 'black' }}>Airport</FormLabel>
      <FormControl size="small" fullWidth={true}>
        <Select value={selectedAirport}
          labelId='input-label-id'
          onChange={onChange}
          displayEmpty
          style={{ backgroundColor: amber[500] }}
        >
          <MenuItem value="">All</MenuItem>
          {airportMenuItems}
        </Select>
      </FormControl>
    </>
  );
}

function sortByName(a: Metar, b: Metar): number {
  return a.station.name.localeCompare(b.station.name, 'no');
}
