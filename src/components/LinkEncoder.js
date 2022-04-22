import React, { useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

const LinkEncoder = (props) => {
    return <div>
        <h2 style={{ textAlign: "center" }}>Link Encoder</h2>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Col>
                    <Form.Control type="text" placeholder="IP Address" />
                </Col>
            </Form.Group>

	<Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Col>
                    <Form.Control type="text" placeholder="Port Number" />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Col>
                    <Form.Control type="text" placeholder="Caption" />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Col style={{ textAlign: "center" }}>
                    <Button variant="secondary">Back</Button>{' '}
                    <Button variant="dark" type="submit">Send</Button>
                </Col>
            </Form.Group>
        </Form>
    </div>
}

export default LinkEncoder;
