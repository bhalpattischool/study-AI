
import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const ThemeWrapper: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default ThemeWrapper;
