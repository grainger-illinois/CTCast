import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
//import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Paper, Grid } from '@material-ui/core';
import useStyles from './zoom/styles'

/**
 * 2022/04/27:
 *   Implemented basic version of sending captions
 *   Need further testing to confirm the message is sent as expected
 *   Need to change to a better alignment
 */

const LinkEncoder = (props) => {
    //const [captionList, setCaptionList] = useState([]);
    //const [localLog, setLocalLog] = useState("");
    const [postData, setPostData] = useState({
        ip: '', port: '', caption: '', count: 0
    });

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([document.getElementById('locallog').outerHTML], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "linkEncoderLog.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const writeLog = (result) => {
        var localLog = document.getElementById('locallog');
        localLog.textContent += `${result}\n`;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        window.linkEncoderAPI.sendToLinkEncoder(postData.caption, postData.ip, postData.port);

        writeLog(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}, ${postData.count}:${postData.caption}`);
        postData.count += 1;
        setPostData({ ...postData, caption: '' });
    }

    const clear = () => {
        setPostData({ ip: '', port: '', caption: '', count: 0 });
        document.getElementById('locallog').textContent = "";
    };

    // Unused
    const switchPage = (url) => {
        useNavigate(url);
    };

    const classes = useStyles();

    return (
        <div>
            <form autoComplete = "off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <TextField 
                    name = "ip" 
                    variant = "outlined" 
                    label="IP Address" 
                    fullWidth 
                    value={postData.ip} 
                    onChange = {(e) => setPostData({... postData, ip: e.target.value})}
                    
                    />
                <TextField 
                    name = "port" 
                    variant = "outlined" 
                    label="Port" 
                    fullWidth 
                    value={postData.port} 
                    onChange = {(e) => setPostData({... postData, port: e.target.value})}
                    />
                <TextField 
                    name = "caption" 
                    variant = "outlined" 
                    label="Message" 
                    fullWidth 
                    value={postData.caption} 
                    onChange = {(e) => setPostData({... postData, caption: e.target.value})}
                    />
                <Button id = "zoompost" className = {classes.buttonSubmit} variant = "contained" color="primary" size="large" type = "submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            
                
            </form>
            <div>

                <pre id='locallog' ></pre>
                    <Button onClick = {downloadTxtFile}> Download Log</Button>
            </div>
    
        </div>

    );
}

export default LinkEncoder;

/*
Old format for reference:
<Form><Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
    <Col>
        <Form.Control type="text" placeholder="IP Address" onChange={e => setPostData({ ...postData, ip: e.target.value })} />
    </Col>
</Form.Group></Form>
*/