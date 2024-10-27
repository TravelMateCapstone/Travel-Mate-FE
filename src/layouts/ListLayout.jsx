import React, { useEffect, useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { Col, Container, Row, Offcanvas, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import Footer from '../components/Shared/Footer';
import SidebarList from '../components/Shared/SidebarList';
import RoutePath from '../routes/RoutePath';
import ProposeGroup from '../components/Group/ProposeGroup';
import ProposeEvent from '../components/Event/ProposeEvent';
import SearchBar from '../components/Shared/SearchBar';
import '../assets/css/layouts/ListLayout.css';
import { useLocation } from 'react-router-dom';
import FormSubmit from '../components/Shared/FormSubmit';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ListLayout({ children }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [filePlaceholder, setFilePlaceholder] = useState("Nhấn vào đây để upload"); // Initial placeholder text


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
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupLocation, setGroupLocation] = useState('');
    const [errors, setErrors] = useState({});

    const token = useSelector((state) => state.auth.token); // Get token from Redux store
    const user = useSelector((state) => state.auth.user); // Get user from Redux store


    useEffect(() => {
        const newErrors = { ...errors };
        if (groupName && groupName.length >= 10 && groupName.length <= 25) {
            delete newErrors.groupName;
        }
        if (groupDescription) {
            delete newErrors.groupDescription;
        }
        if (uploadedUrl) {
            delete newErrors.groupImageUrl;
        }
        setErrors(newErrors);

    }, [groupName, groupDescription, uploadedUrl]);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFilePlaceholder(file.name); // Update placeholder with file name
            const storageRef = ref(storage, `images/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                setUploadedUrl(url);
            } catch (error) {
                console.error("Error uploading file:", error);
                setErrors(prevErrors => ({ ...prevErrors, groupImageUrl: 'Lỗi khi tải lên ảnh bìa' }));
            }
        }
    };


    const handleCreateGroup = async () => {
        const newErrors = {};
        if (!groupName || groupName.length < 10 || groupName.length > 25) {
            newErrors.groupName = 'Tên nhóm phải từ 10-25 ký tự';
        }
        if (!groupDescription) {
            newErrors.groupDescription = 'Vui lòng nhập mô tả nhóm';
        }
        if (!uploadedUrl) {
            newErrors.groupImageUrl = 'Vui lòng tải lên ảnh bìa';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Thông tin nhóm mới
        const newGroup = {
            groupName: groupName,
            description: groupDescription,
            location: groupLocation,
            groupImageUrl: uploadedUrl,
            createAt: new Date().toISOString(), // Lấy ngày hiện tại
        };
        console.log(token);
        try {
            console.log(cleanedToken);
            const apiUrl = import.meta.env.VITE_BASE_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/groups`,
                newGroup,
                {
                    headers: {
                        Authorization: `${token}` // Pass token in the Authorization header
                    }
                }
            );
            console.log('Tạo nhóm mới thành công:', response.data);
            alert('Nhóm mới đã được tạo thành công');
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
            alert('Đã xảy ra lỗi khi tạo nhóm');
        }
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
                        {isGroupRoutebtn ? (
                            <FormSubmit buttonText={'Tạo nhóm'} onButtonClick={handleCreateGroup} title={'Tạo nhóm'} openModalText={'Tạo nhóm'} needAuthorize={true}>
                                <h3>Bảng thông tin</h3>
                                <small>Nhập thông tin chi tiết cho nhóm mới của bạn</small>
                                <Form>
                                    <Form.Group id="groupName" className="mb-3 mt-3">
                                        <Form.Label className='fw-bold'>Tên nhóm</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên nhóm (10-25 ký tự)"
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            isInvalid={!!errors.groupName}
                                        />
                                        <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                            {errors.groupName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group id="groupDescription" className="mb-3">
                                        <Form.Label className='fw-bold'>Mô tả nhóm</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Nhập mô tả nhóm"
                                            value={groupDescription}
                                            onChange={(e) => setGroupDescription(e.target.value)}
                                            isInvalid={!!errors.groupDescription}
                                        />
                                        <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                            {errors.groupDescription}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group id="location" className="mb-3">
                                        <Form.Label className='fw-bold'>Địa điểm</Form.Label>
                                        <Form.Select value={groupLocation} onChange={(e) => setGroupLocation(e.target.value)}>
                                            <option>Chọn địa điểm</option>
                                            <option value="Đà Nẵng">Đà Nẵng</option>
                                            <option value="2">Địa điểm 2</option>
                                            <option value="3">Địa điểm 3</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group id="groupImage" className="mb-3">
                                        <Form.Label>Ảnh bìa nhóm</Form.Label>
                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                type="file"
                                                id="fileInput"
                                                onChange={handleFileSelect}
                                                placeholder={filePlaceholder} // Set placeholder here
                                            />
                                        </div>
                                        {errors.groupImageUrl && (
                                            <div style={{ color: 'red', marginTop: '5px' }}>
                                                {errors.groupImageUrl}
                                            </div>
                                        )}
                                        {uploadedUrl && (
                                            <img
                                                src={uploadedUrl}
                                                alt="Ảnh bìa nhóm"
                                                className="ms-3 mt-3"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Form>
                            </FormSubmit>
                        ) : (
                            <FormSubmit buttonText={'Tạo sự kiện'} title={'Tạo sự kiện'} openModalText={'Tạo sự kiện'} needAuthorize={true}>
                                <h3>Bảng thông tin</h3>
                                <small>Nhập thông tin chi tiết cho sự kiện mới của bạn</small>
                                <Form>
                                    <Form.Group id="eventName" className="mb-3 mt-3">
                                        <Form.Label className='fw-bold'>Tên sự kiện</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên sự kiện" />
                                    </Form.Group>

                                    <Form.Group id="eventDescription" className="mb-3">
                                        <Form.Label className='fw-bold'>Mô tả sự kiện</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả sự kiện" />
                                    </Form.Group>

                                    <Form.Group id="location" className="mb-3">
                                        <Form.Label className='fw-bold'>Địa điểm</Form.Label>
                                        <Form.Select>
                                            <option>Chọn địa điểm</option>
                                            <option value="1">Địa điểm 1</option>
                                            <option value="2">Địa điểm 2</option>
                                            <option value="3">Địa điểm 3</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group id="eventImage" className="mb-3">
                                        <Form.Label>Ảnh đại diện sự kiện</Form.Label>
                                        <Form.Control type="file" id="fileInput" />
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
