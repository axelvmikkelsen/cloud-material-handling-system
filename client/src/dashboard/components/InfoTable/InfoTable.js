import React, { useState } from 'react';

import { Card, Row, Col, Container, Form } from 'react-bootstrap';

const InfoTable = (props) => {
  const rowStyle = {
    borderBottom: '.5px dashed #ccc',
    paddingTop: '8px',
    paddingBottom: '8px',
  };

  const rightStyle = {
    textAlign: 'right',
  };

  const [autoRefresh, setAutoRefresh] = useState(false);

  const output = {
    serverstatus: 'Ye',
    mqttstatus: 'Yo',
    currentmap: 'LabConfig2',
  };

  let server = (
    <div>
      <span style={{ paddingRight: '7px' }}>Error</span>
      <div
        style={{
          float: 'right',
          width: '14px',
          height: '14px',
          backgroundColor: 'f54242',
          borderRadius: '12px',
        }}
      />
    </div>
  );
  if (props.server === 1) {
    server = (
      <div>
        <span style={{ paddingRight: '7px', fontSize: '15px' }}>RUNNING</span>
        <div
          style={{
            float: 'right',
            width: '22px',
            height: '22px',
            backgroundColor: '#2ade36',
            borderRadius: '12px',
          }}
        />
      </div>
    );
  }

  let mqtt = (
    <div>
      <span>Disconnected</span>
    </div>
  );
  if (props.isactive) {
    mqtt = (
      <div>
        <span>Connected</span>
      </div>
    );
  }

  return (
    <Card
      style={{
        borderRadius: '6px',
        position: 'relative',
        top: '7%',
        marginRight: '15%',
      }}
    >
      <Card.Body>
        <Card.Title className="text-center">General</Card.Title>
        <Container responsive="sm">
          <Row style={rowStyle}>
            <Col>Server</Col>
            <Col style={rightStyle}>{server}</Col>
          </Row>
          <Row style={rowStyle}>
            <Col>MQTT</Col>
            <Col style={rightStyle}>{mqtt}</Col>
          </Row>
          <Row style={rowStyle}>
            <Col>Map Loaded</Col>
            <Col style={rightStyle}>{output.currentmap}</Col>
          </Row>
          <Row style={rowStyle}>
            <Col><a href="https://app.pozyx.io/" target="_blank" style={{ textAlign: 'center'}}>Pozyx Dashboard</a></Col>
          </Row>
        </Container>
        <Container style={{ paddingTop: '25px' }}>
          {props.buttonGroup}
        </Container>
        <Form
          style={{ textAlign: 'center' }}
          onChange={() => {
            props.triggerAutoRefresh(autoRefresh, setAutoRefresh);
          }}
        >
          <Form.Check type="switch" id="auto-refresh-switch" label="Refresh" />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default InfoTable;
