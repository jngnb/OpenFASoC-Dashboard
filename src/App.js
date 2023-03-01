import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from './theme';
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Generator from 'scenes/generator';

const generators = [
  {
    generateSummary: (data) =>
        [...new Set(data.map(({ inverter, header }) => `${inverter}|${header}`))].map(
          (s) => {
            const inverter = s.split("|")[0];
            const header = s.split("|")[1];
            console.log(data)
            const entry20 = data.filter(
              (entry) =>
                entry.inverter === inverter &&
                entry.header === header &&
                parseFloat(entry.temp) === 20
            );
            console.log(entry20.length)
            const entries = data.filter(
              (entry) => entry.inverter === inverter && entry.header === header
            );
            const maxAbsError = Math.max(
              ...entries.filter(({ error }) => !isNaN(error)).map(({ error }) => Math.abs(+error))
            );
            const maxErrorEntry = entries.find(({ error }) => Math.abs(error) === maxAbsError);
            const maxError = maxErrorEntry ? maxErrorEntry.error : null;
            return {
              inverter: inverter,
              header,
              frequency20_1: entry20[0].freq,
              ...(entry20.length > 1 && { frequency20_2: entry20[1].freq}),
              power20_1: entry20[0].power,
              ...(entry20.length > 1 && { power20_2: entry20[1].power}),
              maxError
            };
          }
        ),
      path: "temperature sensor",
      name: "Temperature Sensor",
      filterKeys: ["inverter", "header"],
      urls: [
        {
          id: 1,
          label: "POST PEX",
          url: "https://raw.githubusercontent.com/idea-fasoc/OpenFASOC-sims/main/latest/data_postPEX.csv",
        },
        {
          id: 2,
          label: "PRE PEX",
          url: "https://raw.githubusercontent.com/idea-fasoc/OpenFASOC-sims/main/latest/data_prePEX.csv",
        },
      ],
      // url:
      //   "https://raw.githubusercontent.com/idea-fasoc/OpenFASOC/main/openfasoc/generators/temp-sense-gen/models/modelfile_PEX.csv"
  }
];

export default function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // const [selectedUrl, setSelectedUrl] = useState(generators[0].urls[0].url);

  // function handleUrlChange(event) {
  //   setSelectedUrl(event.target.value);
  // }

  return (
    <div className="app">
    <BrowserRouter>
    <ThemeProvider theme = {theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route 
          path="/" 
          element={<Navigate to={`/${generators[0].path}`} />} />
            {generators.map((generator) => (
              <Route
                path={generator.path}
                element={
                  <Generator
                    // selectedUrl={selectedUrl}
                    // setSelectedUrl={setSelectedUrl}
                    // url={generator.url}
                    name={generator.name}
                    urls = {generator.urls}
                    filterKeys={generator.filterKeys}
                    generateSummary={generator.generateSummary}
                  />
                }
              />
            ))}
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}
