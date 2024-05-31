'use client'
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import NavLayout from '@/components/NavLayout';

const userContext = {title: 'Rory McNicholl', orcid: 'https://orcid.org/0000-0001-7918-6597'};
const orgContext = {title: 'University of London', orcid: 'https://ror.org/04cw6st05'};

export default function RootLayout(props) {

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <NavLayout content={props.children} userContext={userContext} orgContext={orgContext}/>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
