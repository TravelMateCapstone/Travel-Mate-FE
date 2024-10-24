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
import { storage } from '../../firebaseConfig';
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
        setLastPath(location.pathname);
        localStorage.setItem('lastPath', location.pathname);
    }, [location]);

    const currentPath = location.pathname;

    const isEventRoute = currentPath.startsWith(RoutePath.EVENT) ||
        currentPath.startsWith(RoutePath.EVENT_JOINED) ||
        currentPath.startsWith(RoutePath.EVENT_CREATED);

    const isGroupRoutebtn = currentPath === RoutePath.GROUP;
    const isEventRouteBtn = currentPath === RoutePath.EVENT;

    const sidebarData = isEventRoute ? sidebarItemsEvent : sidebarItems;

    const sidebarItemsWithActiveState = sidebarData.map(item => ({
        ...item,
        isActive: currentPath === item.route,
    }));

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const storageRef = ref(storage, `images/${selectedFile.name}`);
        try {
            await uploadBytes(storageRef, selectedFile);
            const url = await getDownloadURL(storageRef);
            setUploadedUrl(url);
            alert("Upload successful");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Upload failed");
        }
    };

    const handleCreateGroup = () => {
        alert("Created group");
    };

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <Container fluid className='container-main'>
            <Row>
                <Col lg={12} className='p-0 mb-5'>
                    <Navbar />
                </Col>

                <Col xs={12} className="d-lg-none d-md-none p-0 mb-2">
                    <Button variant="outline-dark" onClick={handleShow} className="w-100">
                        Open Sidebar
                    </Button>
                </Col>

                <Col lg={3} md={3} className='p-0 d-none d-md-block d-lg-block'>
                    <div style={{ margin: '0 85px' }}>
                        <SidebarList items={sidebarItemsWithActiveState} />
                        {isGroupRoutebtn && (
                            <FormSubmit buttonText={'Tạo nhóm'} onButtonClick={handleCreateGroup} title={'Tạo nhóm'} openModalText={'Tạo nhóm'}>
                                <h2>Tạo nhóm</h2>
                                <Form>
                                    <Form.Group controlId="groupName" className="mb-3">
                                        <Form.Label>Tên nhóm</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên nhóm" />
                                    </Form.Group>

                                    <Form.Group controlId="groupDescription" className="mb-3">
                                        <Form.Label>Mô tả nhóm</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả nhóm" />
                                    </Form.Group>

                                    <Form.Group controlId="location" className="mb-3">
                                        <Form.Label>Địa điểm</Form.Label>
                                        <Form.Select>
                                            <option>Chọn địa điểm</option>
                                            <option value="1">Địa điểm 1</option>
                                            <option value="2">Địa điểm 2</option>
                                            <option value="3">Địa điểm 3</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="groupImage" className="mb-3">
                                    <Form.Label>Ảnh bìa nhóm</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Button variant="secondary" onClick={handleButtonClick}>
                                            Chọn ảnh
                                        </Button>
                                        <Form.Control
                                            type="file"
                                            id="fileInput"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <Button variant="primary" className="ms-3" onClick={handleUpload}>
                                            Tải lên
                                        </Button>
                                    </div>
                                    {uploadedUrl && (
                                        <img
                                            src={uploadedUrl}
                                            alt="Ảnh bìa nhóm"
                                            className="ms-3"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    )}
                                </Form.Group>
                                </Form>
                            </FormSubmit>
                        )}
                    </div>
                </Col>

                <Offcanvas show={show} onHide={handleClose} className="d-lg-none d-md-none">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Sidebar</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <SidebarList items={sidebarItemsWithActiveState} />
                    </Offcanvas.Body>
                </Offcanvas>

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

                <Col lg={3} className='p-0 d-none d-lg-block'>
                    {isEventRoute ? (
                        <ProposeEvent />
                    ) : (
                        <ProposeGroup />
                    )}
                </Col>

                <Col lg={12} className='p-0'>
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
}

export default ListLayout;
