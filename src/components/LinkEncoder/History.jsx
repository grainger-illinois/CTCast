import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Message, AccessTime, Numbers } from '@mui/icons-material';
import PropTypes from 'prop-types';


function History (props) {
  return (
    <TableContainer sx={{width: '100%', display: 'flex', height:'400px', overflowY:'scroll'}}>
    <Table size="small" aria-label="a dense table" sx={{ width: '100%'}}>
        <TableHead>
            <TableRow>
                <TableCell align="justify" sx={{ width: "10%" }}><Numbers fontSize="small"></Numbers></TableCell>
                <TableCell align="justify" sx={{ width: "20%" }}><AccessTime fontSize="small"></AccessTime></TableCell>
                <TableCell align="justify" sx={{ width: "70%" }}><Message fontSize="small"></Message></TableCell>
            </TableRow>
        </TableHead> 
        <TableBody>
            {props.children ? props.children.map((row, index) => (
                <TableRow
                    key={index}
                    sx={{ wordWrap: "break-word" }}
                >
                    <TableCell component="th" scope="row" align="justify" sx={{ width: "10%" }}>{row.count}</TableCell>
                    <TableCell align="justify" sx={{ width: "20%" }}>{row.time}</TableCell>
                    <TableCell align="justify" sx={{ wordBreak: "break-word", width: "70%" }}>{row.caption}</TableCell>
                </TableRow>
            )): <TableRow></TableRow>}
        </TableBody>
    </Table>
    </TableContainer>
  );
}

History.propTypes = {
  children:PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default History;