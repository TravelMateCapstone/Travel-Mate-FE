import React, { useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { Col, Container, Row, Offcanvas, Button } from 'react-bootstrap';
import Footer from '../components/Shared/Footer';

function ListLayout({ children }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Container fluid>
            <Row>
                {/* Navbar */}
                <Col lg={12} className='p-0'>
                    <Navbar />
                </Col>

                {/* Toggle button for xs screen to show sidebar */}
                <Col xs={12} className="d-lg-none d-md-none p-0 mb-2">
                    <Button variant="outline-dark" onClick={handleShow} className="w-100">
                        Open Sidebar
                    </Button>
                </Col>

                {/* Sidebar for lg and md screens */}
                <Col lg={2} md={3} className='bg-danger p-0 d-none d-md-block d-lg-block'>
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

                {/* Main content - full width on xs */}
                <Col lg={8} md={9} xs={12} className='bg-success p-0'>
                    {children}
                </Col>

                {/* Propose column - Hidden on xs screens */}
                <Col lg={2} className='bg-secondary p-0 d-none d-lg-block'>
                    Propose
                </Col>

                {/* Footer */}
                <Col lg={12} className='p-0'>
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
}

export default ListLayout;
