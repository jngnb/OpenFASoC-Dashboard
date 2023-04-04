import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from './theme';
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Generator from 'scenes/generator';
import { max } from 'd3';

const generators = [
  {
    generateSummary: (data, numSelectedUrls) =>
      [...new Set(data.map(({ inverter, header }) => 
        `${inverter}|${header}`))].map( (s) => {
            const inverter = s.split("|")[0];
            const header = s.split("|")[1];
            // console.log(data)
            console.log(inverter, header)
            const entry20 = data.filter(
              (entry) =>
                entry.inverter === inverter &&
                entry.header === header &&
                parseFloat(entry.temp) === 20
            );
            console.log(entry20)
            const entries = data.filter(
              (entry) => entry.inverter === inverter && entry.header === header
            );
            const chunkEntries = [];
            const chunkSize = Math.ceil(entries.length / numSelectedUrls);
            for (let i = 0; i < entries.length; i += chunkSize) {
              const chunk = entries.slice(i, i + chunkSize);
              chunkEntries.push(chunk);
            }
            const maximum_errors = chunkEntries.map((chunk) => {
              const maxAbsError = Math.max(
                ...chunk.filter(({ error }) => !isNaN(error)).map(({ error }) => Math.abs(+error))
              );
              const maxErrorEntry = chunk.find(({ error }) => Math.abs(error) === maxAbsError);
              return maxErrorEntry ? maxErrorEntry.error : null;
            });

            // const maxErrorEntry = entries.find(({ error }) => Math.abs(error) === maxAbsError);
            // const maximum_error = maxErrorEntry ? maxErrorEntry.error : null;

            return {
              inverter: inverter,
              header,
              ambient_freq_1: entry20[0].freq,
              ...(entry20.length > 1 && { ambient_freq_2: entry20[1].freq}),
              ambient_power_1: entry20[0].power,
              ...(entry20.length > 1 && { ambient_power_2: entry20[1].power}),
              maximum_error_1: maximum_errors[0],
              ...(maximum_errors.length > 1 && { maximum_error_2: maximum_errors[1]}),
            };
          }
        ),
      path: "temperature sensor",
      name: "Temperature Sensor",
      filterKeys: ["inverter", "header"],
      detailFilterKey: "temp",
      urls: [
        {
          id: 1,
          label: "POST-PEX",
          url: "https://raw.githubusercontent.com/idea-fasoc/OpenFASOC-sims/main/latest/data_postPEX.csv",
        },
        {
          id: 2,
          label: "PRE-PEX",
          url: "https://raw.githubusercontent.com/idea-fasoc/OpenFASOC-sims/main/latest/data_prePEX.csv",
        },
      ],
  }
];

export default function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
    <BrowserRouter>
    <ThemeProvider theme = {theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout/>}>
          <Route 
          path="/OpenFASoC-Dashboard" 
          element={<Navigate to={`/${generators[0].path}`} />} />
            {generators.map((generator, index) => (
              <Route
                key={index}
                path={generator.path}
                element={
                  <Generator
                    name={generator.name}
                    urls = {generator.urls}
                    filterKeys={generator.filterKeys}
                    detailFilterKey={generator.detailFilterKey}
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
