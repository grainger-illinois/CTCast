import React, { useState, useEffect } from 'react'
//import { Form, Row, Col } from 'react-bootstrap'
//import Button from 'react-bootstrap/Button'
//import Badge from 'react-bootstrap/Badge'
// import { useNavigate } from "react-router-dom";
import useStyles from './zoom/styles'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { Message, AccessTime, Numbers, Download } from '@mui/icons-material';
import FormGroup from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';



/**
 * 2022/04/27:
 *   Implemented basic version of sending captions
 *   Need further testing to confirm the message is sent as expected
 *   Need to change to a better alignment
 */

let interval; //for 5s ping

const LinkEncoder = () => {
    //const [captionList, setCaptionList] = useState([]);
    //const [localLog, setLocalLog] = useState("");
    const [postData, setPostData] = useState({
        ip: '', port: '', caption: '', count: 0
    });

    function createLogTableItem(
        time,
        count,
        caption
    ) {
        return { time, count, caption};
    }

    const [postDataArr, setPostDataArr] = useState([]);

    useEffect(() => {
        const data = window.localStorage.getItem('linken_captioning');
        const data_log = window.localStorage.getItem('logging_data');
        setPostData(JSON.parse(data));
        setPostDataArr(JSON.parse(data_log));
    }, [])

    useEffect(() => {
        window.localStorage.setItem('linken_captioning', JSON.stringify(postData))
        window.localStorage.setItem('logging_data', JSON.stringify(postDataArr))
    }, [postData, postDataArr])

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        await window.linkEncoderAPI.sendToLinkEncoder(postData.caption, postData.ip, postData.port);

        var message = await window.linkEncoderAPI.getLastMessage();

        writeLog(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}, ${postData.count}:${message}`);
        postData.count += 1;
        setPostData({ ...postData, caption: '' });
        if (!postDataArr) {
            setPostDataArr([]);
        }
        setPostDataArr(arr => [createLogTableItem(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}`, postData.count, message), ...arr]);

    }

    const clear = () => {
        setPostData({ ip: '', port: '', caption: '', count: 0 });
        setPostDataArr([]);
        document.getElementById('locallog').textContent = "";
        window.linkEncoderAPI.clearLinkEncoder();
    };

    const [buttonText, setButtonText] = useState('Connect');
    const [selected, setSelected] = useState("success");
    const [checked, setIsChecked] = useState(false);

    const connectAndDisconnect = async () => {
        await window.linkEncoderAPI.connectionLinkEncoder(postData.ip, postData.port)
        .then(() => {
            if (buttonText == 'Connect'){
                setButtonText('Disconnect');
                setSelected("error");
            }
            else {
                setButtonText('Connect');
                setSelected("success");
            }  
        });
    };

    const pinging = async () => {
        return new Promise(resolve => {
            if (checked == false) {
                interval = setInterval(async () => {
                    var today = new Date();
                    var hours = today.getHours();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    var time = hours + ":" + today.getMinutes() + ":" + today.getSeconds() + ' ' + ampm;
                    await window.linkEncoderAPI.sendToLinkEncoder(time);    
                }, 5000);
                
            }
            resolve();
        })
    };

    const stopPinging = async () => {
        setIsChecked(!checked);
        clearInterval(interval);
        await pinging();
    }   

    const classes = useStyles();


    return (
        <div style={{ margin: "20px", marginTop: "30px" }} className="position-sticky">
            <h1 style={{ textAlign: "left" }}>Link Encoder</h1>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <TextField
                    name="ip"
                    variant="outlined"
                    label="IP Address"
                    fullWidth
                    value={postData ? postData.ip : ''}
                    onChange={(e) => setPostData({ ...postData, ip: e.target.value })}

                />
                <TextField
                    name="port"
                    variant="outlined"
                    label="Port"
                    fullWidth
                    align="left"
                    value={postData ? postData.port : ''}
                    onChange={(e) => setPostData({ ...postData, port: e.target.value })}
                />
                <Stack direction="row" spacing={2} sx={{ m: 1 }} alignItems="center" justifyContent="center">
                    <Button color={selected} variant="contained" onClick={connectAndDisconnect} sx={{height:"80%", width:"50%"}}>
                        {buttonText}
                    </Button>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={stopPinging} value={checked}/>} label="Ping"/>
                    </FormGroup>
                </Stack>
                <TextField
                    name="caption"
                    variant="outlined"
                    label="Message"
                    fullWidth
                    value={postData ? postData.caption : ''}
                    onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
                />

                <Stack direction="row" spacing={2} sx={{ m: 2 }}>
                    <Button color="primary" variant="outlined" id="zoompost" type="submit">
                        Submit
                    </Button>

                    <Button color="error" variant="outlined" onClick={clear}>
                        Clear
                    </Button>

                    <Button color="success" variant="outlined" endIcon={<Download />} onClick={downloadTxtFile}>
                        Download
                    </Button>

                    

                </Stack>

            </form>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={connectAndDisconnect}>
                
            </form>



            <div>
                {/* Remove 'hidden' to show text log */}
                <pre id='locallog' hidden></pre>
            </div>

            <br></br>

            <TableContainer sx={{ maxHeight: 200 }}>
                <Table stickyHeader size="small" aria-label="a dense table" sx={{ minWidth: 300 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="justify" sx={{ width: "10%" }}><Numbers fontSize="small"></Numbers></TableCell>
                            <TableCell align="justify" sx={{ width: "20%" }}><AccessTime fontSize="small"></AccessTime></TableCell>
                            <TableCell align="justify" sx={{ width: "70%" }}><Message fontSize="small"></Message></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {postDataArr ? postDataArr.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, wordWrap: "break-word" }}
                            >
                                <TableCell component="th" scope="row" align="justify" sx={{ width: "10%" }}>{row.count + 1}</TableCell>
                                <TableCell align="justify" sx={{ width: "20%" }}>{row.time}</TableCell>
                                <TableCell align="justify" sx={{ wordWrap: "break-word", width: "70%" }}>{row.caption}</TableCell>
                            </TableRow>
                        )): <TableRow></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
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
