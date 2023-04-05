import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import SplitButton, { options } from './SplitButton.jsx';
import History from './History.jsx';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import PreviewDialog from './Preview.jsx';



function MessageEncoder(props) {
  const [isTextBoxFocused, setTextBoxFocused] = useState(false);

  const hotkeyHandler = (e) => {
    if (isTextBoxFocused && e.ctrlKey && e.key == 'f') {
      // TODO: Pop up textfieldfinder and find
      console.log('find');
    }
    if (e.altKey && e.key == 'x') {
      sendAll();
    }
    if (e.altKey && e.key == 'm') {
      sendSelected();
    }
    if (e.altKey && e.key == 's') {
      props.clear();
    }
    if (e.altKey && e.key == 'z') {
      setSelectedIndex(0);
      preview();
    }
    if (e.altKey && e.key == 'c') {
      setSelectedIndex(1);
      preview();
    }
    
  };

  /* Selected Send Mode (Send All/Highlighted) */
  const [selectedIndex, setSelectedIndex] = React.useState(0);


  /* Send caption handlers */
  const sendToLinkEncoderAndLog = async (caption, option) => {
    await window.linkEncoderAPI.sendToLinkEncoder(caption, props.postData.ip, props.postData.port);
    let message = await window.linkEncoderAPI.getLastMessage();
    props.writeLogAndSetHistory(message, option);

  }

  const sendAll = () => {
    sendToLinkEncoderAndLog(props.postData.caption, 'sendAll');
  }

  const sendSelected = () => {
    let selection = window.getSelection();
    sendToLinkEncoderAndLog(selection.toString(), 'sendSelected');
    selection.deleteFromDocument();
  }

  /* Preview popup callbacks */
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewContents, setPreviewContents] = React.useState('');

  async function getPreviewContents() {
    let selectedOption = options[selectedIndex];
    let rawText = '';

    if (selectedOption == 'Send All') {
      rawText = props.postData.caption;
    }
    if (selectedOption == 'Send Highlighted') {
      rawText = window.getSelection().toString();
    }
    return await window.linkEncoderAPI.preview(rawText);
  }

  async function preview() {
    setPreviewContents(await getPreviewContents());
    setPreviewOpen(true);
  }

  /* Styled Text */
  const GreyTextBoldTypography = withStyles({
    root: {
      color: "#070707",
      fontWeight: "bold",
    }
  })(Typography);

  const GreyTextTypography = withStyles({
    root: {
      color: "#070707",
    }
  })(Typography);

  return (
    <Box component='form' onSubmit={(e) => {
      e.preventDefault();
      let selectedOption = options[selectedIndex];
      if (selectedOption == 'Send All') {
        sendAll();
      }
      if (selectedOption == 'Send Highlighted') {
        sendSelected();
      }
    }} sx={{ paddingTop: '20px', paddingRight: '20px', width: 'calc(100% - 300px)' }}>
      <Box sx={{ display: 'flex' }}>
        <TextField multiline
          sx={{ flexGrow: '1' }}
          display='flex'
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
        <Box sx={{ marginLeft: '10px', marginTop: '10px', flexDirection: 'column' }} color='black' display='flex' width='auto'>
          <GreyTextTypography>Send all</GreyTextTypography>
          <GreyTextBoldTypography>Alt + X</GreyTextBoldTypography>
          <GreyTextTypography>Send highlighted </GreyTextTypography>
          <GreyTextBoldTypography>Alt + M</GreyTextBoldTypography>
          <GreyTextTypography>Clear</GreyTextTypography>
          <GreyTextBoldTypography>Alt + S</GreyTextBoldTypography>
          <GreyTextTypography>Preview All/Highlighted</GreyTextTypography>
          <GreyTextBoldTypography>Alt + Z/C</GreyTextBoldTypography>
        </Box>
      </Box>

      <PreviewDialog contents={previewContents} open={previewOpen} onClose={() => { setPreviewOpen(false); }} />

      <Stack direction="row" spacing={2} sx={{ m: 2, width: '100%', overflow: 'hidden' }}>

        <SplitButton className={`${props.classes.roundButton}`}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        >
        </SplitButton>

        <Button
          sx={{ background: '#13294B' }}
          variant="contained"
          className={`${props.classes.roundButton}`}
          onClick={preview}>
          Preview
        </Button>

        <Button
          sx={{ background: '#DDDEDE' }}
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