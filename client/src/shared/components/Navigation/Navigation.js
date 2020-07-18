import React, { useContext } from 'react';

import { AuthContext } from '../../../shared/context/auth-context';

import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from './ntnu_logo.png';

const Navigation = () => {
  const auth = useContext(AuthContext);
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/dashboard">
        {' '}
        <img
          style={{ paddingRight: '10px', width: '40px' }}
          src={logo}
          alt="LOGO"
        />
        Cloud Material Handling System
      </Navbar.Brand>
      {auth.isLoggedIn && (
        <React.Fragment>
          <Nav className="mr-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <NavDropdown title="Create new" id="nav-dropdown">
              <NavDropdown.Item href="/create/job">Job</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/create/tag">Tag</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link onClick={auth.logout}>Sign out</Nav.Link>
          </Nav>
        </React.Fragment>
      )}
    </Navbar>
  );
};

export default Navigation;
