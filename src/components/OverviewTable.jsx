import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMemo } from 'react';
import parseDataArray from 'hooks/parseDataArray';


export default function OverviewTable ({ urls, numConfigurationHeaders }) {

  const { csvDataArray } = parseDataArray(urls);

  const tempCsvData = csvDataArray[0];
  
  console.log(csvDataArray);
  
  const configurationHeaders = useMemo(() => {
    return [...new Set(
      tempCsvData.flatMap((entry) => Object.keys(entry)))
    ].slice(0, numConfigurationHeaders);
  }, [tempCsvData]);

  console.log(configurationHeaders);

  const configurationRows = [];
  configurationHeaders.map((configurationHeader) => {
    for (var i = 0; i < csvDataArray.length; ++i){
      configurationRows.push(csvDataArray[i][0][configurationHeader]);
    }
  })

  return (
    <TableContainer 
      sx ={{ 
        m: "1rem 2rem",
        borderRadius: "5px"
      }}
      component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="overview table">
          { 
          configurationHeaders.map((configurationHeader) => (
            configurationRows.map(( configurationRow ) => (
            <TableRow key={configurationHeaders} sx={{ '&:last-child td, &:last-child th':{ border: 0 } }} >
              <TableCell component="th" scope="row">{ configurationHeader }</TableCell>
              { configurationRow.map(( configurationValue ) => (
                    <TableCell align="right">{ configurationValue }</TableCell>
                )) }
            </TableRow>
            ))
          ))}
      </Table>
    </TableContainer>
  );
}