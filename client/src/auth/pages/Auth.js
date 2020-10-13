import React, { useState, useContext } from 'react';

import { Container, Row, Card, Form, Button } from 'react-bootstrap';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import ReactModal from '../../shared/components/UIElements/ReactModal';

const Auth = () => {
  const auth = useContext(AuthContext);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const { error, sendRequest, clearError } = useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/login/login',
        'POST',
        JSON.stringify({
          email: formState.email,
          password: formState.password,
        }),
        { 'Content-Type': 'application/json' }
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.log('login failed');
    }
  };

  const inputHandler = (event) => {
    const { id, value } = event.target;
    const newState = { ...formState };
    newState[id] = value;
    setFormState({ ...newState });
  };

  return (
    <Container
      style={{
        justifyContent: 'center',
        display: 'flex',
        alginItems: 'center',
        marginTop: '200px',
      }}
    >
      {error && <ReactModal heading={"Login failed"} error={error} save={false} clear={clearError} />}
      <Row>
        <Card style={{ width: '500px'}}>
          <Card.Header className="text-center">
            Please enter login credentials
          </Card.Header>
          <Card.Body>
            <Form onSubmit={authSubmitHandler}>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={inputHandler}
                />
              </Form.Group>
              <Button variant="primary" block type="submit">
                LOG IN
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default Auth;
