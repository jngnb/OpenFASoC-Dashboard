import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from './theme';
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Generator from 'scenes/generator';

const generators = [
  {
    path: "temperature sensor",
    name: "Temperature Sensor",
    urls: [
      "https://raw.githubusercontent.com/jngnb/OpenFASoC-Dashboard/main/test_data.csv"
    ]
  },
  {
    path: "generator 2",
    name: "Generator 2",
    urls: [
      "https://raw.githubusercontent.com/saicharan0112/OpenFASOC-CI-simulations/main/utils/data.csv"
    ]
  },
  {
    path: "generator 3",
    name: "Generator 3",
    urls: [
      "https://raw.githubusercontent.com/saicharan0112/OpenFASOC-CI-simulations/main/utils/data.csv"
    ]
  }
];

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme = {theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              { generators.map((generator) => (
                  <Route
                    path={ generator.path }
                    element={ <Generator urls={generator.urls} name={generator.name} />}
                  />
                ))
              }
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
