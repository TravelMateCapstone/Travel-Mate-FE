import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Form, Row, Col, Tabs, Tab, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../assets/css/Local/CreateTour.css'
import TextareaAutosize from 'react-textarea-autosize';
Modal.setAppElement('#root');
function CreateTour({ onTourCreated }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [costDetails, setCostDetails] = useState([]);
    const [locationCurent, setLocationCurent] = useState('');

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
    const token = useSelector((state) => state.auth.token);
    const [key, setKey] = useState('schedule');
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        if (tourDetails.startDate && tourDetails.endDate) {
            const start = new Date(tourDetails.startDate);
            const end = new Date(tourDetails.endDate);
            const numberOfDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const numberOfNights = numberOfDays - 1;
            const newActivities = [];
            for (let i = 0; i < numberOfDays; i++) {
                newActivities.push({
                    day: i + 1,
                    date: format(addDays(start, i), "yyyy-MM-dd'T'HH:mm"),
                    activities: [],
                });
            }
            setActivities(newActivities);
            setTourDetails((prevDetails) => ({
                ...prevDetails,
                numberOfDays,
                numberOfNights,
            }));
        }
    }, [tourDetails.startDate, tourDetails.endDate]);

    useEffect(() => {
        const totalActivityCost = activities.reduce((total, activity) => {
            return total + activity.activities.reduce((subTotal, act) => subTotal + act.activityAmount, 0);
        }, 0);
        const totalCostDetails = costDetails.reduce((total, cost) => total + parseFloat(cost.amount), 0);
        const price = totalActivityCost + totalCostDetails;
        setTourDetails((prevDetails) => ({
            ...prevDetails,
            price: isNaN(price) ? 0 : price,
        }));
    }, [activities, costDetails]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://travelmateapp.azurewebsites.net/api/UserLocationsWOO/get-current-user');
                console.log('Location:', response.data.$values);
                setLocations(response.data.$values);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);


    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
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

    const handleSaveChanges = async () => {
        const tourData = {
            tourName: tourDetails.tourName,
            price: parseFloat(tourDetails.price),
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
            const response = await axios.post('https://travelmateapp.azurewebsites.net/api/Tour', tourData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });
            toast.success('Tour created successfully!');
            closeModal();
            if (onTourCreated) {
                onTourCreated();
            }
        } catch (error) {
            console.error('Error creating tour:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>CreateTour</h1>
            <Button variant='success' onClick={openModal}>Tạo tour du lịch</Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Create Tour Modal"
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
                <h2>Create a New Tour</h2>
                <Row className="mb-4" style={{ flex: 1 }}>
                    <Col lg={12}>
                        <Row>
                            <Col lg={8}>
                                <div>
                                    <div>
                                        <Card.Title>Tour Details</Card.Title>
                                        <Form>
                                            <Form.Group className="mb-3 form-group-custom-create-tour">
                                                <Form.Label>Tên tour du lịch</Form.Label>
                                                <Form.Control type="text" value={tourDetails.tourName} onChange={(e) => setTourDetails({ ...tourDetails, tourName: e.target.value })} />
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Group className="mb-3 form-group-custom-create-tour">
                                                        <Form.Label>Ngày bắt đầu</Form.Label>
                                                        <Form.Control type="datetime-local" value={tourDetails.startDate} onChange={(e) => setTourDetails({ ...tourDetails, startDate: e.target.value })} />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3 form-group-custom-create-tour">
                                                        <Form.Label>Ngày kết thúc</Form.Label>
                                                        <Form.Control type="datetime-local" value={tourDetails.endDate} onChange={(e) => setTourDetails({ ...tourDetails, endDate: e.target.value })} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3 d-none">
                                                <Form.Label>Số ngày đi</Form.Label>
                                                <Form.Control type="number" value={tourDetails.numberOfDays} onChange={(e) => setTourDetails({ ...tourDetails, numberOfDays: e.target.value })} />
                                            </Form.Group>
                                            <Form.Group className="mb-3 d-none">
                                                <Form.Label>Số đêm đi</Form.Label>
                                                <Form.Control type="number" value={tourDetails.numberOfNights} onChange={(e) => setTourDetails({ ...tourDetails, numberOfNights: e.target.value })} />
                                            </Form.Group>
                                            <Form.Group className="mb-3 form-group-custom-create-tour">
                                                <Form.Label>Địa điểm</Form.Label>
                                                <Form.Control as="select" value={tourDetails.location} onChange={(e) => setTourDetails({ ...tourDetails, location: e.target.value })}>
                                                    <option value="">Chọn địa điểm</option>
                                                    {locations.map((location) => (
                                                        <option key={location.locationId} value={location.location.locationName}>
                                                            {location.location.locationName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3 form-group-custom-create-tour">
                                                <Form.Label>Số lượng tối đa</Form.Label>
                                                <Form.Control type="number" value={tourDetails.maxGuests} onChange={(e) => setTourDetails({ ...tourDetails, maxGuests: e.target.value })} />
                                            </Form.Group>
                                            <Form.Group className="mb-3 form-group-custom-create-tour align-items-start">
                                                <Form.Label>Mô tả tour</Form.Label>
                                                <TextareaAutosize
                                                    minRows={3}
                                                    value={tourDetails.tourDescription}
                                                    onChange={(e) => setTourDetails({ ...tourDetails, tourDescription: e.target.value })}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mt-4 form-group-custom-create-tour">
                                    <Form.Control type="file" onChange={handleImageUpload} />
                                </Form.Group>
                                {tourDetails.tourImage && (
                                    <img src={tourDetails.tourImage} alt="Tour" style={{ width: '100%', height: 'auto' }} />
                                )}
                                <h4 className='text-success'>{formatPrice(tourDetails.price)}</h4>
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
                                                    <Accordion.Header>Ngày {activity.day}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <div>{activity.date}</div>
                                                        {activity.activities.map((act, actIndex) => (
                                                            <div key={actIndex} className="my-3">
                                                                <Row>
                                                                    <Col lg={8}>
                                                                        <Row>
                                                                           <Col>
                                                                                <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                                    <Form.Label>Tên hoạt động</Form.Label>
                                                                                    <Form.Control type="text" value={act.title} onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)} />
                                                                                </Form.Group>
                                                                           </Col>
                                                                            <Col>
                                                                                <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                                    <Form.Label>Chi phí</Form.Label>
                                                                                    <Form.Control type="number" value={act.activityAmount} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAmount', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                                    <Form.Label>Thời gian bắt đầu</Form.Label>
                                                                                    <Form.Control type="time" step="1" value={act.startTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'startTime', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col>
                                                                                <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                                    <Form.Label>Thời gian kết thúc</Form.Label>
                                                                                    <Form.Control type="time" step="1" value={act.endTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'endTime', e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>
                                                                        <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                            <Form.Label>Địa chỉ</Form.Label>
                                                                            <Form.Control type="text" value={act.activityAddress} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAddress', e.target.value)} />
                                                                        </Form.Group>
                                                                        <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                            <Form.Label>Ghi chú</Form.Label>
                                                                            <TextareaAutosize
                                                                                minRows={3}
                                                                                value={act.note}
                                                                                onChange={(e) => updateActivity(dayIndex, actIndex, 'note', e.target.value)}
                                                                                className="form-control"
                                                                            />
                                                                        </Form.Group>
                                                                        <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                            <Form.Label>Mô tả</Form.Label>
                                                                            <TextareaAutosize
                                                                                minRows={3}
                                                                                value={act.description}
                                                                                onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                                                                                className="form-control"
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <Form.Group className="mb-3 form-group-custom-create-tour">
                                                                            <Form.Control type="file" onChange={(e) => handleActivityImageUpload(e, dayIndex, actIndex)} />
                                                                        </Form.Group>
                                                                        {act.activityImage && (
                                                                            <img src={act.activityImage} alt="Activity" style={{ width: '100%', height: 'auto' }} />
                                                                        )}</Col>
                                                                </Row>
                                                                <Button className='d-flex align-items-center gap-2' variant="outline-danger" onClick={() => removeActivity(dayIndex, actIndex)}><ion-icon name="trash-outline"></ion-icon> Xóa hoạt động</Button>
                                                            </div>
                                                        ))}
                                                        <Button className='d-flex align-items-center gap-2' variant="outline-primary" onClick={() => addActivity(dayIndex)}><ion-icon name="add-circle-outline"></ion-icon> Thêm hoạt động</Button>
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
                                               <Row>
                                                    <Col>
                                                        <Form.Group className="mb-3 form-group-custom-create-tour">
                                                            <Form.Label>Tiêu đề</Form.Label>
                                                            <Form.Control type="text" value={costDetail.title} onChange={(e) => {
                                                                const updatedCostDetails = [...costDetails];
                                                                updatedCostDetails[index].title = e.target.value;
                                                                setCostDetails(updatedCostDetails);
                                                            }} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3 form-group-custom-create-tour">
                                                            <Form.Label>Số tiền</Form.Label>
                                                            <Form.Control type="number" value={costDetail.amount} onChange={(e) => {
                                                                const updatedCostDetails = [...costDetails];
                                                                updatedCostDetails[index].amount = e.target.value;
                                                                setCostDetails(updatedCostDetails);
                                                            }} />
                                                        </Form.Group>
                                                    </Col>
                                               </Row>
                                                <Form.Group className="mb-3 form-group-custom-create-tour">
                                                    <Form.Label>Ghi chú</Form.Label>
                                                    <TextareaAutosize
                                                        minRows={3}
                                                        value={costDetail.notes}
                                                        onChange={(e) => {
                                                            const updatedCostDetails = [...costDetails];
                                                            updatedCostDetails[index].notes = e.target.value;
                                                            setCostDetails(updatedCostDetails);
                                                        }}
                                                        className="form-control"
                                                    />
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
                    <Button variant="secondary" onClick={closeModal}>Đóng</Button>
                    <Button variant="success" onClick={handleSaveChanges}>Lưu thay đổi</Button>
                </div>
            </Modal>
        </div>
    );
}

export default CreateTour;
