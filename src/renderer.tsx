import React from 'react';
import ReactDOM, { render } from 'react-dom';
import App from '@/app/app';
import { ThemeEngine } from '@/app/Context/ThemeEngine'


render(
  <React.StrictMode>
    <ThemeEngine>
      <App />
    </ThemeEngine>
  </React.StrictMode>,
  document.getElementById('root')

);


