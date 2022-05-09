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
            <li>To connect to new meeting, press clear button</li>
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
    </CardContent>
  </React.Fragment>
);

const upload_card = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        File Upload
      </Typography>
    </CardContent>
  </React.Fragment>
);

function home() {
  return (
    <div style={{ margin: "20px", marginTop: "30px" }}>
      <h1 style={{ textAlign: "left" }}>Welcome to ClassTranscribe!</h1>
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