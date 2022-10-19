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
    const [postDataArr, setPostDataArr] = useState([]);

    //Updates the objects from locally saved objects
    useEffect(() => {
        const data = window.localStorage.getItem('Zoom_captioning');
        const data_log = window.localStorage.getItem('logging_data');
        setPostData(JSON.parse(data));
        setPostDataArr(JSON.parse(data_log));
    }, [])

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
        if (!postDataArr) {
            setPostDataArr([]);
        }
        setPostDataArr(arr => [createLogTableItem(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}`, postData.count, message), ...arr]);
    }

    //resets postData and postDataArr objects
    const clear = () => {
        setPostData({ zoomlink: '', message: '', count: 0 });
        setPostDataArr([]);
        document.getElementById('thelog').textContent = "";
        window.zoomAPI.clearZoom();
    };


    return (
        <div style={{ margin: "20px", marginTop: "30px" }}>
            <h1 style={{ textAlign: "left" }}>Zoom</h1>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <TextField
                    name="zoomAPI"
                    variant="outlined"
                    label="Zoom API Token"

                    fullWidth
                    value={postData ? postData.zoomlink : ''}
                    onChange={(e) => setPostData({ ...postData, zoomlink: e.target.value })}

                />
                <TextField
                    name="message"
                    variant="outlined"
                    label="Message"

                    fullWidth
                    value={postData ? postData.message : ''}
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
                        {postDataArr ? postDataArr.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, wordWrap: "break-word" }}
                            >
                                <TableCell component="th" scope="row" align="justify" sx={{ width: "10%" }}>{row.count + 1}</TableCell>
                                <TableCell align="justify" sx={{ width: "20%" }}>{row.time}</TableCell>
                                <TableCell align="justify" sx={{ wordWrap: "break-word", width: "70%" }}>{row.message}</TableCell>
                            </TableRow>
                        )): <TableRow></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Form



