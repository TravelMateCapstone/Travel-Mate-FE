import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
import { useNavigate } from 'react-router-dom';
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
Modal.setAppElement('#root');

function TourCard({ tour, onTourUpdated }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [costDetails, setCostDetails] = useState([]);
    const [managementModalIsOpen, setManagementModalIsOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [locations, setLocations] = useState([]);

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
    const [key, setKey] = useState('schedule');
    const [isGlobalContract, setIsGlobalContract] = useState(true);
    const [filter, setFilter] = useState('paid');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Locations');
                if (response.data && response.data.$values) {
                    setLocations(response.data.$values); // Lưu danh sách địa điểm vào state
                }
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

        // Tính tổng chi phí khác
        const totalCostDetail = costDetails.reduce(
            (costSum, cost) => costSum + parseFloat(cost.amount || 0),
            0
        );

        // Cập nhật giá tour
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
            console.log(response.data.$values);
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
            const numberOfDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            if (activities.length !== numberOfDays) {
                const newActivities = activities.length ? activities : [];

                for (let i = newActivities.length; i < numberOfDays; i++) {
                    newActivities.push({
                        day: i + 1,
                        date: format(addDays(start, i), "yyyy-MM-dd'T'HH:mm", { locale: vi }),
                        activities: [],
                    });
                }
                setActivities(newActivities);
            }
        }
    }, [tourDetails.startDate, tourDetails.endDate]);

    const openModal = async () => {
        console.log(tour.tourId);

        try {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/${tour.tourId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            const tourData = response.data;
            console.log(`Tour data:`, tourData);

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
        console.log('Switch is now', isOn ? 'ON' : 'OFF');
        console.log(isOn);

        setIsGlobalContract(isOn);
    };

    const handleDelete = async (tourId) => {
        try {
            await axios.delete(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            alert("Xóa tour thành công!");
        } catch (error) {
            console.error("There was an error deleting the tour!", error);
        }
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
                [field]: field === 'activityAmount' ? parseFloat(value) || 0 : value,
            };
            return updatedActivities;
        });
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

    const handleSaveChanges = async (tourId) => {
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
            tourImage: tourDetails.tourImage,
            itinerary: activities.map(activity => ({
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
        console.log('Tour data:', tourData);

        try {
            const response = await axios.put(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`, tourData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });
            toast.success('Tour updated successfully!');
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

    const totalIncome = participants.reduce((sum, participant) => sum + participant.totalAmount, 0);

    return (
        <tr>
            <td className='d-flex gap-3 align-items-center'>
                <img src={tour.tourImage} alt="" width={150} height={100} className='rounded-3' />
                <div className='d-flex flex-column justify-content-center'>
                    <h6 className='m-0'>{tour.tourName}</h6>
                    <p className='m-0'>{tour.location}</p>
                    <p className='m-0'>{tour.numberOfDays} ngày {tour.numberOfNights} đêm</p>
                </div>
            </td>
            <td>
                <p className='m-0 fw-medium'>{(tour.price).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
            </td>
            <td>
                <div className='d-flex align-items-center gap-5'>
                    <div className='d-flex flex-column align-items-center'>
                        <small className='fw-medium'>{format(new Date(tour.startDate), 'dd/MM/yyyy', { locale: vi })}</small>
                        <small className='fw-medium'>{format(new Date(tour.endDate), 'dd/MM/yyyy', { locale: vi })}</small>
                    </div>
                </div>
            </td>
            <td>
                <small>{tour.registeredGuests}/{tour.maxGuests}</small>
            </td>
            <td>
                <Dropdown>
                    <Dropdown.Toggle variant="success" >
                        <ion-icon name="settings-outline"></ion-icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleView(tour.tourId)}>Xem thêm</Dropdown.Item>
                        <Dropdown.Item onClick={openModal}>Chỉnh sửa</Dropdown.Item>
                        <Dropdown.Item onClick={handleOpenManagementModal}>Quản lí</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            handleDelete(tour.tourId);
                        }}>Xóa</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
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
                                            width: '180px',
                                        }}>Chọn địa điểm</Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            {locations.map((location) => (
                                                <option key={location.locationId} value={location.locationName}>
                                                    {location.locationName}
                                                </option>
                                            ))}
                                        </Form.Select>
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
                                <Form.Group className="mt-4 form-group-custom-create-tour">
                                    <Form.Control type="file" onChange={handleImageUpload} />
                                </Form.Group>
                                {tourDetails.tourImage && (
                                    <img src={tourDetails.tourImage} alt="Tour" style={{ width: '100%', height: 'auto' }} />
                                )}
                                <h4 className='text-success'>{tourDetails.price} VNĐ</h4>
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
                                                    <Accordion.Header>Day {activity.day}: {format(new Date(activity.date), 'dd/MM/yyyy')}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <Button variant="primary" onClick={() => addActivity(dayIndex)}>Add Activity</Button>
                                                        {activity.activities.map((act, actIndex) => (
                                                            <div key={actIndex} className="ml-4 mt-3">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Tiêu Đề</Form.Label>
                                                                    <Form.Control type="text" value={act.title} onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Thời Gian Bắt Đầu</Form.Label>
                                                                    <Form.Control type="time" step="1" value={act.startTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'startTime', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Thời Gian Kết Thúc</Form.Label>
                                                                    <Form.Control type="time" step="1" value={act.endTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'endTime', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Ghi Chú</Form.Label>
                                                                    <Form.Control type="text" value={act.note} onChange={(e) => updateActivity(dayIndex, actIndex, 'note', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Mô Tả</Form.Label>
                                                                    <Form.Control type="text" value={act.description} onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Địa Chỉ</Form.Label>
                                                                    <Form.Control type="text" value={act.activityAddress} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAddress', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Số Tiền</Form.Label>
                                                                    <Form.Control type="number" value={act.activityAmount} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAmount', e.target.value)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Hình Ảnh</Form.Label>
                                                                    <Form.Control type="file" onChange={(e) => handleActivityImageUpload(e, dayIndex, actIndex)} />
                                                                </Form.Group>
                                                                {act.activityImage && (
                                                                    <img src={act.activityImage} alt="Activity" style={{ width: '100%', height: 'auto' }} />
                                                                )}
                                                                <Button variant="danger" onClick={() => removeActivity(dayIndex, actIndex)}>Xóa hoạt động</Button>
                                                            </div>
                                                        ))}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="cost" title="Chi phí">
                                <div>
                                    <Card.Body>
                                        <Card.Title>Cost Details</Card.Title>
                                        {costDetails.map((costDetail, index) => (
                                            <div key={index} className="mb-3">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tiêu Đề</Form.Label>
                                                    <Form.Control type="text" value={costDetail.title} onChange={(e) => {
                                                        const updatedCostDetails = [...costDetails];
                                                        updatedCostDetails[index].title = e.target.value;
                                                        setCostDetails(updatedCostDetails);
                                                    }} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Số Tiền</Form.Label>
                                                    <Form.Control type="number" value={costDetail.amount} onChange={(e) => {
                                                        const updatedCostDetails = [...costDetails];
                                                        updatedCostDetails[index].amount = e.target.value;
                                                        setCostDetails(updatedCostDetails);
                                                    }} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Ghi Chú</Form.Label>
                                                    <Form.Control type="text" value={costDetail.notes} onChange={(e) => {
                                                        const updatedCostDetails = [...costDetails];
                                                        updatedCostDetails[index].notes = e.target.value;
                                                        setCostDetails(updatedCostDetails);
                                                    }} />
                                                </Form.Group>
                                                <Button variant="outline-danger" className='d-flex align-items-center gap-2' onClick={() => removeCostDetail(index)}><ion-icon name="trash-outline"></ion-icon> Loại bỏ chi phí</Button>
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
                    <Button variant="secondary" onClick={closeModal}>Close Modal</Button>
                    <Button variant="success" onClick={() => handleSaveChanges(tour.tourId)}>Save Changes</Button>
                </div>
            </Modal>
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
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <h4>Quản lí tour</h4>
                <div className='h-100'>
                    <Row style={{
                        borderBottom: '1px solid black',
                        paddingBottom: '20px',
                    }}>
                        <Col lg={6}>
                            <div>
                                <div className='d-flex gap-5'>
                                    <p className='w-25 m-0'>Tên tour du lịch</p>
                                    <p className='m-0'>{tour.tourName}</p>
                                </div>
                                <div className='d-flex gap-5'>
                                    <p className='w-25 m-0'>Ngày bắt đầu</p>
                                    <p className='m-0'>{tour.startDate}</p>
                                </div>
                                <div className='d-flex gap-5'>
                                    <p className='w-25 m-0'>Ngày kết thúc</p>
                                    <p className='m-0'>{tour.endDate}</p>
                                </div>
                                <div className='d-flex gap-5'>
                                    <p className='w-25 m-0'>Địa điểm</p>
                                    <p className='m-0'>{tour.location}</p>
                                </div>

                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className='d-flex gap-5'>
                                <div className='p-3 border-1'>
                                    <h5>Tổng thu nhập</h5>
                                    <p>{totalIncome.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                                <div className='d-flex align-items-center gap-3 p-3 border-1'>
                                    <div>
                                        <ion-icon name="person-outline"></ion-icon>
                                        <h5>Số lượng khách</h5>
                                    </div>
                                    <h5>{participants.length}/{tour.maxGuests}</h5>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        Danh sách người tham gia
                        <div className='d-flex justify-content-between my-4'>
                            <Form.Control type='text' className='w-25' placeholder='Tìm kiếm người tham gia' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <div className='py-2 px-2 rounded-5 bg-black'>
                                <Button variant='success' className='rounded-5 border-0' onClick={() => setFilter('paid')}>Đã thanh toán</Button>
                                <Button variant='success' className='rounded-5 border-0' onClick={() => setFilter('unpaid')}>Chưa thanh toán</Button>
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
                                    <td>Chiết khấu</td>
                                    <td>Số tiền</td>
                                    <td>Hành động</td>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.map((participant) => (
                                    <tr key={participant.id}>
                                        <td>{participant.registeredAt}</td>
                                        <td>{participant.fullName}</td>
                                        <td>{participant.gender}</td>
                                        <td>{participant.address}</td>
                                        <td>{participant.phone}</td>
                                        <td>{participant.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                        <td>{participant.discount}</td>
                                        <td>{participant.totalAmount}</td>
                                        <td><ion-icon name="ellipsis-horizontal-outline"></ion-icon></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </div>
                <div className="d-flex justify-content-end gap-3">
                    <Button variant="secondary" onClick={handleCloseManagementModal}>Close Modal</Button>
                </div>
            </Modal>
        </tr>
    );
}

export default TourCard;
