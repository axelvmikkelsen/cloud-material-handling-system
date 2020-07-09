import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';

import { Card, Form, Button, Col } from 'react-bootstrap';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const CreateJob = () => {
  const [loadedSOs, setLoadedSOs] = useState();
  const [formState, setFormState] = useState({
    description: '',
    fromxcoord: null,
    fromycoord: null,
    toxcoord: null,
    toycoord: null,
    so: null,
  });
  const [formSuccess, setFormSuccess] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  let options;

  useEffect(() => {
    const requestSOs = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/so'
        );
        setLoadedSOs(responseData.objects);
      } catch (err) {}
    };
    requestSOs();
  }, [sendRequest]);

  if (loadedSOs) {
    options = loadedSOs.map((so) => (
      <option key={so.id} value={so.id}>
        Tag {so.name}
      </option>
    ));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const body = {
      description: formState.description,
      from: {
        x: formState.fromxcoord,
        y: formState.fromycoord,
      },
      to: {
        x: formState.toxcoord,
        y: formState.toycoord,
      },
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
         setFormSuccess(true);
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

  if (formSuccess) {
     return <Redirect to="/" />
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Card.Header>
        <Card.Title style={{ marginTop: '10px' }}>Create Job</Card.Title>
      </Card.Header>
      <Card.Body>
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
              <Form.Label>From Location</Form.Label>
              <Form.Row>
                <Col xs={3}>
                  <Form.Control
                    id="fromxcoord"
                    type="number"
                    placeholder="X-Coordinate"
                    onChange={inputHandler}
                  />
                </Col>
                <Col xs={3}>
                  <Form.Control
                    id="fromycoord"
                    type="number"
                    placeholder="Y-Coordinate"
                    onChange={inputHandler}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>To Location</Form.Label>
              <Form.Row>
                <Col xs={3}>
                  <Form.Control
                    id="toxcoord"
                    type="number"
                    placeholder="X-Coordinate"
                    onChange={inputHandler}
                  />
                </Col>
                <Col xs={3}>
                  <Form.Control
                    id="toycoord"
                    type="number"
                    placeholder="Y-Coordinate"
                    onChange={inputHandler}
                  />
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
                    {options}
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
