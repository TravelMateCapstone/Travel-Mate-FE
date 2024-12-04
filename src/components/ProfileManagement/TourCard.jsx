import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Form, Row, Col, Tabs, Tab, Card, Accordion } from 'react-bootstrap';
Modal.setAppElement('#root');

function TourCard({ tour }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [costDetails, setCostDetails] = useState([]);
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
                        date: format(addDays(start, i), "yyyy-MM-dd'T'HH:mm"),
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
                startDate: format(new Date(tourData.startDate), "yyyy-MM-dd'T'HH:mm"),
                endDate: format(new Date(tourData.endDate), "yyyy-MM-dd'T'HH:mm"),
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
                date: format(new Date(item.date), "yyyy-MM-dd'T'HH:mm"),
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
        } catch (error) {
            console.error('Error updating tour:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className='d-flex align-items-center justify-content-between mb-4'>
            <div className='d-flex gap-3 align-items-center'>
                <img src={tour.tourImage} alt="" width={150} height={100} className='rounded-3' />
                <div className='d-flex flex-column justify-content-center'>
                    <h6 className='m-0'>{tour.tourName}</h6>
                    <p className='m-0'>{tour.location}</p>
                    <p className='m-0'>{tour.numberOfDays} ngày {tour.numberOfNights} đêm</p>
                </div>
            </div>
            <p className='m-0 fw-medium text-success'>{tour.price} VNĐ</p>
            <div className='d-flex align-items-center gap-5'>
                <div className='d-flex flex-column align-items-center'>
                    <small>{tour.registeredGuests}/{tour.maxGuests}</small>
                    <small>{tour.startDate}</small>
                    <small>{tour.endDate}</small>
                </div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" >
                        <ion-icon name="settings-outline"></ion-icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleView(tour.tourId)}>Xem thêm</Dropdown.Item>
                        <Dropdown.Item onClick={openModal}>Chỉnh sửa</Dropdown.Item>
                        <Dropdown.Item>Quản lí</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            handleDelete(tour.tourId);
                        }}>Xóa</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
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
                        width: '80%',
                        maxHeight: '90vh',
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
                <h2>Update Tour</h2>
                <Row className="mb-4" style={{ flex: 1 }}>
                    <Col lg={4} style={{ height: '600px', overflowY: 'auto' }}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Tour Details</Card.Title>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tour Name</Form.Label>
                                        <Form.Control type="text" value={tourDetails.tourName} onChange={(e) => setTourDetails({ ...tourDetails, tourName: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type="number" value={tourDetails.price} onChange={(e) => setTourDetails({ ...tourDetails, price: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="datetime-local" value={tourDetails.startDate} onChange={(e) => setTourDetails({ ...tourDetails, startDate: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="datetime-local" value={tourDetails.endDate} onChange={(e) => setTourDetails({ ...tourDetails, endDate: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Number of Days</Form.Label>
                                        <Form.Control type="number" value={tourDetails.numberOfDays} onChange={(e) => setTourDetails({ ...tourDetails, numberOfDays: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Number of Nights</Form.Label>
                                        <Form.Control type="number" value={tourDetails.numberOfNights} onChange={(e) => setTourDetails({ ...tourDetails, numberOfNights: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tour Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={tourDetails.tourDescription} onChange={(e) => setTourDetails({ ...tourDetails, tourDescription: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" value={tourDetails.location} onChange={(e) => setTourDetails({ ...tourDetails, location: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Max Guests</Form.Label>
                                        <Form.Control type="number" value={tourDetails.maxGuests} onChange={(e) => setTourDetails({ ...tourDetails, maxGuests: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tour Image</Form.Label>
                                        <Form.Control type="file" onChange={handleImageUpload} />
                                    </Form.Group>
                                    {tourDetails.tourImage && (
                                        <img src={tourDetails.tourImage} alt="Tour" style={{ width: '100%', height: 'auto' }} />
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8} style={{ height: '600px', overflowY: 'auto' }}>
                        <Tabs defaultActiveKey="schedule" id="controlled-tab-example" className="mb-3">
                            <Tab eventKey="schedule" title="Lịch trình">
                                <Accordion defaultActiveKey="0">
                                    {activities.map((activity, dayIndex) => (
                                        <Accordion.Item eventKey={dayIndex.toString()} key={dayIndex}>
                                            <Accordion.Header>Day {activity.day}: {format(new Date(activity.date), 'dd/MM/yyyy')}</Accordion.Header>
                                            <Accordion.Body>
                                                <Button variant="primary" onClick={() => addActivity(dayIndex)}>Add Activity</Button>
                                                {activity.activities.map((act, actIndex) => (
                                                    <div key={actIndex} className="ml-4 mt-3">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Title</Form.Label>
                                                            <Form.Control type="text" value={act.title} onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Start Time</Form.Label>
                                                            <Form.Control type="time" step="1" value={act.startTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'startTime', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>End Time</Form.Label>
                                                            <Form.Control type="time" step="1" value={act.endTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'endTime', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Note</Form.Label>
                                                            <Form.Control type="text" value={act.note} onChange={(e) => updateActivity(dayIndex, actIndex, 'note', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Description</Form.Label>
                                                            <Form.Control type="text" value={act.description} onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Address</Form.Label>
                                                            <Form.Control type="text" value={act.activityAddress} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAddress', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Amount</Form.Label>
                                                            <Form.Control type="number" value={act.activityAmount} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAmount', e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Image</Form.Label>
                                                            <Form.Control type="file" onChange={(e) => handleActivityImageUpload(e, dayIndex, actIndex)} />
                                                        </Form.Group>
                                                        {act.activityImage && (
                                                            <img src={act.activityImage} alt="Activity" style={{ width: '100%', height: 'auto' }} />
                                                        )}
                                                        <Button variant="danger" onClick={() => removeActivity(dayIndex, actIndex)}>Remove Activity</Button>
                                                    </div>
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Tab>
                            <Tab eventKey="cost" title="Chi phí">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Cost Details</Card.Title>
                                        {costDetails.map((costDetail, index) => (
                                            <div key={index} className="mb-3">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control type="text" value={costDetail.title} onChange={(e) => {
                                                        const updatedCostDetails = [...costDetails];
                                                        updatedCostDetails[index].title = e.target.value;
                                                        setCostDetails(updatedCostDetails);
                                                    }} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Amount</Form.Label>
                                                    <Form.Control type="number" value={costDetail.amount} onChange={(e) => {
                                                        const updatedCostDetails = [...costDetails];
                                                        updatedCostDetails[index].amount = e.target.value;
                                                        setCostDetails(updatedCostDetails);
                                                    }} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Notes</Form.Label>
                                                    <Form.Control type="text" value={costDetail.notes} onChange={(e) => {
                                                        const updatedCostDetails = [...costDetails];
                                                        updatedCostDetails[index].notes = e.target.value;
                                                        setCostDetails(updatedCostDetails);
                                                    }} />
                                                </Form.Group>
                                                <Button variant="danger" onClick={() => removeCostDetail(index)}>Remove Cost</Button>
                                            </div>
                                        ))}
                                        <Button variant="primary" onClick={addCostDetail}>Add New Cost</Button>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="regulation" title="Quy định">
                                <Card>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Additional Info</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={tourDetails.additionalInfo} onChange={(e) => setTourDetails({ ...tourDetails, additionalInfo: e.target.value })} />
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
        </div>
    );
}

export default TourCard;
