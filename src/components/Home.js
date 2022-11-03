import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const zoom_card = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        Zoom
      </Typography>
      <hr />
      <Typography variant="body1">
        <div>
          <ul>

                <li>To connect to Zoom meeting, enter valid Zoom API key from Zoom meeting</li>
                <li>To send captions, add desired captions to the captions textbox and press send button or press enter key</li>
                <li>To connect to new meeting or to disconnect, press clear button</li>
                <li>
                  To download the caption log, press download button
                </li>
                <li>
                  Caution!: if you clear out during zoom call, you need to start the Zoom meeting again in order for captioning to work properly
                </li>

          </ul>
        </div>
      </Typography>
    </CardContent>
  </React.Fragment>
);

const linkencoder_card = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        Link Encoder
      </Typography>
      <hr />

      <Typography variant="body2">

        <div>
          <ul>
                <li>To connect to link encoder, enter valid IP address, port number</li>
                <li>To send captions, add desired captions to the captions textbox and press send button or press enter key</li>
                <li>To connect to new link encoder or to disconnect, press clear button</li>
                <li>
                  To download the caption log, press download button
                </li>
          </ul>
        </div>

      </Typography>

    </CardContent>
  </React.Fragment>
);

const upload_card = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        File Upload
      </Typography>
      <hr />

      <Typography variant="body2">
        <div>
          <ul>
                <li>To upload shortcuts, either upload a text file or add them manually</li>
                <li>When using file upload, have the text first then shortcut (e.g. ClassTranscribe:CT)</li>
                <li>When using manual shortcut input, add full text and shortcut to designated textboxes</li>
                <li>
                  You can manually input shortcuts after file has been uploaded
                </li>
                <li>
                  You can reset the shortcuts by pressing clear button.
                </li>
          </ul>
        </div>

      </Typography>

    </CardContent>
  </React.Fragment>
);

function home() {
  return (
    <div style={{ margin: "20px", marginTop: "30px" }}>
      <h1 style={{ textAlign: "left" }}>Welcome to CTCast</h1>
      <Box sx={{ minWidth: 275 }} style={{ marginBottom: '1rem' }}>
        <Card variant="outlined">{zoom_card}</Card>
      </Box>

      <Box sx={{ minWidth: 275 }} style={{ marginBottom: '1rem' }}>
        <Card variant="outlined">{linkencoder_card}</Card>
      </Box>

      <Box sx={{ minWidth: 275 }} style={{ marginBottom: '1rem' }}>
        <Card variant="outlined">{upload_card}</Card>
      </Box>


    </div>
  )
}

export default home