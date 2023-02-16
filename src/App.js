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
    generateSummary: (data) =>
        [...new Set(data.map(({ inv, header }) => `${inv}|${header}`))].map(
          (s) => {
            const inverter = s.split("|")[0];
            const header = s.split("|")[1];
            const entry20 = data.find(
              (entry) =>
                entry.inv === inverter &&
                entry.header === header &&
                entry.Temp === "20"
            );
            const entries = data.filter(
              (entry) => entry.inv === inverter && entry.header === header
            );
            const maxAbsError = Math.max(
              ...entries.map(({ Error }) => Math.abs(+Error))
            );
            const maxError = entries.find(
              ({ Error }) => Math.abs(Error) === maxAbsError
            ).Error;
            return {
              inv: inverter,
              header,
              frequency20: entry20.Frequency,
              power20: entry20.Power,
              maxError
            };
          }
        ),
      path: "temperature sensor",
      name: "Temperature Sensor",
      filterKeys: ["inv", "header"],
      url:
        "https://raw.githubusercontent.com/idea-fasoc/OpenFASOC/main/openfasoc/generators/temp-sense-gen/models/modelfile_PEX.csv"
  }
];

export default function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return (
    <div className="app">
    <BrowserRouter>
    <ThemeProvider theme = {theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={`/${generators[0].path}`} />} />
            {generators.map((generator) => (
              <Route
                path={generator.path}
                element={
                  <Generator
                    url={generator.url}
                    name={generator.name}
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
