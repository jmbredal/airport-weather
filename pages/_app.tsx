import { CssBaseline } from '@mui/material';
import { amber, green } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Roboto } from '@next/font/google';
import '../styles/globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
})

const theme = createTheme({
  palette: {
    background: {
      default: green[300],
    },
    primary: {
      main: green[500],
    },
    secondary: {
      main: amber[500],
    },
  },
});

import type { AppProps } from 'next/app';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className={roboto.className}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </React.Fragment>
  )
}
