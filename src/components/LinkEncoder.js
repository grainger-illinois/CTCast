import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

/**
 * 2022/04/27:
 *   Implemented basic version of sending captions
 *   Need further testing to confirm the message is sent as expected
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

        window.linkEncoderAPI.sendToLinkEncoder(postData.caption, postData.port);

        writeLog(`${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())}, ${postData.count}:${postData.caption}`);
        postData.count += 1;
        setPostData({ ...postData, caption: '' });
    }

    return <div>
        <h2 style={{ textAlign: "center" }}>Link Encoder</h2>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Col>
                    <Form.Control type="text" placeholder="IP Address" onChange={e => setPostData({ ...postData, ip: e.target.value })} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Col>
                    <Form.Control type="text" placeholder="Port Number" onChange={e => setPostData({ ...postData, port: e.target.value })} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Col>
                    <Form.Control type="text" placeholder="Caption" onChange={e => setPostData({ ...postData, caption: e.target.value })}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Col style={{ textAlign: "center" }}>
                    <Button variant="secondary">Back</Button>{' '}
                    <Button variant="dark" type="submit" onClick={e => handleSubmit(e)}>Send</Button>
                </Col>
            </Form.Group>
        </Form>
        <div>
            <pre id='locallog' ></pre>
            <Button onClick={downloadTxtFile}> Download</Button>
        </div>
    </div>
}

export default LinkEncoder;
