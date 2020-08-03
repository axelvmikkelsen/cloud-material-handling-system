import React, { useState, useEffect } from 'react';
import { Card, CardDeck, Button, Container, Row, Col } from 'react-bootstrap';

import SOTable from '../components/SOTable';
import MHMTable from '../components/MHMTable';
import JobCard from '../components/JobCard/JobCard';
import InfoTable from '../components/InfoTable';

import ReactModal from '../../shared/components/UIElements/ReactModal';

import getDataFunctions from '../getDataFunctions/getDataFunctions';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Dashboard = () => {
  const [loadedSOs, setLoadedSOs] = useState();
  const [loadedMHMs, setLoadedMHMs] = useState();
  const [loadedJobs, setLoadedJobs] = useState();

  const { error, sendRequest, clearError } = useHttpClient();

  const [mqttIsActive, setMqttIsActive] = useState(false);

  const [assignmentIsActive, setAssignmentIsActive] = useState(false);

  useEffect(() => {
    getDataFunctions(setLoadedSOs, setLoadedMHMs, setLoadedJobs, sendRequest);
    const dbRefreshInterval = setInterval(async () => {
      const status = await getDataFunctions(
        setLoadedSOs,
        setLoadedMHMs,
        setLoadedJobs,
        sendRequest
      );
      if (status === 'failed') {
        clearInterval(dbRefreshInterval);
      }
    }, 100000);
    return () => clearInterval(dbRefreshInterval);
  }, [sendRequest]);

  const fireMqttConnection = async (status) => {
    try {
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/lifecycle/mqtt',
        'POST',
        JSON.stringify({
          mqttstatus: status,
        }),
        { 'Content-Type': 'application/json' }
      );
      if (response.success) {
        if (status === 'activate') {
          setMqttIsActive(true);
        }
        if (status === 'shutdown') {
          setMqttIsActive(false);
        }
      }
    } catch (err) {
      console.log('Something went wrong in the post request');
    }
  };

  const fireAssignmentConnection = async (status) => {
    try {
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/lifecycle/ae',
        'POST',
        JSON.stringify({
          aestatus: status,
        }),
        { 'Content-Type': 'application/json' }
      );
      if (response.success) {
        if (status === 'activate') {
          setAssignmentIsActive(true);
        }
        if (status === 'shutdown') {
          setAssignmentIsActive(false);
        }
      }
    } catch (err) {
      console.log(
        'Something went wrong starting or shutting down the assignment engine'
      );
    }
  };

  let mqttButton;

  if (!mqttIsActive) {
    mqttButton = (
      <Card
        border="white"
        className="text-right"
        onClick={() => fireMqttConnection('activate')}
      >
        <Button size="sm" variant="outline-primary">
          Connect MQTT
        </Button>
      </Card>
    );
  }
  if (mqttIsActive) {
    mqttButton = (
      <Card
        border="white"
        className="text-right"
        onClick={() => fireMqttConnection('shutdown')}
      >
        <Button size="sm" variant="outline-warning">
          Disconnect MQTT
        </Button>
      </Card>
    );
  }

  let aebutton;
  if (!assignmentIsActive) {
    aebutton = (
      <Card
        border="white"
        className="text-right"
        onClick={() => fireAssignmentConnection('activate')}
      >
        <Button size="sm" variant="outline-primary">
          Start Assignment Engine
        </Button>
      </Card>
    );
  }
  if (assignmentIsActive) {
    aebutton = (
      <Card
        border="white"
        className="text-right"
        onClick={() => fireAssignmentConnection('shutdown')}
      >
        <Button size="sm" variant="outline-warning">
          Shutdown Assignment Engine
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <Card style={{ border: 'none'}}>
        <Card.Body>
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <div style={{ width: '80%', float: 'left' }}>
              <h1>Dashboard</h1>
            </div>
            <div style={{ marginLeft: '150px', marginBottom: '5px' }}>
              {mqttButton}
            </div>
            <div style={{ marginLeft: '150px', marginTop: '5px' }}>
              {aebutton}
            </div>
          </div>

          <hr style={{ marginTop: '20px', align: 'center', width: '99.7%' }} />
        </Card.Body>
      </Card>
      {error && (
        <ReactModal
          heading={'Backend fetch failed'}
          error={error}
          save={false}
          clear={clearError}
        />
      )}
      {loadedMHMs && loadedSOs && loadedJobs && (
        <React.Fragment>
          <CardDeck >
              <Col sm={9}>
                <JobCard style={{ margin: '5px' }} jobs={loadedJobs} />
              </Col>
              <Col sm={3}>
                <InfoTable />
              </Col>
          </CardDeck>

          <CardDeck style={{ margin: '5px', marginBottom: '15px' }}>
            <SOTable
              title={'Smart Objects'}
              description={
                'Objects to be picked up and delivered at specified locations.'
              }
              content={loadedSOs}
            />
            <MHMTable
              title={'Material Handling Modules'}
              description={'Handlers able to transport Smart Objects.'}
              content={loadedMHMs}
            />
          </CardDeck>
        </React.Fragment>
      )}
    </div>
  );
};

export default Dashboard;
