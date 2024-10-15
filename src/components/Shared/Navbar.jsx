import React from 'react';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath'
function Navbar() {
  return (
    <BootstrapNavbar bg="light" expand="lg" className="fixed-top">
      <BootstrapNavbar.Brand href="#home">Brand</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link >
            <Link to={RoutePath.ADMIN}>Trang chủ</Link>
          </Nav.Link>
          <Nav.Link >
            <Link to={RoutePath.EVENT}>Sự kiện</Link>
          </Nav.Link>
          <Nav.Link >
            <Link to={RoutePath.GROUP}>Nhóm</Link>
          </Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

export default Navbar;
