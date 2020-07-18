import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { useHttpClient } from '../shared/hooks/http-hook';

import { Card, Form, Button, Col } from 'react-bootstrap';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import ReactModal from '../shared/components/UIElements/ReactModal';

const CreateTag = () => {
  const [formState, setFormState] = useState({
    name: null,
    type: '',
    agv: false,
    forklift: false,
    manual: false,
    description: '',
  });

  const [formSuccess, setFormSuccess] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const body = {
      name: formState.name,
      type: formState.type,
      transportclass: {
        agv: formState.agv,
        forklift: formState.forklift,
        manual: formState.manual,
      },
      description: formState.description,
    };

    let url;
    if (body.type === 'so') {
      url = '/so';
    }
    if (body.type === 'mhm') {
      console.log('The url is mhm');
      url = '/mhm';
    }

    try {
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + url,
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

  const checkboxHandler = (event) => {
    const { id, checked } = event.target;
    const newState = { ...formState };
    newState[id] = checked;
    setFormState({ ...newState });
  };

  if (formSuccess) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Card.Header>
        <Card.Title style={{ marginTop: '10px' }}>Create Tag</Card.Title>
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
              <Form.Label>Name (ID in pozyx)</Form.Label>
              <Form.Row>
                <Col xs={3}>
                  <Form.Control
                    id="name"
                    type="text"
                    placeholder="Enter ID number for Tag"
                    onChange={inputHandler}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Row>
                <Col xs={3}>
                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    id="type"
                    custom
                    onChange={inputHandler}
                  >
                    <option default value={null}>
                      ---
                    </option>
                    <option value="so">Smart Object</option>
                    <option value="mhm">Material Handling Module</option>
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Transport Class</Form.Label>
              <Form.Row>
                <Col xs={6}>
                  <Form.Check
                    inline
                    label="AGV"
                    type="checkbox"
                    id="agv"
                    onChange={checkboxHandler}
                  />
                  <Form.Check
                    inline
                    label="Forklift"
                    type="checkbox"
                    id="forklift"
                    onChange={checkboxHandler}
                  />
                  <Form.Check
                    inline
                    label="Manual"
                    type="checkbox"
                    id="manual"
                    onChange={checkboxHandler}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
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
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default CreateTag;
