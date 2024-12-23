import React, { useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { Col, Container, Row, Offcanvas, Button } from 'react-bootstrap';
import Footer from '../components/Shared/Footer';
import SidebarList from '../components/Shared/SidebarList';
import RoutePath from '../routes/RoutePath';

function DetailLayout({ children }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sidebarItems = [
        { iconName: 'list-circle', title: 'Danh sách nhóm', route: RoutePath.GROUP },
        { iconName: 'add-circle', title: 'Nhóm đã tạo', route: RoutePath.GROUP_CREATED },
        { iconName: 'people-circle', title: 'Nhóm tham gia', route: RoutePath.GROUP_JOINED },
    ];

    const sidebarItemsEvent = [
        { iconName: 'list-circle', title: 'Danh sách sự kiện', route: RoutePath.EVENT },
        { iconName: 'add-circle', title: 'Sự kiện đã tạo', route: RoutePath.EVENT_CREATED },
        { iconName: 'calendar-number', title: 'Sự kiện tham gia', route: RoutePath.EVENT_JOINED },
    ];

    const currentPath = location.pathname;
    const isEventRoute = currentPath.startsWith(RoutePath.EVENT);
    const sidebarData = isEventRoute ? sidebarItemsEvent : sidebarItems;
    const sidebarItemsWithActiveState = sidebarData.map(item => ({
        ...item
    }));

    return (
        <Container fluid className='container-main'>
            <Row>
                {/* Navbar */}
                <Col lg={12} className='p-0 mb-5'>
                    <Navbar />
                </Col>

                {/* Toggle button for xs screen to show sidebar */}
                <Col xs={12} className="d-lg-none d-md-none p-0 mb-2">
                    <Button variant="outline-dark" onClick={handleShow} className="w-100">
                        Open Sidebar
                    </Button>
                </Col>

                {/* Sidebar for lg and md screens */}
                <Col lg={3} md={3} className='p-0 d-none d-md-block d-lg-block' style={{ minHeight: '100%' }}>
                    <div style={{ margin: '0 85px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className='d-flex justify-content-between' style={{ flexGrow: 1 }}>
                            <SidebarList items={sidebarItemsWithActiveState} />
                            <div style={{
                                borderRight: '1px solid #e0e0e0',
                                minHeight: '100%',
                            }}></div>
                        </div>
                    </div>
                </Col>

                {/* Offcanvas for xs screens */}
                <Offcanvas show={show} onHide={handleClose} className="d-lg-none d-md-none">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Sidebar</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <SidebarList items={sidebarItemsWithActiveState} />
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Main content - full width on xs */}
                <Col lg={9} md={9} xs={12} className='p-0'>
                    {children}
                </Col>

                {/* Footer */}
                <Col lg={12} className='p-0'>
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
}

export default DetailLayout;
