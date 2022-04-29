import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
//import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Paper, Grid } from '@material-ui/core';

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

    return <div>
        <h2 style={{ textAlign: "center" }}>Link Encoder</h2>

        <Grid container direction="column" justifyContent="center" alignItems="center">
            <TextField name="ip" variant="outlined" size="small" label="IP (empty for default)"
                value={postData.ip} onChange={e => setPostData({ ...postData, ip: e.target.value })}
            />
            <TextField name="port" variant="outlined" size="small" label="Port (empty for default)"
                value={postData.port} onChange={e => setPostData({ ...postData, port: e.target.value })}
            />
            <TextField name="caption" variant="outlined" size="small" label="Caption"
                value={postData.caption} onChange={e => setPostData({ ...postData, caption: e.target.value })}
            />
            <Grid item>
                <Button variant="contained" color="primary" type="submit" onClick={e => handleSubmit(e)}>Send</Button>{' '}
                <Button variant="contained" color="inherit" onClick={clear} >Clear</Button>{' '}
                {/*<Button variant="contained" color="inherit" onClick={switchPage("../main")} >Back</Button>*/}
            </Grid>
            <Grid item container direction="column" alignItems="center">
                <pre id='locallog' ></pre>
                <Button onClick={downloadTxtFile}> Download Log</Button>
            </Grid>
        </Grid>

    </div>
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