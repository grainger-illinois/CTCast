import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import SplitButton, { options } from './SplitButton.jsx';
import History from './History.jsx';
import PropTypes from 'prop-types';



function MessageEncoder(props) {
  const [isTextBoxFocused, setTextBoxFocused] = useState(false);
  const hotkeyHandler = (e) => {
    if (isTextBoxFocused && e.ctrlKey && e.key == 'f') {
      // TODO: Pop up textfieldfinder and find
      console.log('find');
    }
    if (e.altKey && e.key == 'x') {
      console.log('alt x');
    }
    if (e.altKey && e.key == 'm') {
      console.log('alt m');
    }
    if (e.altKey && e.key == 's') {
      console.log('alt s');
    }

  };

  const sendToLinkEncoderAndLog = async (caption) => {
    await window.linkEncoderAPI.sendToLinkEncoder(caption, props.postData.ip, props.postData.port);
    let message = await window.linkEncoderAPI.getLastMessage();
    props.writeLogAndSetHistory(message);
  }

  const [selectedIndex, setSelectedIndex] = React.useState(0);



  return (
    <Box component='form' onSubmit={() => {
      let selectedOption = options[selectedIndex];
      
    }} sx={{ paddingTop: '20px', paddingRight: '20px', width: 'calc(100% - 300px)' }}>
      <TextField multiline fullWidth
        name="caption"
        variant="outlined"
        label="Message"
        value={props.postData ? props.postData.caption : ''}
        onChange={(e) => props.setPostData({ ...props.postData, caption: e.target.value })}
        onFocus={() => setTextBoxFocused(true)}
        onBlur={() => setTextBoxFocused(false)}
        onKeyDown={hotkeyHandler}
        inputProps={{
          style: {
            minHeight: "100px",
            maxHeight: "200px",
            overflow: 'scroll',
          },
        }}
      />

      <Stack direction="row" spacing={2} sx={{ m: 2, width: '100%', overflow: 'hidden' }}>

        <SplitButton className={`${props.classes.roundButton}`}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          type='submit'>
        </SplitButton>

        <Button
          style={{ background: '#DDDEDE' }}
          variant="outlined"
          className={`${props.classes.roundButton}`}
          onClick={props.clear}>
          Clear
        </Button>
      </Stack>

      <History>{props.children}</History>

    </Box>);
}

MessageEncoder.propTypes = {
  postData: PropTypes.object.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPostData: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  clear: PropTypes.func.isRequired,
  writeLogAndSetHistory: PropTypes.func.isRequired,
};

export default MessageEncoder;