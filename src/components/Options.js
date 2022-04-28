import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import LinkEncoder from "./LinkEncoder";
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ZoomPage from './zoom/zoom.js'
import Home from './home'
import {
    HashRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import { colors } from "@material-ui/core";
import { Container } from "react-bootstrap";



const Options = (props, window) => {
    return(

        <Container>
            <Router>

                <div>
                    <Link to="/home">
                        <Button>HOME</Button>
                    </Link>
                </div>
                <div>
                    <Link to="/zoom">
                        <Button>Zoom</Button>
                    </Link>
                </div>
                <div>
                    <Link to="/linkencoder">
                        <Button>Link Encoder</Button>
                    </Link>
                </div>
            
            
            <Routes>
                <Route exact path='/' ></Route>
                <Route exact path='/zoom' element={< ZoomPage />}></Route>
                <Route exact path='/linkencoder' element={< LinkEncoder />}></Route>
            </Routes>

        </Router>
    </Container>);

}



export default Options;
