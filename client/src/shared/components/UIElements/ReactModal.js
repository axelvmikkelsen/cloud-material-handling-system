import React, { useState } from 'react';

import { Modal, Button } from 'react-bootstrap';

const ReactModal = (props) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    props.clear();
  };
  // const handleShow = () => setShow(true);
  return (
    <React.Fragment>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {props.save && (
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ReactModal;
