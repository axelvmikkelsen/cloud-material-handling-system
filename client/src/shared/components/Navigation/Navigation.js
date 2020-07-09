import React from 'react';

import { Nav, Navbar } from 'react-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Cloud Material Handling System</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/">Dashboard</Nav.Link>
        <Nav.Link href="/jobs/new">Create Job</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="/signout">Sign out</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
