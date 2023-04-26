import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Help as HelpIcon } from '@mui/icons-material'

import ZoomPage from './zoom/zoom.js'
import LinkEncoder from './LinkEncoder/LinkEncoder.js';
import Shortcuts from './Shortcuts.js';
import Help from "./Help.js";

import Home from './Home.js'
import './Options.css'
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink
} from 'react-router-dom';


const Options = () => {


  return (
    <Router>
        <AppBar className='center-align' style={{ background: '#13294B', width:'100vw', overflow:'hidden'}} position="relative">
          <Toolbar >
            <NavLink to="/" className="link" style={{ color: '#FFF'}}>
              <Button color="inherit" style={{textTransform:"none", fontSize:"20px"}}>CTCast</Button>
            </NavLink>
            <NavLink to="/zoom" className="link" style={({ isActive }) => ({ 
                            color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)' })}>
              <Button color="inherit">Zoom</Button>
            </NavLink>
            <NavLink to="/linkencoder" className="link" style={({ isActive }) => ({ 
                            color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)' })}>
              <Button color="inherit">Link Encoder</Button>
            </NavLink>
            <NavLink to="/uploadfiles" className="link" style={({ isActive }) => ({ 
                            color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)' })}>
              <Button color="inherit">Shortcuts</Button>
            </NavLink>
            <Box style={{ color: '#FFF', textDecoration: 'none', textAlign: "left" , flexGrow: "12"}}>
            </Box>
            <NavLink to="/help" className="link" style={{ color: '#FFF'}}>
              <Button color="inherit"><HelpIcon/></Button>
            </NavLink>
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