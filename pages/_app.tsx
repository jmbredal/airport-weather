import { CssBaseline } from '@mui/material';
import { amber, green } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Roboto } from '@next/font/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
})

const theme = createTheme({
  palette: {
    background: {
      default: green[200],
    },
    primary: {
      main: green[400],
    },
    secondary: {
      main: amber[400],
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Airport Weather in Norway</title>
      </Head>

      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main className={roboto.className}>
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </React.Fragment>
    </>
  )
}
