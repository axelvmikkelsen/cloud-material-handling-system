import React, { useState, useEffect } from 'react';
import { Card, CardDeck, Button, Col} from 'react-bootstrap';

import SOTable from '../components/SOTable';
import MHMTable from '../components/MHMTable';
import JobCard from '../components/JobCard/JobCard';
import InfoTable from '../components/InfoTable/InfoTable';

import ReactModal from '../../shared/components/UIElements/ReactModal';

import getDataFunctions from '../getDataFunctions/getDataFunctions';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Dashboard = () => {
  const [loadedSOs, setLoadedSOs] = useState();
  const [loadedMHMs, setLoadedMHMs] = useState();
  const [loadedJobs, setLoadedJobs] = useState();
  const [loadedTableData, setLoadedTableData] = useState();

  const { error, sendRequest, clearError } = useHttpClient();

  const [mqttIsActive, setMqttIsActive] = useState(false);

  const [assignmentIsActive, setAssignmentIsActive] = useState(false);

  useEffect(() => {
    getDataFunctions(
      setLoadedSOs,
      setLoadedMHMs,
      setLoadedJobs,
      setLoadedTableData,
      sendRequest
    );
    return;
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

  const buttonGroup = (
    <div>
      <div style={{ paddingBottom: '10px' }}>{mqttButton}</div>
      <div style={{ paddingBottom: '10px' }}>{aebutton}</div>
    </div>
  );

  let intervalId;

  const dbRefreshInterval = async () => {
    try {
      const status = await getDataFunctions(
        setLoadedSOs,
        setLoadedMHMs,
        setLoadedJobs,
        setLoadedTableData,
        sendRequest
      );
      if (status === 'failed') {
        clearInterval(intervalId);
      }
      console.log('refreshed')
    } catch (err) {}
  };

  const triggerAutoRefresh = (autoRefresh, setAutoRefresh) => {
    if (autoRefresh) {
      clearInterval(intervalId);
      setAutoRefresh(false);
      return
    }
    intervalId = setInterval(dbRefreshInterval, 10000);
    setAutoRefresh(true);
    return;
  };

  return (
    <div>
      <Card style={{ border: 'none' }}>
        <Card.Body />
      </Card>
      {error && (
        <ReactModal
          heading={'Backend fetch failed'}
          error={error}
          save={false}
          clear={clearError}
        />
      )}
      {loadedMHMs && loadedSOs && loadedJobs && loadedTableData && (
        <React.Fragment>
          <CardDeck style={{ maxHeight: '700px', minHeight: '450px'}}>
            <Col sm={9}>
              <JobCard style={{ margin: '5px' }} jobs={loadedJobs} />
            </Col>
            <Col sm={3}>
              <InfoTable
                isactive={mqttIsActive}
                server={loadedTableData.state}
                buttonGroup={buttonGroup}
                triggerAutoRefresh={triggerAutoRefresh}
              />
            </Col>
          </CardDeck>

          <CardDeck style={{ margin: '15px 5px 5px 15px' }}>
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
