import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Help as HelpIcon } from '@mui/icons-material'

import ZoomPage from './zoom/zoom.js'
import LinkEncoder from './LinkEncoder/LinkEncoder.js';
import Shortcuts from './Shortcuts/Shortcuts.js';
import Help from "./Help.js";

import Home from './Home.js'
import './Options.css'
import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';


const Options = () => {


  return (
    <Router>
        <AppBar className='center-align' style={{ background: '#13294B', width:'100vw', overflow:'hidden'}} position="relative">
          <Toolbar >
            <Link to="/"style={{ color: '#FFF', textDecoration: 'none', textAlign: "left", flexGrow:"1"}}>
              <Button color="inherit" style={{textTransform:"none", fontSize:"20px"}}>CTCast</Button>
            </Link>
            <Link to="/zoom" style={{ color: '#FFF', textDecoration: 'none', textAlign: "center"}}>
              <Button color="inherit">Zoom</Button>
            </Link>
            <Link to="/linkencoder" style={{ color: '#FFF', textDecoration: 'none', textAlign: "center"}}>
              <Button color="inherit">Link Encoder</Button>
            </Link>
            <Link to="/uploadfiles" style={{ color: '#FFF', textDecoration: 'none', textAlign: "center"}}>
              <Button color="inherit">Shortcuts</Button>
            </Link>
            <Box style={{ color: '#FFF', textDecoration: 'none', textAlign: "left" , flexGrow: "12"}}>
            </Box>
            <Link to="/help" style={{ color: '#FFF', textDecoration: 'none', textAlign: "center"}}>
              <Button color="inherit"><HelpIcon/></Button>
            </Link>
          </Toolbar>

        </AppBar>


        <Routes>
          <Route exact path='/' element={< Home />}></Route>
          <Route exact path='/zoom' element={< ZoomPage />}></Route>
          <Route exact path='/linkencoder' element={< LinkEncoder />}></Route>
          <Route exact path='/uploadfiles' element={< Shortcuts />}></Route>
          <Route exact path='/help' element={< Help />}></Route>
        </Routes>
    </Router>
  );

}



export default Options;