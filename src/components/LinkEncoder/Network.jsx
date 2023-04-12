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
import LensIcon from '@mui/icons-material/Lens';

/**
 * 2022/04/27:
 *   Implemented basic version of sending captions
 *   Need further testing to confirm the message is sent as expected
 *   Need to change to a better alignment
 */

let interval, errorInterval; //for 5s ping
const Network = (props) => {
  
  const [connectButtonText, setConnectButtonText] = useState('Connect');
  const [indicatorColor, setIndicatorColor] = useState("error");
  const [checked, setIsChecked] = useState(false);
  const [errorMessageDisplay, setDisplay] = useState(false);
  const [indicatorTextColor, setIndicatorTextColor] = useState("red");
  const [indicatorText, setIndicatorText] = useState('Disconnected');
  

  const checkingConnection = async () => {
    return new Promise(resolve => {
        errorInterval = setInterval(async () => {
            const retCode = await window.linkEncoderAPI.checkLinkEncoder();
            if (retCode == 300) {
                setDisplay(true);
                setConnectButtonText('Connect');
                setIndicatorColor("error");
                setIndicatorTextColor("red");
                setIndicatorText('Disconnected');
            }    
        }, 500);
            
        resolve();
    })
  };

  const connectAndDisconnect = async () => {
    clearInterval(errorInterval);
    await window.linkEncoderAPI.connectionLinkEncoder(props.postData.ip, props.postData.port);
    const retCode = await window.linkEncoderAPI.checkLinkEncoder();
    if (retCode == 200) {
        setDisplay(false);
        setConnectButtonText('Disconnect');
        setIndicatorColor("success");
        setIndicatorTextColor("green");
        setIndicatorText('Connected');
    }
    else if (retCode == 300) {
        setDisplay(true);
        setConnectButtonText('Connect');
        setIndicatorColor("error");
        setIndicatorTextColor("red");
        setIndicatorText('Disconnected');
    }
    else {
        setDisplay(false);
        setConnectButtonText('Connect');
        setIndicatorColor("error");
        setIndicatorTextColor("red");
        setIndicatorText('Disconnected');
    }
    await checkingConnection();
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
    <Stack direction="row" spacing={6} sx={{ m: 1, marginBottom: "20px"}} wrap="nowrap" alignItems="center" justifyContent="right">
        <Box>Network </Box>
        <Stack direction="row" sx={{ m: 1, marginBottom: "20px" }} wrap="nowrap" alignItems="center">
            <Box sx={{pr:"20px", maxWidth:"60%"}}fontSize={12} color={indicatorTextColor}> {indicatorText} </Box>
            <LensIcon sx={{maxHeight:"18%", maxWidth:"18%", width:"18%", height:"18%"}} color={indicatorColor}></LensIcon>
        </Stack>
    </Stack>

    
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
        <Button sx={{ background: '#13294B'}} variant="contained" className={`${props.classes.roundButton}`} 
        onClick={() => {
            connectAndDisconnect();
            
        }} id="rb">
            {connectButtonText}
        </Button>

        <FormGroup>
            <FormControlLabel control={<Checkbox onChange={stopPinging} value={checked}/>} label="Ping"/>
        </FormGroup>
        
    </Stack>
    <p style={{ color: 'red'}}>{errorMessageDisplay ? "Could not establish connection" : null}</p>
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