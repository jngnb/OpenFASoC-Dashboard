import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo, useState, useEffect } from 'react';
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
              ambient_frequency_1: entry20[0].freq,
              ...(entry20.length > 1 && { ambient_frequency_2: entry20[1].freq}),
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
          url: "https://bigquery.googleapis.com/bigquery/v2/projects/catx-ext-umich/datasets/openfasoc_dataset/tables/data_postPEX/data",
        },
        {
          id: 2,
          label: "PRE-PEX",
          url: "https://bigquery.googleapis.com/bigquery/v2/projects/catx-ext-umich/datasets/openfasoc_dataset/tables/data_prePEX/data",
        },
      ],
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const [idToken, setIdToken] = useState(null);

  window.signedin = (googleUser) => {
      const google = window.google;
      const client = google.accounts.oauth2.initTokenClient({
        client_id: '853987731529-lng79g7ridiqj3gedfda389hcono5o7g.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/bigquery',
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token){
            setIdToken(tokenResponse.access_token);
            setIsLoggedIn(true);
          }
        },
      });
      client.requestAccessToken();     
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        // Render app content when user is logged in
        <BrowserRouter>
        <ThemeProvider theme = {theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout/>}>
              <Route 
              path="/OpenFASoC-Dashboard/" 
              element={<Navigate to={`/${generators[0].path}`} />} />
                {generators.map((generator, index) => (
                  <Route
                    key={index}
                    path={generator.path}
                    element={
                      <Generator
                        name={generator.name}
                        urls = {generator.urls}
                        idToken={idToken}
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
      ) : (
        // Render sign in button when user is not logged in
        <div id="google-login-btn">
          <div id="g_id_onload"
          data-client_id="853987731529-lng79g7ridiqj3gedfda389hcono5o7g.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="signedin"
          data-auto_prompt="false">     
      </div>
      <div className="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left">
      </div>
        </div>
      )}
        </div>
  );
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

