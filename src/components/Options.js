import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ZoomPage from './zoom/zoom.js'
import LinkEncoder from './LinkEncoder.js';
import UploadFiles from './UploadFiles.js';

import Home from './home'
import './Options.css'
import {
    HashRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';



const Options = (props, window) => {


  return (
    <Router>
    <Box sx={{ flexGrow: 1 }} width = "100%" className='center-align'>
      <AppBar position="static" className='center-align'>
        <Toolbar>
            <Link to = "/" style={{ color: '#FFF', textDecoration: 'none' }}>
          <Button color="inherit">Home</Button>
          </Link>
          <Link to ="/zoom" style={{ color: '#FFF', textDecoration: 'none' }}>
            <Button color="inherit">Zoom</Button>
          </Link>
          <Link to = "/linkencoder" style={{ color: '#FFF', textDecoration: 'none' }}>
          <Button color="inherit">Link Encoder</Button>
          </Link>
	  <Link to ="/uploadfiles" style={{ color: '#FFF', textDecoration: 'none' }}>
          <Button color="inherit">Upload Files</Button>
	  </Link>
        </Toolbar>
      </AppBar>

        <Routes>
                 <Route exact path='/' element={< Home />}></Route>
                 <Route exact path='/zoom' element={< ZoomPage />}></Route>

          <Route exact path='/linkencoder' element={< LinkEncoder />}></Route>
	  <Route exact path='/uploadfiles' element={< UploadFiles />}></Route>
        </Routes>
        
    </Box>
    </Router>
  );
    //     <Container>
    //         <Router>
    //             <nav>
    //                 <ul>
    //                     <li>
    //                         <Link to="/home">
    //                             <Button>HOME</Button>
    //                         </Link>
    //                     </li>
    //                     <li>
    //                         <Link to="/zoom">
    //                             <Button>Zoom</Button>
    //                         </Link>
    //                     </li>
    //                     <li>
    //                         <Link to="/linkencoder">
    //                             <Button>Link Encoder</Button>
    //                         </Link>
    //                     </li>
    //                 </ul>
    //             </nav>
            
    //         <Routes>
    //             <Route exact path='/' ></Route>
    //             <Route exact path='/zoom' element={< ZoomPage />}></Route>
    //             <Route exact path='/linkencoder' element={< LinkEncoder />}></Route>
    //         </Routes>

    //     </Router>
    // </Container>);

}



export default Options;
