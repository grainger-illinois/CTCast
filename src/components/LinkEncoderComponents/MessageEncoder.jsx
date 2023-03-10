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
import History from './History.jsx';
import PropTypes from 'prop-types';


function MessageEncoder(props) {
  return (
  <Box sx={{paddingTop:'20px', paddingRight:'20px', width:'100vw'}}>
    <TextField multiline fullWidth
    name="caption"
    variant="outlined"
    label="Message"
    value={props.postData ? props.postData.caption : ''}
    onChange={(e) => props.setPostData({ ...props.postData, caption: e.target.value })}
    maxRows={8}
    inputProps={{
        className:'messageInput',
        style: {
          minHeight: "100px",
          maxHeight: "200px",
          overflow:'scroll'
        },
      }}
    />

    <Stack direction="row" spacing={2} sx={{ m: 2, width: '100%', overflow:'hidden'}}>

        <SplitButton className={`${props.classes.roundButton}`} type="submit">
        </SplitButton>

        <Button style={{ background: '#DDDEDE' }} variant="outlined" className={`${props.classes.roundButton}`} onClick={props.clear}>
            Clear
        </Button> 
    </Stack>

    <History
    postDataHistory={props.postDataHistory}
    />

  </Box>);
}

MessageEncoder.propTypes = {
  postData:PropTypes.object,
  postDataHistory:PropTypes.arrayOf(PropTypes.object),
  setPostData:PropTypes.func,
  classes:PropTypes.object,
  clear:PropTypes.func,
}

export default MessageEncoder;