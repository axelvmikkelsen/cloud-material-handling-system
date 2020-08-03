import React, { useState, useEffect } from 'react';

import { useHttpClient } from '../../shared/hooks/http-hook';

import { Card, Row, Col, Container } from 'react-bootstrap';

const InfoTable = (props) => {
  const rowStyle = {
    borderBottom: '.5px dashed #ccc',
    paddingTop: '5px',
    paddingBottom: '5px',
  };

  const rightStyle = {
    textAlign: 'right',
  };

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [infoTable, setInfoTable] = useState();

  useEffect(() => {
     const requestInfoTable = async () => {
        try {
         const responseData = await sendRequest(process.env.REACT_APP_URL + "/info");
         console.log(responseData);
        } catch (err) {
         console.log('Could not fetch table info', err);
        }
     }
     requestInfoTable();
  }, [sendRequest])

  const output = {
    serverstatus: 'Ye',
    mqttstatus: 'Yo',
    currentmap: 'Good',
  };

  return (
    <Card
      style={{
        borderRadius: '6px',
        position: 'relative',
        top: '10%',
        marginRight: '15%',
      }}
    >
      <Card.Body>
        <Card.Title className="text-center">General</Card.Title>
        <Container responsive="sm">
          <Row style={rowStyle}>
            <Col>Server</Col>
            <Col style={rightStyle}>
              <i>{output.serverstatus}</i>
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col>MQTT</Col>
            <Col style={rightStyle}>
              <i>{output.mqttstatus}</i>
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col>Map Loaded</Col>
            <Col style={rightStyle}>
              <i>{output.currentmap}</i>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default InfoTable;
