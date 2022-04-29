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
      
      <Typography variant="body2">
        Instructions
        
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
      
      <Typography variant="body2">
        Instructions
        
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
      
      <Typography variant="body2">
        Instructions
        
      </Typography>
    </CardContent>
  </React.Fragment>
);

function home() {
  return (
    <div>
      <h2>Welcome to ClassTranscribe!</h2>
      <Box sx={{ minWidth: 275 }} style={{marginBottom: '1rem'}}>
        <Card variant="outlined">{zoom_card}</Card>
      </Box>

      <Box sx={{ minWidth: 275 }} style={{marginBottom: '1rem'}}>
        <Card variant="outlined">{linkencoder_card}</Card>
      </Box>

      <Box sx={{ minWidth: 275 }} style={{marginBottom: '1rem'}}>
        <Card variant="outlined">{upload_card}</Card>
      </Box>
      

    </div>
  )
}

export default home