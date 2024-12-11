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
import FormModal from '../components/Shared/FormModal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { refreshGroups, viewGroup } from '../redux/actions/groupActions';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';
import FormSubmit from '../components/Shared/FormSubmit';
import ImageSelector from '../components/Shared/ImageSelector';
import useApi from '../hooks/useApi';
import ProvinceSelector from '../components/Shared/ProvinceSelector';
import { generateText } from '../utils/generateTextAI';

function ListLayout({ children }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [filePlaceholder, setFilePlaceholder] = useState("Nhấn vào đây để upload");
    const dispatch = useDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState(null);
    const [locations, setLocations] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { useCreate } = useApi(`${import.meta.env.VITE_BASE_API_URL}/api/groups`, 'createdGroups');
    const { mutate: createGroup, isLoading: isCreatingGroup } = useCreate();
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);

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

    const searchitems = [
        { iconName: 'list-circle', title: 'Người địa phương', route: RoutePath.SEARCH_LIST_LOCAL },
        { iconName: 'list-circle', title: 'Khách du lịch', route: RoutePath.SEARCH_LIST_TRAVELLER },
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

    const isSearchRoute = currentPath === RoutePath.SEARCH_LIST_LOCAL || currentPath === RoutePath.SEARCH_LIST_TRAVELLER;

    const isGroupRoutebtn = currentPath === RoutePath.GROUP || currentPath === RoutePath.GROUP_CREATED || currentPath === RoutePath.GROUP_JOINED;
    const isEventRouteBtn = currentPath === RoutePath.EVENT;

    const sidebarData = isEventRoute ? sidebarItemsEvent : isSearchRoute ? searchitems : sidebarItems;

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

    const handleFileSelect = async (file) => {
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
            } finally {
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

    const selectedGroup = useSelector((state) => state.group.selectedGroup);

    const handleCreateGroup = async () => {
        setIsSubmitting(true);
        const newErrors = {};
        if (!groupName || groupName.length < 10 || groupName.length > 25) {
            newErrors.groupName = 'Tên nhóm phải từ 10-25 ký tự';
        }
        if (!groupDescription) {
            newErrors.groupDescription = 'Vui lòng nhập mô tả nhóm';
        }
        if (!groupLocation) {
            newErrors.groupLocation = 'Vui lòng chọn địa điểm';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(error => toast.error(error));
            setIsSubmitting(false);
            return;
        }

        const newGroup = {
            groupName,
            description: groupDescription,
            location: groupLocation,
            groupImageUrl: uploadedUrl ?? 'https://images.unsplash.com/photo-1725500221821-c4c770db5290?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        };
        console.log(newGroup);

        createGroup(newGroup, {
            onSuccess: (data) => {
                dispatch(viewGroup(data, 'Owner'));
                navigate(RoutePath.GROUP_DETAILS);
                setIsSubmitted(true);
            },
            onError: (error) => {
                console.error('Error creating group:', error.response || error.message);
                toast.error('Đã xảy ra lỗi khi tạo nhóm');
            },
            onSettled: () => {
                setIsSubmitting(false);
            }
        });
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
        if (!eventLocation) {
            newErrors.eventLocation = 'Vui lòng chọn địa điểm';
        }
        if (!startAt) {
            newErrors.startAt = 'Vui lòng chọn thời gian bắt đầu';
        }
        if (!endAt) {
            newErrors.endAt = 'Vui lòng chọn thời gian kết thúc';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(error => toast.error(error));
            return;
        }
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
    const handleDeleteImage = () => {
        setUploadedEventUrl('');
        setEventImage('');
        setShowUploadButton(true); // Hiển thị nút upload khi ảnh bị xóa
    };


    const [showViewImage, setShowViewImage] = useState(false);
    const [imageToView, setImageToView] = useState('');

    const handleView = (imageUrl) => {
        setImageToView(imageUrl);
        setShowViewImage(true);
    };

    const handleCloseView = () => {
        setShowViewImage(false);
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDescription(true);
        const generatedText = await generateText(`Viết một đoạn mô tả dài 40 từ cho nhóm có tên là ${groupName}.`);
        setGroupDescription(generatedText);
        setIsGeneratingDescription(false);
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
                            <InputGroup.Text className="search-icon bg-white search-icon-list rounded-start-5">
                                <ion-icon name="location-outline" style={{ fontSize: '24px' }}></ion-icon>
                            </InputGroup.Text>
                            <FormControl
                                type="search"
                                placeholder="Địa điểm"
                                aria-label="Search"
                                className="searchBar-list rounded-start-0 rounded-end-5 border-start-0"
                            />
                        </InputGroup>
                        {(location.pathname === RoutePath.SEARCH_LIST_LOCAL || location.pathname === RoutePath.SEARCH_LIST_TRAVELLER) && (
                            <Button variant='' className='d-flex align-items-center gap-2 rounded-5 btn-filter'>
                                <ion-icon name="filter-outline" style={{ fontSize: '24px' }}></ion-icon>
                                Lọc
                            </Button>
                        )}
                        {isGroupRoutebtn ? (
                            <>
                                <Button className='rounded-5 d-flex align-items-center gap-2' variant="success" onClick={() => setShowGroupModal(true)}>
                                    Tạo nhóm <ion-icon name="add-circle" style={{
                                        fontSize: '24px',
                                    }}></ion-icon>
                                </Button>
                                <FormModal
                                    show={showGroupModal}
                                    handleClose={() => setShowGroupModal(false)}
                                    title="Tạo nhóm"
                                    saveButtonText="Tạo nhóm"
                                    handleSave={handleCreateGroup}
                                    isSubmitting={isSubmitting}
                                    isSubmitted={isSubmitted}
                                >
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
                                            <TextareaAutosize
                                                minRows={3}
                                                placeholder="Nhập mô tả nhóm"
                                                value={groupDescription}
                                                onChange={(e) => setGroupDescription(e.target.value)}
                                                className={`form-control ${errors.groupDescription ? 'is-invalid' : ''}`}
                                            />
                                            {/* <Button
                                                variant="secondary"
                                                onClick={handleGenerateDescription}
                                                className="mt-2"
                                                disabled={isGeneratingDescription}
                                            >
                                                {isGeneratingDescription ? 'Đang tạo...' : 'Viết mô tả tự động'}
                                            </Button> */}
                                            <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                                {errors.groupDescription}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group id="location" className="mb-3">
                                            {/* <Form.Label className='fw-medium'>Địa điểm</Form.Label> */}
                                            <ProvinceSelector onSelect={(value) => setGroupLocation(value)} />
                                        </Form.Group>
                                        <Form.Group id="groupImage" className="mb-3 d-flex flex-column">
                                            <Form.Label className='fw-medium'>Ảnh bìa nhóm</Form.Label>
                                            <ImageSelector onSelect={handleFileSelect} />
                                            {isUploading ? (
                                                <Placeholder as="div" animation="glow" className="mt-3">
                                                    <Placeholder xs={12} className="upload-placeholder" />
                                                </Placeholder>
                                            ) : (
                                                uploadedUrl && (
                                                    <img
                                                        src={uploadedUrl}
                                                        alt="Ảnh bìa nhóm"
                                                        className="mt-3 upload-image"
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
                                </FormModal>
                            </>
                        ) : (
                            <>
                                <Button className='rounded-5 d-flex align-items-center gap-2' variant="success" onClick={() => setShowEventModal(true)}>
                                    Tạo sự kiện <ion-icon name="add-circle" style={{ fontSize: '24px' }}></ion-icon>
                                </Button>
                                <FormModal
                                    show={showEventModal}
                                    handleClose={() => setShowEventModal(false)}
                                    title="Tạo sự kiện"
                                    saveButtonText="Tạo sự kiện"
                                    handleSave={handleCreateEvent}
                                    isSubmitting={isSubmitting}
                                    isSubmitted={isSubmitted}
                                >
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
                                            <TextareaAutosize
                                                minRows={3}
                                                placeholder="Nhập mô tả sự kiện"
                                                value={eventDescription}
                                                onChange={(e) => setEventDescription(e.target.value)}
                                                className={`form-control ${errors.eventDescription ? 'is-invalid' : ''}`}
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
                                                    <Placeholder xs={12} className="upload-placeholder" />
                                                </Placeholder>
                                            ) : (
                                                uploadedEventUrl && (
                                                    <div className="position-relative mt-3">
                                                        <img
                                                            src={uploadedEventUrl || eventImage}
                                                            alt="Ảnh đại diện sự kiện"
                                                            className="ms-3 mt-3 event-image"
                                                        />
                                                        <ion-icon
                                                            name="eye-outline"
                                                            className="view-icon"
                                                            onClick={() => handleView(uploadedEventUrl || eventImage)}
                                                        ></ion-icon>

                                                        <ion-icon
                                                            name="trash-outline"
                                                            className="delete-icon"
                                                            onClick={handleDeleteImage}
                                                        ></ion-icon>
                                                    </div>
                                                )
                                            )}
                                            {errors.uploadedEventUrl && (
                                                <div style={{ color: 'red', marginTop: '5px' }}>
                                                    {errors.uploadedEventUrl}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Form>
                                </FormModal>
                            </>
                        )}
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
            {showViewImage && (
                <div className="fullscreen-image-container" onClick={handleCloseView}>
                    <img
                        src={imageToView}
                        alt="Ảnh phóng to sự kiện"
                        className="fullscreen-image"
                    />
                </div>
            )}
        </Container>

    );
}

export default ListLayout;
