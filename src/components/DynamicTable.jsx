import { useMemo } from "react";
import { styled } from "@mui/material/styles"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function DynamicTable({
  data,
  urlLabels,
  numFilterKeys = 0,
  onEntryClick = () => {},
}) {

  const headers = useMemo(() => {
    return [...new Set(data.flatMap((entry) => Object.keys(entry)))];
  }, [data]);
  console.log(headers)
  console.log(urlLabels)
  data = data.map((entry, index) => ({...entry, id: index}));

  const colSpan = (headers && urlLabels && (headers.length - numFilterKeys) / urlLabels.length);
  
  // const headers = useMemo(() => {
  //   const allHeaders = [...new Set(data.flatMap((entry) => Object.keys(entry)))];
  //   const checkedHeaders = checkedBoxes.flatMap((checkedBox) => {
  //     return (urls.find((url) => url.label === checkedBox).headers);
  //   });
  //   if (checkedBoxes.length > 1) return [...new Set([...allHeaders, ...checkedHeaders])];
  //   else return allHeaders;
  // }, [data, checkedBoxes]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.alt,
      color: theme.palette.secondary.main,
      fontSize: 12,
      border: "none",
      minWidth: "50px",
      width: "auto"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: "10px",
      border: "none",
      minWidth: "50px",
      width: "auto",
      paddingLeft: "20px"
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme , index }) => ({
      backgroundColor:
        index % 2 
        ? theme.palette.tableRow.cell1
        : theme.palette.tableRow.cell2,
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <TableContainer 
      sx ={{ 
        borderRadius: "5px"
      }} 
      component={Paper}>
      <Table 
        sx={{ minWidth: 520, whiteSpace: "pre-line" }} aria-label="custom table">
        <TableHead>
        { urlLabels.length > 1 
        ? 
        <TableRow>{
        Array.from({ length: numFilterKeys + urlLabels.length }).map((_, i) => {
          const colSpan = (headers.length - numFilterKeys) / urlLabels.length
          if (i >= numFilterKeys && i - numFilterKeys < urlLabels.length) {
            return (
              <StyledTableCell style={{ textAlign: "center" }} colSpan={colSpan} key={i}>
                {urlLabels[i - numFilterKeys]}
              </StyledTableCell>
            );
          } else {
            return <StyledTableCell key={i} />;
          }
        })}
        </TableRow> 
        : null }
          <TableRow>
          {headers.map((headerName, index) => {
            if (headerName.includes('_')) {
              headerName = headerName.replace("_", " ");
              const regex = /_\d+$/;
              if (regex.test(headerName) && urlLabels.length >= 1) {
                headerName = headerName.replace(regex, "");
              }
            }
            headerName = headerName.split(' ').map(word => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
            return (
              <StyledTableCell key={index}>
                { headerName }
              </StyledTableCell>
            );
          })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry, index) => (
            <StyledTableRow index={index} key={entry.id}>
              {headers.map((headerName, headerIndex) => (
                <StyledTableCell 
                  key={`${entry.id}-${headerIndex}`} 
                  onClick={ () => onEntryClick( entry ) } 
                  align="left">
                  {!isNaN(parseInt(entry[headerName]))
                    ? headerIndex < numFilterKeys
                      ? (isNaN(parseInt(entry[headerName])) ? 'Invalid integer' : parseInt(entry[headerName]))
                      : (Math.abs(Number(entry[headerName])) < 0.01 && Number(entry[headerName]) !== 0
                        ? Number(entry[headerName]).toExponential(2)
                        : Number(entry[headerName]).toFixed(2))
                    : entry[headerName]
                  }
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

}

