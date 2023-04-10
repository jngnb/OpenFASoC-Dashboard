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

  const StyledTableCell = styled(TableCell)(({ theme, index }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.alt,
      color: theme.palette.secondary.main,
      padding: urlLabels.length > 1 ? "12px" : "14px",
      fontSize: 12,
      borderBottom: "2px solid",
      minWidth: "50px",
      width: "auto",
      textAlign: "center",
      [`&:nth-of-type(${numFilterKeys + colSpan + 1})`]: {
        borderLeft: "2px solid",
        borderColor: theme.palette.background.default,

        // borderColor: theme.palette.background.dafault,
      },
      [`&:nth-of-type(${numFilterKeys+1})`]: {
        borderLeft: "2px solid",
        borderColor: theme.palette.background.default,

        // borderColor: theme.palette.background.dafault,
      },
      borderColor: theme.palette.background.default,

    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: urlLabels.length > 1 ? "9px" : "10px",
      border: "none",
      minWidth: "50px",
      width: "auto",
      textAlign: "center",
      // paddingLeft: urlLabels.length > 1 ? "16px" : "18px",
      // [`&:nth-of-type(${colSpan}n+${numFilterKeys+1})`]: {
      //   backgroundColor: theme.palette.tableCol.col1,
      // },
      // [`&:nth-of-type(${colSpan}n+${numFilterKeys+2})`]: {
      //   backgroundColor: theme.palette.tableCol.col2,
      // },
      // [`&:nth-of-type(${colSpan}n+${numFilterKeys+3})`]: {
      //   backgroundColor: theme.palette.tableCol.col3,
      // },
      // [`&:nth-child(${colSpan}n+${numFilterKeys+4})`]: {
      //   backgroundColor: theme.palette.tableCol.col4,
      // },
      [`&:nth-of-type(${numFilterKeys + colSpan + 1})`]: {
        borderLeft: "2px solid",
        borderColor: theme.palette.background.default,
      },
      [`&:nth-of-type(${numFilterKeys+1})`]: {
        borderLeft: "2px solid",
        borderColor: theme.palette.background.default,
      },
      [`&:nth-of-type(-n+${numFilterKeys})`]: {
        backgroundColor: theme.palette.background.alt,
        color: theme.palette.secondary.main,
      },
      borderColor: theme.palette.background.default,


    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme , index }) => ({
      backgroundColor:
        index % 2 
        ? theme.palette.tableRow.row1
        : theme.palette.tableRow.row2,
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
        sx={{ minWidth: 400, whiteSpace: "pre-line" }} aria-label="custom table">
        <TableHead>
        { (urlLabels.length > 1) ? 
        // Heading 1
        // EX: PRE-PEX vs POST-PEX
        <TableRow>{
        Array.from({ length: numFilterKeys + urlLabels.length }).map((_, i) => {
          // const colSpan = (headers.length - numFilterKeys) / urlLabels.length
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
        {/* Heading 2
            EX: Inverter, Header, ... , Maximum Error */}
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
        {/* Body (Number Data) */}
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

