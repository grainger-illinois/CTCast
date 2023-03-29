import React, { useState, useEffect } from 'react'
import useStyles from './styles'
import { Box } from '@mui/material';
import Network from './Network.jsx';
import MessageEncoder from './MessageEncoder.jsx';
import { useTheme } from "@mui/material";

const LinkEncoder = () => {
    const [postData, setPostData] = useState({
        ip: '', port: '', caption: '', count: 0
    });

    function createLogTableItem(
        time,
        count,
        caption
    ) {
        return { time, count, caption };
    }

    const [postDataHistory, setPostDataArr] = useState([]);

    useEffect(() => {
        const data = window.localStorage.getItem('linken_captioning');
        const data_log = window.localStorage.getItem('logging_data');
        setPostData(JSON.parse(data));
        setPostDataArr(JSON.parse(data_log));
    }, [])

    useEffect(() => {
        window.localStorage.setItem('linken_captioning', JSON.stringify(postData))
        window.localStorage.setItem('logging_data', JSON.stringify(postDataHistory))
    }, [postData, postDataHistory])

    const [localLog, setLocalLog] = useState("");
    const writeLog = (result) => {
        const a = localLog + `${result}\n`;
        setLocalLog(a);
    }

    const writeLogAndSetHistory = (message) => {
        writeLog(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}, ${postData.count}:${message}`);
        setPostData({ ...postData, count: postData.count + 1, caption: '' });
        if (!postDataHistory) {
            setPostDataArr([]);
        }
        setPostDataArr(arr => [createLogTableItem(
            `${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}`,
            postData.count,
            message), ...arr]
        );
    }


    const clear = () => {
        setPostData({ ip: '', port: '', caption: '', count: 0 });
        setPostDataArr([]);
        setLocalLog("");
        window.linkEncoderAPI.clearLinkEncoder();
    };

    const classes = useStyles();

    const {
        mixins: { toolbar },
    } = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100vw',
                height: `calc(100vh - (${toolbar?.minHeight}px + ${8}px))`,
                overflow: 'hidden'
            }}
        >
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
                writeLogAndSetHistory={writeLogAndSetHistory}
            >
                {postDataHistory}
            </MessageEncoder>
        </Box>

    );
}

export default LinkEncoder;

