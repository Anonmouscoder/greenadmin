import React, { useEffect } from 'react';
import './App.css';
import { DataProvider } from './utils/Context';
import AppRoutes from './Routes';

function App() {
  return (
    <DataProvider>
        <AppRoutes />
    </DataProvider>
  );
}

export default App;
