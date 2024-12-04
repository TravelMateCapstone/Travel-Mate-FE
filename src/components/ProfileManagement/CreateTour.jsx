import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Form, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
Modal.setAppElement('#root');

function CreateTour({ onTourCreated }) {
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
    const token = useSelector((state) => state.auth.token);
    const [key, setKey] = useState('schedule');

    useEffect(() => {
        if (tourDetails.startDate && tourDetails.endDate) {
            const start = new Date(tourDetails.startDate);
            const end = new Date(tourDetails.endDate);
            const numberOfDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            const newActivities = [];

            for (let i = 0; i < numberOfDays; i++) {
                newActivities.push({
                    day: i + 1,
                    date: format(addDays(start, i), "yyyy-MM-dd'T'HH:mm"),
                    activities: [],
                });
            }
            setActivities(newActivities);
        }
    }, [tourDetails.startDate, tourDetails.endDate]);

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
                <h2>Create a New Tour</h2>
                <Row className="mb-4" style={{ flex: 1}}>
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
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Activities</Card.Title>
                                        {activities.map((activity, dayIndex) => (
                                            <div key={dayIndex} className="mb-3">
                                                <h5>Day {activity.day}</h5>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Date</Form.Label>
                                                    <Form.Control type="datetime-local" value={activity.date} readOnly />
                                                </Form.Group>
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
                                            </div>
                                        ))}
                                    </Card.Body>
                                </Card>
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
                    <Button variant="success" onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </Modal>
        </div>
    );
}

export default CreateTour;
