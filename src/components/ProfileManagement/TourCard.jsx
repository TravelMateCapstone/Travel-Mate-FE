import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Form, Row, Col, Tabs, Tab, Card, Accordion, Table } from 'react-bootstrap';
import RoutePath from '../../routes/RoutePath';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextareaAutosize from 'react-textarea-autosize';
import Switch from '../Shared/Switch';
import ConfirmModal from '../Shared/ConfirmModal';
Modal.setAppElement('#root');

// eslint-disable-next-line react/prop-types
function TourCard({ tour, onTourUpdated, approvalStatus }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [costDetails, setCostDetails] = useState([]);
    const [managementModalIsOpen, setManagementModalIsOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [locations, setLocations] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [tourToDelete, setTourToDelete] = useState(null);
    // const userProfile = useSelector((state) => state.profile);

    const [tourDetails, setTourDetails] = useState({
        tourName: '',
        price: 0,
        startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        numberOfDays: 0,
        numberOfNights: 0,
        tourDescription: '',
        location: '',
        maxGuests: 0,
        tourImage: '',
        additionalInfo: '',
    });
    // const [key, setKey] = useState('schedule');
    const [isGlobalContract, setIsGlobalContract] = useState(true);
    const [filter, setFilter] = useState('paid');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://travelmateapp.azurewebsites.net/api/UserLocationsWOO/get-current-user', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                });
                setLocations(response.data.$values || []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu địa điểm:', error);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        // Tính tổng giá trị của các hoạt động
        const totalActivityCost = activities.reduce((activitySum, activity) => {
            const activityDayCost = activity.activities.reduce(
                (daySum, act) => daySum + parseFloat(act.activityAmount || 0),
                0
            );
            return activitySum + activityDayCost;
        }, 0);

        const totalCostDetail = costDetails.reduce(
            (costSum, cost) => costSum + parseFloat(cost.amount || 0),
            0
        );

        setTourDetails((prevDetails) => ({
            ...prevDetails,
            price: totalActivityCost + totalCostDetail,
        }));
    }, [activities, costDetails]);


    const handleOpenManagementModal = async () => {
        try {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/tourParticipants/${tour.tourId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setParticipants(response.data.$values);
        } catch (error) {
            console.error("There was an error fetching the participants!", error);
        }
        setManagementModalIsOpen(true);
    }
    const handleCloseManagementModal = () => {
        setManagementModalIsOpen(false);
    }

    useEffect(() => {
        if (tourDetails.startDate && tourDetails.endDate) {
            const start = new Date(tourDetails.startDate);
            const end = new Date(tourDetails.endDate);
            const numberOfDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const numberOfNights = numberOfDays - 1;

            setTourDetails((prevDetails) => ({
                ...prevDetails,
                numberOfDays,
                numberOfNights,
            }));

            // Cập nhật lại lịch trình
            setActivities((prevActivities) => {
                const updatedActivities = [];
                for (let i = 0; i < numberOfDays; i++) {
                    const currentDay = addDays(start, i);
                    const existingDay = prevActivities.find((act) =>
                        new Date(act.date).toDateString() === currentDay.toDateString()
                    );

                    if (existingDay) {
                        // Giữ lại ngày cũ nếu đã tồn tại
                        updatedActivities.push(existingDay);
                    } else {
                        // Thêm ngày mới nếu chưa tồn tại
                        updatedActivities.push({
                            day: i + 1,
                            date: format(currentDay, "yyyy-MM-dd'T'HH:mm", { locale: vi }),
                            activities: [],
                        });
                    }
                }
                return updatedActivities;
            });
        }
    }, [tourDetails.startDate, tourDetails.endDate]);



    const openModal = async () => {

        try {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/${tour.tourId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            const tourData = response.data;
            setTourDetails({
                tourName: tourData.tourName,
                price: tourData.price,
                startDate: format(new Date(tourData.startDate), "yyyy-MM-dd'T'HH:mm", { locale: vi }),
                endDate: format(new Date(tourData.endDate), "yyyy-MM-dd'T'HH:mm", { locale: vi }),
                numberOfDays: tourData.numberOfDays,
                numberOfNights: tourData.numberOfNights,
                tourDescription: tourData.tourDescription,
                location: tourData.location,
                maxGuests: tourData.maxGuests,
                tourImage: tourData.tourImage,
                additionalInfo: tourData.additionalInfo,
            });
            setActivities(tourData.itinerary.$values.map((item) => ({
                day: item.day,
                date: format(new Date(item.date), "yyyy-MM-dd'T'HH:mm", { locale: vi }),
                activities: item.activities.$values.map(act => ({
                    startTime: act.startTime,
                    endTime: act.endTime,
                    title: act.title,
                    note: act.note,
                    description: act.description,
                    activityAddress: act.activityAddress,
                    activityAmount: act.activityAmount,
                    activityImage: act.activityImage,
                })),
            })));
            setCostDetails(tourData.costDetails.$values.map(cost => ({
                title: cost.title,
                amount: cost.amount,
                notes: cost.notes,
            })));
            setModalIsOpen(true);
        } catch (error) {
            console.error("There was an error fetching the tour data!", error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSwitchToggle = (isOn) => {
        setIsGlobalContract(isOn);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://travelmateapp.azurewebsites.net/api/Tour/${tourToDelete}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            toast.success('Xóa tour thành công !');
            setShowConfirmModal(false);
            onTourUpdated();
        } catch (error) {
            console.error("There was an error deleting the tour!", error);
        }
    };

    const confirmDelete = (tourId) => {
        setTourToDelete(tourId);
        setShowConfirmModal(true);
    };

    const handleView = (tourId) => {
        dispatch(fetchTour(tourId, token));
        navigate(RoutePath.TOUR_DETAIL);
    };

    const addActivity = (dayIndex) => {
        const updatedActivities = [...activities];
        updatedActivities[dayIndex].activities.push({
            startTime: '',
            endTime: '',
            title: '',
            note: '',
            description: '',
            activityAddress: '',
            activityAmount: 0,
            activityImage: '',
        });
        setActivities(updatedActivities);
    };

    const addCostDetail = () => {
        setCostDetails([
            ...costDetails,
            {
                title: '',
                amount: 0,
                notes: '',
            },
        ]);
    };

    const removeActivity = (dayIndex, actIndex) => {
        const updatedActivities = [...activities];
        updatedActivities[dayIndex].activities.splice(actIndex, 1);
        setActivities(updatedActivities);
    };

    const removeCostDetail = (index) => {
        const updatedCostDetails = [...costDetails];
        updatedCostDetails.splice(index, 1);
        setCostDetails(updatedCostDetails);
    };

    const updateActivity = (dayIndex, actIndex, field, value) => {
        setActivities((prevActivities) => {
            const updatedActivities = [...prevActivities];
            updatedActivities[dayIndex] = {
                ...updatedActivities[dayIndex],
                activities: [...updatedActivities[dayIndex].activities],
            };
            updatedActivities[dayIndex].activities[actIndex] = {
                ...updatedActivities[dayIndex].activities[actIndex],
                [field]: value,
            };

            const newActivity = updatedActivities[dayIndex].activities[actIndex];
            if (field === 'startTime' || field === 'endTime') {
                const overlapActivity = getOverlapActivity(updatedActivities, dayIndex, newActivity, actIndex);
                if (overlapActivity) {
                    toast.error(`Thời gian chỉnh sửa bị trùng lặp với hoạt động: ${overlapActivity.title}`);
                    return prevActivities; // Không cập nhật nếu trùng lặp
                }
            }

            return updatedActivities;
        });
    };

    const getOverlapActivity = (activities, dayIndex, newActivity, actIndex = -1) => {
        const { startTime, endTime } = newActivity;
        for (let i = 0; i < activities[dayIndex].activities.length; i++) {
            if (i === actIndex) continue; // Bỏ qua chính hoạt động đang chỉnh sửa
            const act = activities[dayIndex].activities[i];
            if (
                (startTime >= act.startTime && startTime < act.endTime) || // Trùng trong khoảng
                (endTime > act.startTime && endTime <= act.endTime) || // Trùng cuối
                (startTime <= act.startTime && endTime >= act.endTime) // Bao trùm cả hoạt động khác
            ) {
                return act;
            }
        }
        return null;
    };


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `tourImages/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setTourDetails({ ...tourDetails, tourImage: downloadURL });
        }
    };

    const handleActivityImageUpload = async (event, dayIndex, actIndex) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `activityImages/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            updateActivity(dayIndex, actIndex, 'activityImage', downloadURL);
        }
    };

    const validateFields = () => {
        const errors = [];
        if (!tourDetails.tourName.trim()) errors.push('Tên tour không được để trống.');
        if (!tourDetails.startDate.trim()) errors.push('Ngày bắt đầu không được để trống.');
        if (!tourDetails.endDate.trim()) errors.push('Ngày kết thúc không được để trống.');
        if (!tourDetails.location.trim()) errors.push('Địa điểm không được để trống.');
        if (!tourDetails.maxGuests || tourDetails.maxGuests <= 0) errors.push('Số lượng khách tối đa phải lớn hơn 0.');
        if (!tourDetails.tourDescription.trim()) errors.push('Mô tả tour không được để trống.');
        if (!tourDetails.tourImage) errors.push('Ảnh tour không được để trống.');
        if (activities.length === 0) {
            errors.push('Lịch trình không được để trống.');
        } else {
            activities.forEach((activity, dayIndex) => {
                if (activity.activities.length === 0) {
                    errors.push(`Hoạt động cho ngày ${dayIndex + 1} không được để trống.`);
                }
            });
        }
        return errors;
    };

    // const isTimeOverlap = (activities, dayIndex, newActivity, actIndex = -1) => {
    //     const { startTime, endTime } = newActivity;
    //     for (let i = 0; i < activities[dayIndex].activities.length; i++) {
    //         if (i === actIndex) continue; // Bỏ qua chính hoạt động đang chỉnh sửa
    //         const act = activities[dayIndex].activities[i];
    //         if (
    //             (startTime >= act.startTime && startTime < act.endTime) || // Trùng trong khoảng
    //             (endTime > act.startTime && endTime <= act.endTime) || // Trùng cuối
    //             (startTime <= act.startTime && endTime >= act.endTime) // Bao trùm cả hoạt động khác
    //         ) {
    //             return true;
    //         }
    //     }
    //     return false;
    // };


    const validateActivityFields = (activity) => {
        const errors = [];
        if (!activity.title.trim()) errors.push('Tên hoạt động không được để trống.');
        if (!activity.startTime.trim()) errors.push('Thời gian bắt đầu không được để trống.');
        if (!activity.endTime.trim()) errors.push('Thời gian kết thúc không được để trống.');
        if (!activity.activityAddress.trim()) errors.push('Địa chỉ không được để trống.');
        if (!activity.note.trim()) errors.push('Ghi chú không được để trống.');
        if (!activity.description.trim()) errors.push('Mô tả không được để trống.');
        return errors;
    };

    const validateCostDetailFields = (costDetail) => {
        const errors = [];
        if (!costDetail.title.trim()) errors.push('Tiêu đề không được để trống.');
        if (!costDetail.amount) errors.push('Số tiền không được để trống.');
        if (!costDetail.notes.trim()) errors.push('Ghi chú không được để trống.');
        return errors;
    };

    const handleSaveChanges = async (tourId) => {
        const errors = validateFields();
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return;
        }

        if (new Date(tourDetails.startDate) >= new Date(tourDetails.endDate)) {
            toast.error('Ngày bắt đầu phải trước ngày kết thúc.');
            return;
        }

        for (const activity of activities) {
            for (const act of activity.activities) {
                const activityErrors = validateActivityFields(act);
                if (activityErrors.length > 0) {
                    activityErrors.forEach((error) => toast.error(error));
                    return;
                }
                if (act.startTime >= act.endTime) {
                    toast.error('Thời gian bắt đầu phải trước thời gian kết thúc.');
                    return;
                }
            }
        }

        for (const costDetail of costDetails) {
            const costDetailErrors = validateCostDetailFields(costDetail);
            if (costDetailErrors.length > 0) {
                costDetailErrors.forEach((error) => toast.error(error));
                return;
            }
        }

        // Upload tour image to Firebase if it exists
        let tourImageUrl = tourDetails.tourImage;
        if (tourDetails.tourImage && tourDetails.tourImage.startsWith('blob:')) {
            const tourImageFile = await fetch(tourDetails.tourImage).then(r => r.blob());
            const tourImageRef = ref(storage, `tourImages/${tourImageFile.name}`);
            await uploadBytes(tourImageRef, tourImageFile);
            tourImageUrl = await getDownloadURL(tourImageRef);
        }

        // Upload activity images to Firebase if they exist
        const updatedActivities = await Promise.all(activities.map(async (activity) => {
            const updatedActivityImages = await Promise.all(activity.activities.map(async (act) => {
                if (act.activityImage && act.activityImage.startsWith('blob:')) {
                    const activityImageFile = await fetch(act.activityImage).then(r => r.blob());
                    const activityImageRef = ref(storage, `activityImages/${activityImageFile.name}`);
                    await uploadBytes(activityImageRef, activityImageFile);
                    const activityImageUrl = await getDownloadURL(activityImageRef);
                    return { ...act, activityImage: activityImageUrl };
                }
                return act;
            }));
            return { ...activity, activities: updatedActivityImages };
        }));

        const tourData = {
            tourName: tourDetails.tourName,
            price: parseFloat(tourDetails.price),
            isGlobalContract: isGlobalContract,
            startDate: new Date(tourDetails.startDate).toISOString(),
            endDate: new Date(tourDetails.endDate).toISOString(),
            numberOfDays: parseInt(tourDetails.numberOfDays),
            numberOfNights: parseInt(tourDetails.numberOfNights),
            tourDescription: tourDetails.tourDescription,
            location: tourDetails.location,
            maxGuests: parseInt(tourDetails.maxGuests),
            tourImage: tourImageUrl,
            itinerary: updatedActivities.map(activity => ({
                day: activity.day,
                date: new Date(activity.date),
                activities: activity.activities.map(act => ({
                    startTime: act.startTime,
                    endTime: act.endTime,
                    title: act.title,
                    note: act.note,
                    description: act.description,
                    activityAddress: act.activityAddress,
                    activityAmount: act.activityAmount,
                    activityImage: act.activityImage,
                })),
            })),
            costDetails: costDetails.map(cost => ({
                title: cost.title,
                amount: cost.amount,
                notes: cost.notes,
            })),
            additionalInfo: tourDetails.additionalInfo,
        };
        try {
            await axios.put(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`, tourData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });
            toast.success('Cập nhật tour thành công !');
            closeModal();
            onTourUpdated(); // Call the prop function to update the tour list
        } catch (error) {
            console.error('Error updating tour:', error);
            toast.error('An error occurred. Please try again.');
        }
    };
    const filteredParticipants = participants.filter(participant => {
        const matchesFilter = filter === 'paid' ? participant.paymentStatus : !participant.paymentStatus;
        const matchesSearch = participant.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    const totalIncome = participants.reduce((sum, participant) => sum + (participant.totalAmount || 0), 0);
    const iconColor = approvalStatus === 1 ? 'green' : 'red';
    return (
        <div className="tour-card d-flex justify-content-between mb-3 rounded-3" style={{
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',

        }}>
            <div className="tour-card-header d-flex gap-3">
                <img src={tour.tourImage} alt="" width={274} height={174} className='rounded-3' />
                <div className='d-flex flex-column my-3 gap-2'>
                    <div className='d-flex gap-2'>
                        <h5 className='m-0 fw-medium'>{tour.tourName}</h5>
                        <small style={{
                            display: 'block',
                            marginTop: '0',
                        }}>
                            <ion-icon style={{ color: iconColor }} name="checkmark-circle-outline"></ion-icon>
                        </small>

                        
                    </div>
                    <p className='m-0 fw-medium'>{tour.location}</p>
                    <p className='m-0 fw-medium'>{tour.numberOfDays}N{tour.numberOfNights}Đ</p>
                    <div className='d-flex gap-2'>
                        <p className='fw-medium'>Ngày khời hành</p>
                        <Button variant='outline-success'>
                            04/01
                        </Button>
                        <Button variant='outline-success'>
                            04/01
                        </Button>
                        <Button variant='outline-success'>
                            04/01
                        </Button>
                        <Button variant='outline-success'>
                            04/01
                        </Button>
                    </div>
                </div>
            </div>
            <div className="tour-card-body d-flex gap-4">
                <div className="tour-card-info d-flex align-items-end">
                    <p className='fw-medium text-success'>
                        {(tour.price).toLocaleString('vi-VN')} VNĐ
                    </p>
                </div>
                <div className="tour-card-actions d-flex align-items-center">
                    <Dropdown>
                        <Dropdown.Toggle variant="" style={{
                            border: '1px solid #ddd',
                            height: '174px',
                            width: '60px',
                        }}>
                            <ion-icon name="settings-outline" style={{ textAlign: 'center', verticalAlign: 'middle', }}></ion-icon>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleView(tour.tourId)}>Xem thêm</Dropdown.Item>
                            <Dropdown.Item onClick={openModal}>Chỉnh sửa</Dropdown.Item>
                            <Dropdown.Item onClick={handleOpenManagementModal}>Quản lý</Dropdown.Item>
                            <Dropdown.Item onClick={() => confirmDelete(tour.tourId)}>Xóa</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {/* Update tour */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Tour Modal"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '75%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <h2>Cập nhật tour</h2>
                <Row className="mb-4" style={{ flex: 1 }}>
                    <Col lg={12}>
                        <Row>
                            <Col lg={8}>
                                <Form>
                                    <Form.Group className="mb-3 form-group-custom-create-tour">
                                        <Form.Label>Tên Tour</Form.Label>
                                        <Form.Control type="text" value={tourDetails.tourName} onChange={(e) => setTourDetails({ ...tourDetails, tourName: e.target.value })} />
                                    </Form.Group>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3 form-group-custom-create-tour">
                                                <Form.Label>Ngày Bắt Đầu</Form.Label>
                                                <Form.Control type="datetime-local" value={tourDetails.startDate} onChange={(e) => setTourDetails({ ...tourDetails, startDate: e.target.value })} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3 form-group-custom-create-tour">
                                                <Form.Label>Ngày Kết Thúc</Form.Label>
                                                <Form.Control type="datetime-local" value={tourDetails.endDate} onChange={(e) => setTourDetails({ ...tourDetails, endDate: e.target.value })} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3 d-none">
                                        <Form.Label>Số Ngày</Form.Label>
                                        <Form.Control type="number" value={tourDetails.numberOfDays} onChange={(e) => setTourDetails({ ...tourDetails, numberOfDays: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-none">
                                        <Form.Label>Số Đêm</Form.Label>
                                        <Form.Control type="number" value={tourDetails.numberOfNights} onChange={(e) => setTourDetails({ ...tourDetails, numberOfNights: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3 form-group-custom-create-tour">
                                        <Form.Label style={{
                                            marginRight: '25px',
                                        }}>Chọn địa điểm</Form.Label>
                                        {locations.length == 0 ? (
                                            <Link className='btn btn-primary' to="https://travelmatefe.netlify.app/profile/my-profile">
                                                Cập nhật địa phương đăng kí
                                            </Link>
                                        ) : (
                                            <Form.Select
                                                aria-label="Chọn địa điểm"
                                                value={tourDetails.location}
                                                onChange={(e) => {
                                                    setTourDetails({ ...tourDetails, location: e.target.value })
                                                }}
                                            >

                                                {locations.map((location) => (
                                                    <option key={location.locationId} value={location.location.locationName}>
                                                        {location.location.locationName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3 form-group-custom-create-tour">
                                        <Form.Label>Số Khách Tối Đa</Form.Label>
                                        <Form.Control type="number" value={tourDetails.maxGuests} onChange={(e) => setTourDetails({ ...tourDetails, maxGuests: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3 form-group-custom-create-tour">
                                        <Form.Label>Chữ ký cho toàn bộ</Form.Label>
                                        <Switch isOn={isGlobalContract} handleToggle={handleSwitchToggle} />
                                    </Form.Group>
                                    <Form.Group className="mb-3 form-group-custom-create-tour align-items-start">
                                        <Form.Label>Mô Tả Tour</Form.Label>
                                        <TextareaAutosize
                                            minRows={3}
                                            value={tourDetails.tourDescription}
                                            onChange={(e) => setTourDetails({ ...tourDetails, tourDescription: e.target.value })}
                                            className="form-control"
                                        />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3 form-group-custom-create-tour">
                                    <Form.Control
                                        className='d-none'
                                        id='uploadImgTour'
                                        type="file"
                                        onChange={handleImageUpload} />
                                </Form.Group>
                                <Button className='my-2 w-100' onClick={() => document.getElementById('uploadImgTour').click()}>
                                    Tải lên ảnh tour
                                </Button>
                                {tourDetails.tourImage && (
                                    <img
                                        src={tourDetails.tourImage}
                                        alt="Tour"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            padding: '5px'
                                        }}
                                    />
                                )}
                                <h4 className='text-success mt-2'>{tourDetails.price.toLocaleString('vi-VN')} VNĐ</h4>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={12}>
                        <Tabs defaultActiveKey="schedule" id="controlled-tab-example" className="mb-3 no-border-radius">
                            <Tab eventKey="schedule" title="Lịch trình">
                                <div>
                                    <div>
                                        <Accordion defaultActiveKey="0">
                                            {activities.map((activity, dayIndex) => (
                                                <Accordion.Item eventKey={dayIndex.toString()} key={dayIndex}>
                                                    <Accordion.Header>Ngày {activity.day}: {format(new Date(activity.date), 'dd/MM/yyyy')}</Accordion.Header>
                                                    <Accordion.Body>

                                                        {activity.activities.map((act, actIndex) => (
                                                            <div key={actIndex} className="ml-4 mt-3">
                                                                <Row>
                                                                    <Col lg={8}>
                                                                        <div className='d-flex align-items-center'>
                                                                            <Col lg={6} className='px-0' >
                                                                                <Form.Group className="mb-3" style={{ marginRight: '5px' }}>
                                                                                    <Form.Label>Tiêu Đề</Form.Label>
                                                                                    <Form.Control type="text" value={act.title} onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={6} className='px-0' >
                                                                                <Form.Group className="mb-3" style={{ marginRight: '5px' }}>
                                                                                    <Form.Label>Địa Chỉ</Form.Label>
                                                                                    <Form.Control type="text" value={act.activityAddress} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAddress', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <Col lg={6} className='px-0' >
                                                                                <Form.Group className="mb-3" style={{ marginRight: '5px' }}>
                                                                                    <Form.Label>Thời Gian Bắt Đầu</Form.Label>
                                                                                    <Form.Control type="time" step="1" value={act.startTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'startTime', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={6} className='px-0'>
                                                                                <Form.Group className="mb-3" style={{ marginRight: '5px' }}>
                                                                                    <Form.Label>Thời Gian Kết Thúc</Form.Label>
                                                                                    <Form.Control type="time" step="1" value={act.endTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'endTime', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </div>

                                                                        <div className="d-flex align-items-center">
                                                                            <Col lg={6} className="px-0">
                                                                                <Form.Group className="mb-3" style={{ marginRight: '5px' }}>
                                                                                    <Form.Label>Ghi Chú</Form.Label>
                                                                                    <TextareaAutosize
                                                                                        minRows={5}
                                                                                        className='form-control'
                                                                                        value={act.note}
                                                                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'note', e.target.value)}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={6} className="px-0">
                                                                                <Form.Group className="mb-3" style={{ marginRight: '5px' }}>
                                                                                    <Form.Label>Mô Tả</Form.Label>
                                                                                    <TextareaAutosize
                                                                                        minRows={5}
                                                                                        className='form-control'
                                                                                        value={act.description}
                                                                                        onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </div>

                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label>Số Tiền</Form.Label>
                                                                            <Form.Control type="number" value={act.activityAmount} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAmount', e.target.value)} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label className="fw-bold">Tải lên hình ảnh</Form.Label>
                                                                            <Form.Control
                                                                                className='d-none'
                                                                                id={`uploadImgActivity-${dayIndex}-${actIndex}`}
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => handleActivityImageUpload(e, dayIndex, actIndex)}
                                                                            />

                                                                            <Button className='my-2 w-100' onClick={() => document.getElementById(`uploadImgActivity-${dayIndex}-${actIndex}`).click()}>
                                                                                Tải lên ảnh hoạt động
                                                                            </Button>
                                                                        </Form.Group>

                                                                        {/* Hiển thị hình ảnh nếu có */}
                                                                        {act.activityImage && (
                                                                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                                                                <img
                                                                                    src={act.activityImage}
                                                                                    alt="Hoạt động"
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        height: 'auto',
                                                                                        border: '1px solid #ddd',
                                                                                        borderRadius: '5px',
                                                                                        padding: '5px'
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {/* Nút xóa hoạt động */}
                                                                        <Button
                                                                            variant="danger"
                                                                            style={{ marginTop: '10px' }}
                                                                            onClick={() => removeActivity(dayIndex, actIndex)}
                                                                        >
                                                                            Xóa hoạt động
                                                                        </Button>
                                                                    </Col>

                                                                </Row>
                                                                <hr style={{ height: '5px', backgroundColor: 'black', border: 'none' }} />
                                                            </div>
                                                        ))}
                                                        <Button variant="primary" className='my-3 mx-5' onClick={() => addActivity(dayIndex)}>Thêm hoạt động</Button>

                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="cost" title="Chi phí">
                                <div style={{
                                    width: '100%',
                                    height: 'auto',
                                    border: '1px solid #ddd',
                                    backgroundColor: 'white',
                                    borderRadius: '5px',
                                    padding: '5px'
                                }}>
                                    <Card.Body className='m-4'>
                                        <Card.Title className='my-2'>Chi phí chi tiết</Card.Title>
                                        {costDetails.map((costDetail, index) => (
                                            <div key={index} className="mb-3">
                                                <Row>
                                                    <Col lg={10}>

                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Tiêu Đề</Form.Label>
                                                            <Form.Control type="text" value={costDetail.title} onChange={(e) => {
                                                                const updatedCostDetails = [...costDetails];
                                                                updatedCostDetails[index].title = e.target.value;
                                                                setCostDetails(updatedCostDetails);
                                                            }} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={2}>

                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Số Tiền</Form.Label>
                                                            <Form.Control type="number" value={costDetail.amount} onChange={(e) => {
                                                                const updatedCostDetails = [...costDetails];
                                                                updatedCostDetails[index].amount = e.target.value;
                                                                setCostDetails(updatedCostDetails);
                                                            }} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={10}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Ghi Chú</Form.Label>
                                                            <TextareaAutosize
                                                                minRows={3}
                                                                className='form-control'
                                                                value={costDetail.notes}
                                                                onChange={(e) => {
                                                                    const updatedCostDetails = [...costDetails];
                                                                    updatedCostDetails[index].notes = e.target.value;
                                                                    setCostDetails(updatedCostDetails);
                                                                }} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <Button
                                                            variant="outline-danger"
                                                            // className='d-flex align-items-center '
                                                            onClick={() => removeCostDetail(index)}
                                                            style={{ marginTop: '60px' }}
                                                        ><ion-icon name="trash-outline"></ion-icon> Loại bỏ chi phí</Button>
                                                    </Col>
                                                </Row>
                                                <hr style={{ height: '5px', backgroundColor: 'black', border: 'none' }} />
                                            </div>
                                        ))}
                                        <Button className='d-flex align-items-center gap-2' variant="outline-primary" onClick={addCostDetail}> <ion-icon name="add-circle-outline"></ion-icon>Thêm chi phí</Button>
                                    </Card.Body>
                                </div>
                            </Tab>
                            <Tab eventKey="regulation" title="Quy định">
                                <Card>
                                    <Card.Body>
                                        <Form.Group className="mb-3" style={{
                                            height: '600px',
                                        }}>
                                            <ReactQuill style={{
                                                height: '95%',
                                            }} value={tourDetails.additionalInfo} onChange={(value) => setTourDetails({ ...tourDetails, additionalInfo: value })} />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end gap-3">
                    <Button variant="secondary" onClick={closeModal}>Đóng</Button>
                    <Button variant="success" onClick={() => handleSaveChanges(tour.tourId)}>Lưu thay đổi</Button>
                </div>
            </Modal>
            {/* Tour Management */}
            <Modal isOpen={managementModalIsOpen}
                onRequestClose={handleCloseManagementModal}
                contentLabel="Update Tour Modal"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '75%',
                        height: '800px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >

                <h4>Quản lý tour</h4>
                <div className='h-100'>
                    <Row style={{
                        borderBottom: '1px solid black',
                        paddingBottom: '20px',
                    }}>
                        <Col lg={6}>
                            <div>
                                <div className='d-flex gap-2 align-items-center'>
                                    <p className='m-0'>{tour.tourName}</p>
                                </div>
                                <div className='d-flex gap-2 align-items-center'>
                                    <ion-icon name="time-outline"></ion-icon>
                                    <p className='m-0'>{tour.numberOfDays}N{tour.numberOfNights}Đ</p>
                                </div>
                                <div className='d-flex gap-2 align-items-center'>
                                    <ion-icon name="people-outline"></ion-icon>
                                    <p className='m-0'> {participants.length}/{tour.maxGuests}</p>
                                </div>
                                {/* <div className='d-flex gap-2 align-items-center'>
    
                                    <p className='m-0'>{format(new Date(tour.startDate), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                                </div>
                                <div className='d-flex gap-2 align-items-center'>
                                    <p className='m-0'>{format(new Date(tour.endDate), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                                </div> */}

                                <div className='d-flex gap-2 align-items-center'>
                                    <ion-icon name="location-outline"></ion-icon>
                                    <p className='m-0'>{tour.location}</p>
                                </div>

                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="d-flex gap-5">
                                {/* Tổng thu nhập */}
                                <div
                                    className="p-3 border-1"
                                    style={{
                                        borderRadius: '20px',
                                        backgroundColor: '#DCFAED',
                                        border: '1px solid #DCFAED'
                                    }}
                                >
                                    <h5>Tổng thu nhập tour</h5>
                                    <p style={{ fontSize: '24px', color: '#0EAD69', }}>{totalIncome.toLocaleString('vi-VN')} VNĐ</p>
                                </div>

                                <div
                                    className="gap-3 p-3 border-1"
                                    style={{
                                        borderRadius: '20px',
                                        border: '1px solid #ccc'
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <ion-icon
                                            name="person-outline"
                                            style={{
                                                marginBottom: '8px',
                                                marginRight: '8px'
                                            }}
                                        ></ion-icon>
                                        <h5>Tổng thu nhập chuyển</h5>
                                    </div>
                                    <h5 style={{ fontSize: '24px' }}>{participants.length}/{tour.maxGuests}</h5>
                                </div>
                            </div>
                        </Col>

                    </Row>
                    <Row>
                        <h3 className='my-2'>Danh sách người tham gia</h3>
                        <div className='d-flex justify-content-between my-4'>
                            <Form.Control type='text' className='w-25' placeholder='Tìm kiếm người tham gia' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <div className='py-2 px-2 rounded-5' style={{
                                backgroundColor: '#d9d9d9',
                            }}>
                                <Button
                                    className="rounded-5 border-0 mx-1"
                                    onClick={() => setFilter('paid')}
                                    style={{
                                        backgroundColor: filter === 'paid' ? 'white' : '#d9d9d9',
                                        color: filter === 'paid' ? 'black' : 'black'
                                    }}
                                >
                                    Đã thanh toán
                                </Button>
                                {/* Nút Chưa thanh toán */}
                                <Button
                                    className="rounded-5 border-0 mx-1"
                                    onClick={() => setFilter('unpaid')}
                                    style={{
                                        backgroundColor: filter === 'unpaid' ? 'white' : '#d9d9d9',
                                        color: filter === 'unpaid' ? 'black' : 'black'
                                    }}
                                >
                                    Chưa thanh toán
                                </Button>
                            </div>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <td>Thời gian đăng kí</td>
                                    <td>Người dùng</td>
                                    <td>Giới tính</td>
                                    <td>Địa chỉ</td>
                                    <td>Điện thoại</td>
                                    <td>Trạng thái</td>
                                    <td>Số tiền</td>
                                    <td>Hành động</td>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.map((participant) => (
                                    <tr key={participant.id}>
                                        <td>{format(new Date(participant.registeredAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</td>
                                        <td>{participant.fullName}</td>
                                        <td>{participant.gender}</td>
                                        <td>{participant.address}</td>
                                        <td>{participant.phone}</td>
                                        <td>{participant.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                        <td>{participant.totalAmount?.toLocaleString('vi-VN')} VNĐ</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Button
                                                style={{
                                                    backgroundColor: 'green',
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => {
                                                    localStorage.setItem('isLocal', 'local');
                                                    localStorage.setItem('participant', JSON.stringify(participant));
                                                    localStorage.setItem('tourSelected', JSON.stringify(tour));
                                                    navigate(RoutePath.ONGOING_CONTRACT)
                                                }}>
                                                Xem hợp đồng
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </div>
                <div className="d-flex justify-content-end gap-3">
                    <Button variant="secondary" onClick={handleCloseManagementModal}>Đóng</Button>
                </div>
            </Modal>
            <ConfirmModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={handleDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa tour này không?"
            />
        </div>
    );
}
TourCard.propTypes = {
    tour: PropTypes.shape({
        tourImage: PropTypes.string.isRequired,
        tourName: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        numberOfDays: PropTypes.number.isRequired,
        numberOfNights: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        registeredGuests: PropTypes.number.isRequired,
        maxGuests: PropTypes.number.isRequired,
        tourId: PropTypes.string.isRequired,
    }).isRequired,
    onTourUpdated: PropTypes.func.isRequired,
    approvalStatus: PropTypes.number.isRequired,
};

export default TourCard;
