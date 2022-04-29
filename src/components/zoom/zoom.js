import React, { useState } from 'react'
import useStyles from './styles'
import { TextField, Button, Typography, Paper } from '@material-ui/core';



const Form = () => {

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([document.getElementById('thelog').outerHTML], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "myFile.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    
    const [postData, setPostData] = useState({
        zoomLink: '', message: '', count: 0
    });

    const classes = useStyles();

    const mylog = (result) => {
        var thelog = document.getElementById('thelog');
        thelog.textContent += `${result}\n`;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //dispatch(createPost(postData));
        //dispatch(sendZoom(postData));

        window.zoomAPI.zoomCaption(postData.message, postData.zoomlink);

        mylog(`${new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now())}, ${postData.count}:${postData.message}`);
        postData.count += 1;
        setPostData({... postData, message:''});
    }

    const clear = () => {
        setPostData({ zoomlink: '', message: '', count: 0 });
        document.getElementById('thelog').textContent = "";
    };

  return (
    <div>
        <form autoComplete = "off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
            <TextField 
                name = "zoomAPI" 
                variant = "outlined" 
                label="Zoom API Token" 
                fullWidth 
                value={postData.zoomlink} 
                onChange = {(e) => setPostData({... postData, zoomlink: e.target.value})}
                
                />
            <TextField 
                name = "message" 
                variant = "outlined" 
                label="message" 
                fullWidth 
                value={postData.message} 
                onChange = {(e) => setPostData({... postData, message: e.target.value})}
                />
            <Button id = "zoompost" className = {classes.buttonSubmit} variant = "contained" color="primary" size="large" type = "submit" fullWidth>Submit</Button>
            <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
           
            
        </form>
    <div>
        <pre id='thelog' ></pre>
        <Button onClick = {downloadTxtFile}> Download</Button>
    </div>
    
    </div>
  )
}

export default Form



