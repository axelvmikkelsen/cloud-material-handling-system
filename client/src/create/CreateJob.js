import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useHttpClient } from '../shared/hooks/http-hook';

import { Card, Form, Button, Col } from 'react-bootstrap';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import ReactModal from '../shared/components/UIElements/ReactModal';

const CreateJob = () => {
  const [loadedSOs, setLoadedSOs] = useState();
  const [loadedAreas, setLoadedAreas] = useState();
  const [formState, setFormState] = useState({
    description: '',
    fromarea: null,
    toarea: null,
    so: null,
  });
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  let soOptions, areaOptions;

  useEffect(() => {
    const requestSOs = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/so'
        );
        setLoadedSOs(responseData.objects);
      } catch (err) {}
    };
    const requestAreas = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            '/map/5efaf181f8a8e697068e13f5/areas'
        );
        setLoadedAreas(responseData.areas);
      } catch (err) {}
    };
    requestSOs();
    requestAreas();
  }, [sendRequest]);

  if (loadedSOs) {
    soOptions = loadedSOs.map((so) => (
      <option key={so.id} value={so.id}>
        {so.byname}
      </option>
    ));
  }

  if (loadedAreas) {
    areaOptions = loadedAreas.map((area) => (
      <option key={area.id} value={area.id}>
        {area.name}
      </option>
    ));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const body = {
      description: formState.description,
      fromarea: formState.fromarea,
      toarea: formState.toarea,
      soid: formState.so,
    };
    try {
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/jobs',
        'POST',
        JSON.stringify(body),
        { 'Content-Type': 'application/json' }
      );

      if (response.success) {
        setFormSubmitSuccess(true);
      }
    } catch (err) {
      console.log(error);
    }
  };

  const inputHandler = (event) => {
    const { id, value } = event.target;
    const newState = { ...formState };
    newState[id] = value;
    setFormState({ ...newState });
  };

  if (formSubmitSuccess) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Card.Header>
        <Card.Title style={{ marginTop: '10px' }}>Create Job</Card.Title>
      </Card.Header>
      <Card.Body>
        {error && (
          <ReactModal
            heading={'Something went wrong'}
            error={error}
            save={false}
            clear={clearError}
          />
        )}
        {isLoading && <LoadingSpinner />}
        {!isLoading && (
          <Form onSubmit={onSubmitHandler}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Row>
                <Col xs={6}>
                  <Form.Control
                    id="description"
                    type="text"
                    placeholder="Enter description"
                    onChange={inputHandler}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>From AREA</Form.Label>
              <Form.Row>
                <Col xs={6}>
                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    id="fromarea"
                    custom
                    onChange={inputHandler}
                  >
                    <option default value={null}>
                      ---
                    </option>
                    {areaOptions}
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>To AREA</Form.Label>
              <Form.Row>
                <Col xs={6}>
                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    id="toarea"
                    custom
                    onChange={inputHandler}
                  >
                    <option default value={null}>
                      ---
                    </option>
                    {areaOptions}
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label className="mr-sm-2" htmlFor="chooseSO">
                Choose Smart Object
              </Form.Label>
              <Form.Row>
                <Col xs={6}>
                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    id="so"
                    custom
                    onChange={inputHandler}
                  >
                    <option default value={null}>
                      ---
                    </option>
                    {soOptions}
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default CreateJob;
