import React, { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { Message, AccessTime, Numbers, Download } from '@mui/icons-material';
import FormGroup from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import { RadioGroup, Radio, Box } from '@mui/material';
import { Drawer, FormControl, FormLabel } from '@material-ui/core';
import SplitButton from './SplitButton.jsx';
import PropTypes from 'prop-types';


function History (props) {
  return (
    <TableContainer sx={{width: 'auto', display: 'flex'}}>
    <Table size="small" aria-label="a dense table" sx={{ minWidth: 300}}>
        <TableHead>
            <TableRow>
                <TableCell align="justify" sx={{ width: "10%" }}><Numbers fontSize="small"></Numbers></TableCell>
                <TableCell align="justify" sx={{ width: "20%" }}><AccessTime fontSize="small"></AccessTime></TableCell>
                <TableCell align="justify" sx={{ width: "70%" }}><Message fontSize="small"></Message></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.postDataHistory ? props.postDataHistory.map((row, index) => (
                <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, wordWrap: "break-word" }}
                >
                    <TableCell component="th" scope="row" align="justify" sx={{ width: "10%" }}>{row.count + 1}</TableCell>
                    <TableCell align="justify" sx={{ width: "20%" }}>{row.time}</TableCell>
                    <TableCell align="justify" sx={{ wordWrap: "break-word", width: "70%" }}>{row.caption}</TableCell>
                </TableRow>
            )): <TableRow></TableRow>}
        </TableBody>
    </Table>
    </TableContainer>
  );
}

History.propTypes = {
  postDataHistory:PropTypes.arrayOf(PropTypes.object)
}

export default History;