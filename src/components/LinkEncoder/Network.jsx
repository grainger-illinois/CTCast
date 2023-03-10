import React, { useState, useRef, useEffect } from 'react'
import { RadioGroup, Radio, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { Download } from '@mui/icons-material';
import FormGroup from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl, FormLabel } from '@material-ui/core';
import PropTypes from 'prop-types';

/**
 * 2022/04/27:
 *   Implemented basic version of sending captions
 *   Need further testing to confirm the message is sent as expected
 *   Need to change to a better alignment
 */

let interval; //for 5s ping
const Network = (props) => {
  
  const [connectButtonText, setConnectButtonText] = useState('Connect');
  const [selected, setSelected] = useState("success");
  const [checked, setIsChecked] = useState(false);

  const connectAndDisconnect = async () => {
    await window.linkEncoderAPI.connectionLinkEncoder(props.postData.ip, props.postData.port);
    const retCode = await window.linkEncoderAPI.checkLinkEncoder();
    if (retCode == 200) {
        setConnectButtonText('Disconnect');
        setSelected("error");
    }
    else {
        setConnectButtonText('Connect');
        setSelected("success");
    }
  };

  const pinging = async () => {
      return new Promise(resolve => {
          if (checked == false) {
              interval = setInterval(async () => {
                  var today = new Date();
                  var hours = today.getHours();
                  var minutes = today.getMinutes();
                  var seconds = today.getSeconds();
                  minutes = minutes < 10 ? '0' + minutes : minutes;
                  seconds = seconds < 10 ? '0' + seconds : seconds;
                  var ampm = hours >= 12 ? 'PM' : 'AM';
                  hours = hours % 12;
                  var time = hours + ":" + minutes + ":" + seconds + ' ' + ampm;
                  await window.linkEncoderAPI.sendToLinkEncoder(time);    
              }, 5000);
              
          }
          resolve();
      })
  };

  const stopPinging = async () => {
      setIsChecked(!checked);
      clearInterval(interval);
      await pinging();
  }   

  /**
   * Download logs.
   */
  const downloadTxtRef = useRef(null);
  const [downloadLogUrl, setDownloadLogUrl] = useState(undefined);
  const downloadTxtFile = (e) => {
      e.preventDefault();
      console.log(props.localLog);
      const file = new Blob([props.localLog], { type: 'text/plain' });
      setDownloadLogUrl(window.URL.createObjectURL(file));
      console.log("log1", downloadTxtRef.current.attributes.href);    
  }

  useEffect(() => {
    console.log("log2", downloadTxtRef.current.attributes.href);    

    if (downloadTxtRef != null) {
        downloadTxtRef.current.click();
    }
  }, [downloadLogUrl]);

  return <Box sx={{width:"220px", marginRight:"10px", padding:"20px", height:"100vh", backgroundClip:"border-box", backgroundColor:"#e8e9eb"}} >
    <Box sx={{marginBottom:"20px"}}>Network</Box>
    <TextField
        name="ip"
        size='small'
        variant="outlined"
        label="IP Address"
        value={props.postData ? props.postData.ip : ''}
        onChange={(e) => props.setPostData({ ...props.postData, ip: e.target.value })}
    />

    <FormLabel sx={{padding:"10px"}}>Port</FormLabel>
    <Box textAlign='center'>
        <FormControl>

            <RadioGroup 
                value={props.postData ? props.postData.port : ''}
                row
                onChange={(e) => props.setPostData({ ...props.postData, port: e.target.value })}
                >
                    <FormControlLabel value="10001" control={<Radio />} label="10001" />
                    <FormControlLabel value="10002" control={<Radio />} label="10002" />
            </RadioGroup>
        </FormControl>
    </Box>

    <Stack direction="row" spacing={2} sx={{ m: 1 }} wrap="nowrap" alignItems="center" justifyContent="center">
        <Button sx={{ background: '#13294B' }} variant="contained" className={`${props.classes.roundButton}`} onClick={connectAndDisconnect} id="rb">
            {connectButtonText}
        </Button>

        <FormGroup>
            <FormControlLabel control={<Checkbox onChange={stopPinging} value={checked}/>} label="Ping"/>
        </FormGroup>
        
    </Stack>
    <Button style={{color: "#13294B"}} variant="outlined" endIcon={<Download />} onClick={downloadTxtFile}>
        Download
    </Button>
    <a style={{display:'none'}} ref={downloadTxtRef} href={downloadLogUrl} download={'linkEncoder.log'}></a>
    {/* <Box sx={{width:"100px", height:"100px", background:"white"}}>{"locallog\n" + localLog}</Box> */}
  </Box>;
}

Network.propTypes = {
  postData: PropTypes.object.isRequired,
  setPostData: PropTypes.func.isRequired,
  localLog: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default Network;