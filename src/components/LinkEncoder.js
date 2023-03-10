import React, { useState, useEffect, useRef } from 'react'
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
import { RadioGroup, Radio, Box } from '@mui/material';
import { Drawer, FormControl, FormLabel } from '@material-ui/core';
import styles from './LinkEncoder.css'
import Network from './LinkEncoderComponents/Network.jsx';
import MessageEncoder from './LinkEncoderComponents/MessageEncoder.jsx';

const LinkEncoder = () => {
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

    const [localLog, setLocalLog] = useState("");
    const writeLog = (result) => {
        console.log("locallog", localLog);
        const a = localLog + `${result}\n`;
        console.log("writelog", a);
        setLocalLog(a);
        console.log("locallog", localLog);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await window.linkEncoderAPI.sendToLinkEncoder(postData.caption, postData.ip, postData.port);

        let message = await window.linkEncoderAPI.getLastMessage();

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
        setLocalLog("");
        window.linkEncoderAPI.clearLinkEncoder();
    };

    const classes = useStyles();

    return (
        <Box component={'form'} sx={{display:'flex', width:'100vw'}} onSubmit={handleSubmit}>
            <Network
            postData={postData}
            setPostData={setPostData}
            localLog={localLog}
            classes={classes}
            />
            <MessageEncoder
            classes={classes}
            setPostData={setPostData}
            postData={postData}
            clear={clear}
            postDataHistory={postDataArr}
            />
        </Box>

    );
}

export default LinkEncoder;

