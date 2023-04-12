import React, { useState, useEffect } from 'react'
import useStyles from './styles'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Message, AccessTime, Numbers, Download } from '@mui/icons-material';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from '@mui/material/Typography';


const Form = () => {

    function createLogTableItem(
        time,
        count,
        message
    ) {
        return { time, count, message};
    }

    //Function to download log file
    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([document.getElementById('thelog').outerHTML], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "myFile.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    //Post object for ZoomAPI key, message, and seq number
    const [postData, setPostData] = useState({
        zoomLink: '', message: '', count: 0
    });

    //Log object
    const [postDataArr, setPostDataArr] = useState( () => {
        //Updates the objects from locally saved objects
        //const data = window.localStorage.getItem('Zoom_captioning');
        const data_log = window.localStorage.getItem('logging_data');
        //const data_prased = JSON.parse(data)
        const data_log_parsed = JSON.parse(data_log);
        //setPostData(data_prased || "");
        return data_log_parsed || [];
    });

    //locally saves objects upon changes to postData and postDataArr
    useEffect(() => {
        window.localStorage.setItem('Zoom_captioning', JSON.stringify(postData))
        window.localStorage.setItem('logging_data', JSON.stringify(postDataArr))
    }, [postData, postDataArr])

    //Log updating function
    const mylog = (result) => {
        var thelog = document.getElementById('thelog');
        thelog.textContent += `${result}\n`;
    }

    const classes = useStyles();

    //hanles submit by calling zoomAPI and sending neccesary data to its function
    //sends logging information to mylog function
    //updates count
    //resets message
    const handleSubmit = async (e) => {

        e.preventDefault();

        await window.zoomAPI.zoomCaption(postData.message, postData.zoomlink);

        var message = await window.zoomAPI.getLastMessage();

        mylog(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}, ${postData.count}:${message}`);
        postData.count += 1;

        setPostData({ ...postData, message: '' });
        setPostDataArr(arr => [createLogTableItem(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}`, postData.count, message), ...arr]);
    }

    //resets postData and postDataArr objects
    const clear = () => {
        setPostData({ zoomlink: '', message: '', count: 0 });
        setPostDataArr([]);
        document.getElementById('thelog').textContent = "";
        window.zoomAPI.clearZoom();
    };

    const [open, setOpen] = useState(false);

    return (
        <div>
        <Card sx={{ minWidth: 300, width: '99vw'}}>
            <CardHeader
            title="Zoom"
            action={
                <IconButton
                    onClick={() => setOpen(!open)}
                    aria-label="expand"
                    size="small"
                    >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            }
            >
            </CardHeader>
            <div style={{ backgroundColor: '#e8e9eb', display: 'flex'}}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <CardContent>
                <Typography variant="body1">
                    <div>
                    <ul>
                            <li>To connect to Zoom meeting, enter valid Zoom API key from Zoom meeting</li>
                            <li>To send captions, add desired captions to the captions textbox and press send button or press enter key</li>
                            <li>To connect to new meeting or to disconnect, press clear button</li>
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
            </Collapse>
            </div>
        </Card>
        <div style={{ margin: "20px", marginTop: "30px" }}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <TextField
                    name="zoomAPI"
                    variant="outlined"
                    label="Zoom API Token"

                    fullWidth
                    value={postData.zoomlink}
                    onChange={(e) => setPostData({ ...postData, zoomlink: e.target.value })}

                />
                <TextField
                    name="message"
                    variant="outlined"
                    label="Message"

                    fullWidth
                    value={postData.message}
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })}
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

            <div>
                {/* Remove 'hidden' to show text log */}
                <pre id='thelog' hidden></pre>
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
                        {postDataArr.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, wordWrap: "break-word" }}
                            >
                                <TableCell component="th" scope="row" align="justify" sx={{ width: "10%" }}>{row.count + 1}</TableCell>
                                <TableCell align="justify" sx={{ width: "20%" }}>{row.time}</TableCell>
                                <TableCell align="justify" sx={{ wordWrap: "break-word", width: "70%" }}>{row.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        </div>
    )
}

export default Form



