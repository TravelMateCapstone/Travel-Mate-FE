import React, { useState } from 'react';
import { Col, Container, Row, Offcanvas, Button } from 'react-bootstrap';

function AdminLayout({ children }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Container fluid>
            <Row>
                {/* Toggle button visible only on xs screens and full width */}
                <Col className="d-lg-none d-md-none p-0 mb-2">
                    <Button variant="outline-dark" onClick={handleShow} className="w-100">
                        Open Sidebar
                    </Button>
                </Col>

                {/* Sidebar for lg and md screens */}
                <Col lg={3} md={3} className='d-none d-md-block d-lg-block p-0'>
                    Sidebar
                </Col>

                {/* Offcanvas for xs screens */}
                <Offcanvas show={show} onHide={handleClose} className="d-lg-none d-md-none">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Sidebar</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Sidebar content goes here
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Main content area */}
                <Col lg={9} md={9} className='p-0'>
                    <div className='d-none d-md-block d-lg-block'>NavbarPanel</div>
                    {children}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminLayout;
