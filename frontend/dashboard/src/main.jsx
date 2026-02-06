// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#ebf8ff',
      '#bee3f8',
      '#90cdf4',
      '#63b3ed',
      '#4299e1',
      '#3182ce',
      '#2b6cb0',
      '#2c5282',
      '#2a4365',
      '#1a365d',
    ],
    green: [
      '#f0fff4',
      '#c6f6d5',
      '#9ae6b4',
      '#68d391',
      '#48bb78',
      '#38a169',
      '#2f855a',
      '#276749',
      '#22543d',
      '#1c4532',
    ]
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  defaultRadius: 'md',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);