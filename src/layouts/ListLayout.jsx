import React, { useEffect, useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { Col, Container, Row, Offcanvas, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import Footer from '../components/Shared/Footer';
import SidebarList from '../components/Shared/SidebarList';
import RoutePath from '../routes/RoutePath';
import ProposeGroup from '../components/Group/ProposeGroup';
import ProposeEvent from '../components/Event/ProposeEvent';
import SearchBar from '../components/Shared/SearchBar'
import '../assets/css/layouts/ListLayout.css'
import { useLocation } from 'react-router-dom';
import FormSubmit from '../components/Shared/FormSubmit';

function ListLayout({ children }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sidebarItems = [
        { iconName: 'list-circle', title: 'Danh sách nhóm', route: RoutePath.GROUP },
        { iconName: 'people-circle', title: 'Nhóm đã tham gia', route: RoutePath.GROUP_JOINED },
        { iconName: 'add-circle', title: 'Nhóm đã tạo', route: RoutePath.GROUP_CREATED },
    ];

    const sidebarItemsEvent = [
        { iconName: 'list-circle', title: 'Danh sách sự kiện', route: RoutePath.EVENT },
        { iconName: 'calendar-number', title: 'Sự kiện đã tham gia', route: RoutePath.EVENT_JOINED },
        { iconName: 'add-circle', title: 'Sự kiện đã tạo', route: RoutePath.EVENT_CREATED },
    ];

    const location = useLocation();
    const [lastPath, setLastPath] = useState(null);

    useEffect(() => {
        // Lưu đường dẫn vào state
        setLastPath(location.pathname);

        // Hoặc lưu vào localStorage
        localStorage.setItem('lastPath', location.pathname);
    }, [location]);

    // Lấy đường dẫn hiện tại
    const currentPath = location.pathname;

    // Kiểm tra xem đường dẫn có thuộc về sự kiện hay không
    const isEventRoute = currentPath.startsWith(RoutePath.EVENT) ||
        currentPath.startsWith(RoutePath.EVENT_JOINED) ||
        currentPath.startsWith(RoutePath.EVENT_CREATED);

    const isGroupRoutebtn = currentPath === RoutePath.GROUP;
    const isEventRouteBtn = currentPath === RoutePath.EVENT;

    // Tạo danh sách các mục cho SidebarList
    const sidebarData = isEventRoute ? sidebarItemsEvent : sidebarItems;

    // Thêm trạng thái active cho từng mục
    const sidebarItemsWithActiveState = sidebarData.map(item => ({
        ...item,
        isActive: currentPath === item.route,
    }));

    const handleCreateGroup = () => {
        alert("Created group");
    };

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
                <Col lg={3} md={3} className='p-0 d-none d-md-block d-lg-block'>
                    <div style={{ margin: '0 85px' }}>
                        <SidebarList items={sidebarItemsWithActiveState} />
                        {isGroupRoutebtn && (
                            <FormSubmit buttonText={'Tạo nhóm'} onButtonClick={handleCreateGroup} title={'Tạo nhóm'} openModalText={'Tạo nhóm'}>

                            </FormSubmit>
                        )}
                        {isEventRouteBtn && (
                            <FormSubmit buttonText={'Tạo sự kiện'} onButtonClick={handleCreateGroup} title={'Tạo sự kiện'} openModalText={'Tạo sự kiện'}>
                                <h5 className='fw-bolder'>Bảng thông tin</h5>
                                <p>Nhập thông tin chi tiết cho sự kiện của bạn</p>
                                <Form>
                                    <Form.Group controlId="eventName">
                                        <Form.Label>Tên sự kiện</Form.Label>
                                        <Form.Control style={{
                                            fontSize: '12px'
                                        }} type="text" placeholder="Nhập tên sự kiện..." className='rounded-5 p-3' />
                                    </Form.Group>

                                    <Form.Group controlId="eventDescription">
                                        <Form.Label>Mô tả sự kiện</Form.Label>
                                        <textarea rows={3} placeholder="Nhập mô tả sự kiện..." style={{
                                            fontSize: '12px',
                                            borderColor: '#d9d9d9'
                                        }} className='rounded-5 w-100 p-3' />
                                    </Form.Group>

                                    <Row style={{
                                        fontSize: '12px',
                                    }} >
                                        <Col md={6}>
                                            <Form.Group controlId="startDateTime">
                                                <Form.Label>Ngày giờ bắt đầu</Form.Label>
                                                <Form.Control type="datetime-local" className='rounded-5 p-3' />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="endDateTime">
                                                <Form.Label>Ngày giờ kết thúc</Form.Label>
                                                <Form.Control type="datetime-local" className='rounded-5' />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="location">
                                        <Form.Label>Địa điểm</Form.Label>
                                        <Form.Control type="text" className='rounded-5 p-3' style={{
                                            fontSize: '12px',
                                        }} placeholder="Nhập địa điểm..." />
                                    </Form.Group>

                                    <Form.Group controlId="eventImage">
                                        <Form.Label>Ảnh sự kiện</Form.Label>
                                        <div>
                                            <Form.Control
                                                type="file"
                                                className="d-none"
                                                id="custom-file-input"
                                            />
                                            <Button
                                                variant="primary"
                                                className="w-25"
                                                onClick={() => document.getElementById('custom-file-input').click()}
                                            >
                                                Chọn ảnh
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </FormSubmit>
                        )}
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
                <Col lg={6} md={9} xs={12} className='p-0'>
                    <Container className='container-list d-none d-md-flex mb-3'>

                        <div className='search-list-container'><SearchBar /></div>

                        <InputGroup className='search-list-container location-container'>
                            <InputGroup.Text className="search-icon bg-white search-icon-list border-end-0 rounded-start-5">
                                <ion-icon name="location-outline"></ion-icon>
                            </InputGroup.Text>
                            <FormControl
                                type="search"
                                placeholder="Địa điểm"
                                aria-label="Search"
                                className="searchBar-list rounded-start-0 rounded-end-5 border-start-0"
                                style={{
                                    border: '1px solid #ccc',
                                }}
                            />
                        </InputGroup>

                        <Button variant='outline-dark' className='d-flex align-items-center gap-2 rounded-5 btn-filter'>
                            <ion-icon name="filter-outline"></ion-icon>
                            Lọc
                        </Button>
                    </Container>
                    {children}
                </Col>

                {/* Propose column - Hidden on xs screens */}
                <Col lg={3} className='p-0 d-none d-lg-block'>
                    {isEventRoute ? (
                        <>
                            <ProposeEvent />
                        </>
                    ) : (
                        <>
                            <ProposeGroup />
                        </>
                    )}
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
