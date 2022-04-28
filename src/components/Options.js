import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import LinkEncoder from "./LinkEncoder";
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ZoomPage from './zoom/zoom.js'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';



const Options = (props, window) => {
    return(
    <Router>
    <div className="App">
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/zoom">ZOOM</Link>
      </li>
      <li>
        <Link to="/linkencoder">link encoder</Link>
      </li>
    </ul>
    <Routes>
    <Route exact path='/' ></Route>
    <Route exact path='/zoom' element={< ZoomPage />}></Route>
    <Route exact path='/linkencoder' element={< LinkEncoder />}></Route>
    </Routes>
    </div>
    </Router>);
}

export default Options;
