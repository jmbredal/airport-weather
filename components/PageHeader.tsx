import { Air } from "@mui/icons-material";
import { green } from '@mui/material/colors';
import { Box } from "@mui/system";

export default function PageHeader() {
  return (
    <Box mb={3} bgcolor={green[800]} padding={2}>
      <header style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Air fontSize='large' />

        <h1 style={{ margin: 0 }}>
          Airport Weather
        </h1>
      </header>
    </Box>
  );
}