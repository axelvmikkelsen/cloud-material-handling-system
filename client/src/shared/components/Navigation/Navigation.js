import React, { useContext } from 'react';

import { AuthContext } from '../../../shared/context/auth-context';

import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

const Navigation = () => {
  const auth = useContext(AuthContext);
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/dashboard">
        {' '}
        <img
          style={{ paddingRight: '10px', width: '40px' }}
          src="https://public.boxcloud.com/api/2.0/internal_files/560190425841/versions/593840139441/representations/png_paged_2048x2048/content/1.png?access_token=1!ETfOIKrj2J29TCphMxZdEfGi3PKP6UZDu5KWZGE28lEFoKhpbMHGsxij_kXa8RndVwEPgDu-qI-pCBGw5vi96TgglOpTtUJ8lhhuzmixC7dGzQEazFZJZrJTxYOLrKIy9NubU1fbyt8TaT24u8tpyLuaJXp8esSyEhGfRqlxltbJs6IUOMCHq6uU4-U61MTRaELX8Hd3XyyYOBEEyuMn0_llPKYG-YFfDZLxWfy75nzFdhnLdJkGahpkQjTJy4kOLVydv5CoUZHGidASX9HbESDPcMJUoAaFB8B5GupoGLpmMN88iSvaZkYeBwqPPMk26l9WlMx6kkcBYK3RfKAr-iMka6TJjvCl8KzkXA4ydjPontuL0lBpvy7-KPNj5jhe8aDg-Aq1AbBswPiGQpzOXw6TrchdQ87gvx8ZNCfytykRLzCa5IB9hIhKc_DuG6nBAFi8XhATNx8p0fk9lhcsvvNlW-gdpU1XeDzyvF_tzz_hOKZI3vlKmRyL3wTGCCAysQWsissP_5wO9-fWFvr6ubzq-wKFsA552couU-VwT_3nMkSlmloL36QtZY-VnNiESg..&shared_link=https%3A%2F%2Fntnu.app.box.com%2Fs%2Fxyr0d1btczge3xfj2bocntw1oydjbe78&box_client_name=box-content-preview&box_client_version=2.46.0"
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
