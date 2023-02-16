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
  flip = false,
  onEntryClick = () => {}
}) {
  const headers = useMemo(() => {
    return [...new Set(data.flatMap((entry) => Object.keys(entry)))];
  }, [data]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.alt,
      color: theme.palette.secondary[100],
      fontSize: 12,
      border: "none",
      width: "80px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: "10px",
      border: "none",
      width: "80px",
      paddingLeft: "20px"
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme , index , /*flip*/}) => ({
    // backgroundColor: flip ? 
    //   ( index < 2 
    //     ? theme.palette.background.alt
    //     : (index >= 2 
    //       ? theme.palette.primary[300] 
    //       : theme.palette.primary[100])
    //   ) 
      backgroundColor:
        index % 2 
        ? theme.palette.primary[300]
        : theme.palette.primary[400],
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // if (flip) {
  //   return (
  //     <TableContainer
  //     sx={{ 
  //       m: "1rem 2rem",
  //       borderRadius: "5px"
  //     }} 
  //     component={Paper}>
  //       <Table
  //       sx={{ minWidth: 700 }} aria-label="custom table">
  //       {headers.map((headerName, index) => (
  //         <StyledTableRow index={index} /*flip={flip}*/>
  //            <TableHead><StyledTableCell>{headerName.toUpperCase()}</StyledTableCell></TableHead>
  //           {data.map((entry) => (
  //             <StyledTableCell onClick={ () => onEntryClick( entry )}> { 
  //               index > 2 
  //                 ? Number(entry[headerName]).toFixed(2)
  //                 : entry[headerName] } 
  //             </StyledTableCell>
  //           ))}
  //         </StyledTableRow>
  //       ))}
  //       </Table>
  //     </TableContainer>
  //   );
  // }

  return (
    <TableContainer 
      sx ={{ 
        m: "1rem 2rem",
        borderRadius: "5px"
      }} 
      component={Paper}>
      <Table 
        sx={{ minWidth: 520 }} aria-label="custom table">
        <TableHead>
          <TableRow>
            {headers.map((headerName) => (
              <StyledTableCell>{ headerName.toUpperCase() }</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry, index) => (
            <StyledTableRow index = {index} /*flip = {false}*/ key={entry}>
              {headers.map((headerName, headerIndex) => (
                <StyledTableCell onClick={ () => onEntryClick( entry ) } align="left">
                  { headerIndex < 2 
                    ? entry[headerName] 
                    : Math.abs(Number(entry[headerName])) < 0.01
                      ? Number(entry[headerName]).toExponential(2)
                      : Number(entry[headerName]).toFixed(2) }
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

}


// export default function DynamicTable({
//   data,
//   flip = false,
//   onEntryClick = () => {}
// }) {
//   const headers = useMemo(() => {
//     return [...new Set(data.flatMap((entry) => Object.keys(entry)))];
//   }, [data]);

//   if (flip) {
//     return (
//       <table>
//         {headers.map((headerName) => (
//           <tr>
//             <th>{headerName}</th>
//             {data.map((entry) => (
//               <td onClick={() => onEntryClick(entry)}>{entry[headerName]}</td>
//             ))}
//           </tr>
//         ))}
//       </table>
//     );
//   }

//   return (
//     <table>
//       <thead>
//         <tr>
//           {headers.map((headerName) => (
//             <th>{headerName}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((entry) => (
//           <tr onClick={() => onEntryClick(entry)}>
//             {headers.map((headerName) => (
//               <td>{entry[headerName]}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

