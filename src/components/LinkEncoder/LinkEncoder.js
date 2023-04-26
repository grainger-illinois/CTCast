import React, { useState, useEffect } from 'react'
import useStyles from './styles'
import { Box } from '@mui/material';
import Network from './Network.jsx';
import MessageEncoder from './MessageEncoder.jsx';
import { useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from '@mui/material/Typography';

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

    const writeLogAndSetHistory = (message, option = 'sendAll') => {
        writeLog(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}, ${postData.count}:${message}`);
        if (option === 'sendAll') {
            setPostData({ ...postData, count: postData.count + 1, caption: '' });
        } else {
            setPostData({ ...postData, count: postData.count + 1});
        }

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

    const [open, setOpen] = useState(false);
    return (
        <div>
        <Card sx={{ minWidth: 300, width: '99vw'}}>
            <CardHeader
            title="Link Encoder"
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
                    <Typography variant="body2">
                        <div>
                            <ul>
                                <li>To connect to link encoder, enter valid IP address, port number</li>
                                <li>To send captions, add desired captions to the captions textbox and press send button or press enter key</li>
                                <li>To connect to new link encoder or to disconnect, press clear button</li>
                                <li>
                                    To download the caption log, press download button
                                </li>
                            </ul>
                        </div>
                    </Typography>
                </CardContent>
            </Collapse>
            </div>
        </Card>
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
        </div>
    );
}

export default LinkEncoder;

