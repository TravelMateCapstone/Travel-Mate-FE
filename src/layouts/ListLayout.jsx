import React, { useEffect, useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { Col, Container, Row, Offcanvas, Button, InputGroup, FormControl, Form, Placeholder } from 'react-bootstrap';
import Footer from '../components/Shared/Footer';
import SidebarList from '../components/Shared/SidebarList';
import RoutePath from '../routes/RoutePath';
import ProposeGroup from '../components/Group/ProposeGroup';
import ProposeEvent from '../components/Event/ProposeEvent';
import SearchBar from '../components/Shared/SearchBar';
import '../assets/css/layouts/ListLayout.css';
import { useLocation, useNavigate } from 'react-router-dom';
import FormSubmit from '../components/Shared/FormSubmit';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { refreshGroups, viewGroup } from '../redux/actions/groupActions';
import { toast } from 'react-toastify';

function ListLayout({ children }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [filePlaceholder, setFilePlaceholder] = useState("Nhấn vào đây để upload");
    const dispatch = useDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState(null);
    const [locations, setLocations] = useState([]);


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

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p/');
                const locationData = response.data.map((location) => {
                    return {
                        ...location,
                        name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
                    };
                });
                setLocations(locationData);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
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

    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

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
            setFilePlaceholder(file.name);
            setTempImageUrl(URL.createObjectURL(file));
            setIsUploading(true);
            const storageRef = ref(storage, `images/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                setUploadedUrl(url);
                toast.success('Ảnh đã được tải lên thành công');
            } catch (error) {
                setErrors(prevErrors => ({ ...prevErrors, groupImageUrl: 'Lỗi khi tải lên ảnh bìa' }));
                toast.error('Lỗi khi tải lên ảnh bìa');
            }
            finally {
                setIsUploading(false);
            }
        }
    };

    const triggerFileInput = () => {
        document.getElementById('fileInputGroup').click();
    };

    const triggerFileInputEvent = () => {
        document.getElementById('fileInputEvent').click();
    };

    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [uploadedEventUrl, setUploadedEventUrl] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');

    const navigate = useNavigate();

    const handleCreateGroup = async () => {
        const newErrors = {};
        if (!groupName || groupName.length < 10 || groupName.length > 25) {
            newErrors.groupName = 'Tên nhóm phải từ 10-25 ký tự';
        }
        if (!groupDescription) {
            newErrors.groupDescription = 'Vui lòng nhập mô tả nhóm';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const newGroup = {
            groupName,
            description: groupDescription,
            location: groupLocation,
            groupImageUrl: uploadedUrl ?? 'https://images.unsplash.com/photo-1725500221821-c4c770db5290?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            createAt: new Date().toISOString(),
        };
        console.log(token);
        try {
            const apiUrl = import.meta.env.VITE_BASE_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/groups`,
                newGroup,
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );
            dispatch(viewGroup(response.data));
            dispatch(refreshGroups());
            navigate(RoutePath.GROUP_MY_DETAILS, {
                state: { successMessage: 'Nhóm mới đã được tạo thành công', groupData: response.data }
            });

        } catch (error) {
            console.error('Error creating group:', error.response || error.message);
            toast.error('Đã xảy ra lỗi khi tạo nhóm');
        }
    };

    const handleFileSelectForEvent = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFilePlaceholder(file.name);
            setTempImageUrl(URL.createObjectURL(file));
            setIsUploading(true);
            const storageRef = ref(storage, `events/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                setUploadedEventUrl(url);
                toast.success('Ảnh đã được tải lên thành công');
            } catch (error) {
                console.error("Error uploading file:", error);
                setErrors(prevErrors => ({ ...prevErrors, uploadedEventUrl: 'Lỗi khi tải lên ảnh sự kiện' }));
                toast.error('Lỗi khi tải lên ảnh sự kiện');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleCreateEvent = async () => {
        const newErrors = {};

        if (!eventName) {
            newErrors.eventName = 'Vui lòng nhập tên sự kiện';
        }
        if (!eventDescription) {
            newErrors.eventDescription = 'Vui lòng nhập mô tả sự kiện';
        }
        if (!uploadedEventUrl) {
            newErrors.uploadedEventUrl = 'Vui lòng tải lên ảnh đại diện sự kiện';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const newEvent = {
            eventName,
            description: eventDescription,
            eventImageUrl: uploadedEventUrl,
            createAt: new Date().toISOString(),
            startAt: startAt,
            endAt: endAt,
            eventLocation,
        };

        try {
            const apiUrl = import.meta.env.VITE_BASE_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/EventControllerWOO/add-by-current-user`,
                newEvent,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            toast.success('Sự kiện mới đã được tạo thành công');
            localStorage.removeItem('eventData');
            window.location.reload();
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi tạo sự kiện');
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
                        {isGroupRoutebtn && (
                            <FormSubmit buttonText={'Tạo nhóm'} onButtonClick={handleCreateGroup} title={'Tạo nhóm'} openModalText={'Tạo nhóm'} needAuthorize={true}>
                                <h3>Bảng thông tin</h3>
                                <small>Nhập thông tin chi tiết cho nhóm mới của bạn</small>
                                <Form>
                                    <Form.Group id="groupName" className="mb-3 mt-3">
                                        <Form.Label className='fw-medium'>Tên nhóm</Form.Label>
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
                                        <Form.Label className='fw-medium'>Mô tả nhóm</Form.Label>
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
                                        <Form.Label className='fw-medium'>Địa điểm</Form.Label>
                                        <Form.Select value={groupLocation} onChange={(e) => setGroupLocation(e.target.value)}>
                                            <option>Chọn địa điểm</option>
                                            {locations.map((location) => (
                                                <option key={location.code} value={location.name}>
                                                    {location.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group id="groupImage" className="mb-3 d-flex flex-column">
                                        <Form.Label className='fw-medium'>Ảnh bìa nhóm</Form.Label>
                                        <Button variant="outline-primary" onClick={triggerFileInput} className="d-flex rounded-5 gap-1 alignItems-center mb-2 text-black" style={{
                                            width: '30%',
                                            borderStyle: 'dashed',
                                            backgroundColor: '#f2f7ff',
                                        }}>
                                            Nhấn vào đây để <p className='text-primary m-0'>upload</p>
                                        </Button>
                                        <Form.Control
                                            type="file"
                                            id="fileInputGroup"
                                            onChange={handleFileSelect}
                                            className="d-none"
                                        />
                                        {isUploading ? (
                                            <Placeholder as="div" animation="glow" className="mt-3">
                                                <Placeholder xs={12} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
                                            </Placeholder>
                                        ) : (
                                            uploadedUrl && (
                                                <img
                                                    src={uploadedUrl}
                                                    alt="Ảnh bìa nhóm"
                                                    className="mt-3"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                                />
                                            )
                                        )}
                                        {errors.groupImageUrl && (
                                            <div style={{ color: 'red', marginTop: '5px' }}>
                                                {errors.groupImageUrl}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Form>
                            </FormSubmit>
                        )}

                        {isEventRouteBtn && (
                            <FormSubmit buttonText={'Tạo sự kiện'} onButtonClick={handleCreateEvent} title={'Tạo sự kiện'} openModalText={'Tạo sự kiện'} needAuthorize={true}>
                                <h3>Bảng thông tin</h3>
                                <small>Nhập thông tin chi tiết cho sự kiện mới của bạn</small>
                                <Form>
                                    <Form.Group id="eventName" className="mb-3 mt-3">
                                        <Form.Label className='fw-bold'>Tên sự kiện</Form.Label>
                                        <Form.Control
                                            className='form-input'
                                            type="text"
                                            placeholder="Nhập tên sự kiện"
                                            value={eventName}
                                            onChange={(e) => setEventName(e.target.value)}
                                            isInvalid={!!errors.eventName}
                                        />
                                        <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                            {errors.eventName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group id="eventDescription" className="mb-3">
                                        <Form.Label className='fw-bold'>Mô tả sự kiện</Form.Label>
                                        <Form.Control
                                            className='form-input input-des'
                                            as="textarea"
                                            rows={3}
                                            placeholder="Nhập mô tả sự kiện"
                                            value={eventDescription}
                                            onChange={(e) => setEventDescription(e.target.value)}
                                            isInvalid={!!errors.eventDescription}
                                        />
                                        <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                            {errors.eventDescription}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <div className='time-event d-flex align-items-center'>
                                        <Form.Group id="startAt" className="mb-3 mt-3">
                                            <Form.Label className='fw-bold'>Thời gian bắt đầu</Form.Label>
                                            <Form.Control
                                                className='form-input'
                                                required
                                                type="datetime-local"
                                                value={startAt}
                                                onChange={(e) => setStartAt(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group id="endAt" className="mb-3 mt-3">
                                            <Form.Label className='fw-bold'>Thời gian kết thúc</Form.Label>
                                            <Form.Control
                                                className='form-input'
                                                required
                                                type="datetime-local"
                                                value={endAt}
                                                onChange={(e) => setEndAt(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>

                                    <Form.Group id="location" className="mb-3">
                                        <Form.Label className='fw-bold'>Địa điểm</Form.Label>
                                        <Form.Select
                                            className='form-input'
                                            value={eventLocation}
                                            onChange={(e) => setEventLocation(e.target.value)}
                                        >
                                            <option>Chọn địa điểm</option>
                                            {locations.map((location) => (
                                                <option key={location.code} value={location.name}>
                                                    {location.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group id="eventImage" className="mb-3">
                                        <Form.Label>Ảnh sự kiện</Form.Label>
                                        <Button onClick={triggerFileInputEvent} className="w-100 mb-2 upload-img">
                                            Nhấn vào đây để <sapn className="upload">upload</sapn>
                                        </Button>
                                        <Form.Control
                                            type="file"
                                            id="fileInputEvent"
                                            onChange={handleFileSelectForEvent}
                                            className="d-none"
                                        />
                                        {isUploading ? (
                                            <Placeholder as="div" animation="glow" className="mt-3">
                                                <Placeholder xs={12} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
                                            </Placeholder>
                                        ) : (
                                            uploadedEventUrl && (
                                                <img
                                                    src={uploadedEventUrl}
                                                    alt="Ảnh đại diện sự kiện"
                                                    className="ms-3 mt-3"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                                />
                                            )
                                        )}
                                        {errors.uploadedEventUrl && (
                                            <div style={{ color: 'red', marginTop: '5px' }}>
                                                {errors.uploadedEventUrl}
                                            </div>
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
                    <Container className='container-list d-none d-md-flex mb-4'>
                        <div className='search-list-container'><SearchBar /></div>
                        <InputGroup className='search-list-container location-container'>
                            <InputGroup.Text className="search-icon bg-white search-icon-list rounded-start-5" style={{
                                border: '1px solid black'
                            }}>
                                <ion-icon name="location-outline" style={{
                                    fontSize: '24px',
                                }}></ion-icon>
                            </InputGroup.Text>
                            <FormControl
                                type="search"
                                placeholder="Địa điểm"
                                aria-label="Search"
                                className="searchBar-list rounded-start-0 rounded-end-5 border-start-0"
                            />
                        </InputGroup>
                        <Button variant='outline-dark' className='d-flex align-items-center gap-2 rounded-5 btn-filter'>
                            <ion-icon name="filter-outline" style={{
                                fontSize: '24px',
                            }}></ion-icon>
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
