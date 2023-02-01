import { useMemo } from "react";
import { styled } from "@mui/material/styles"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function DynamicTable({ data }) {
  const headers = useMemo(() => {
    return [...new Set(data.flatMap((entry) => Object.keys(entry)))];
  }, [data]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.alt,
      color: theme.palette.secondary[100],
      fontSize: 12,
      border: "none"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: "12px",
      border: "none"
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.primary[300],
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.primary[400],
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
  return (
    <TableContainer 
      sx ={{ 
        m: "1rem 2rem",
        borderRadius: "5px"
      }} 
      component={Paper}>
      <Table 
        sx={{ minWidth: 700 }} aria-label="custom table">
        <TableHead>
          <TableRow>
            {headers.map((headerName) => (
              <StyledTableCell>{ headerName.toUpperCase() }</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry) => (
            <StyledTableRow key={entry}>
              {headers.map((headerName) => (
                <StyledTableCell align="left">{entry[headerName]}</StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

}
