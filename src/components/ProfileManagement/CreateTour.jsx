import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

Modal.setAppElement('#root');

function CreateTour() {
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
        } catch (error) {
            console.error('Error creating tour:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>CreateTour</h1>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Create Tour Modal"
                style={{
                    content: {
                        top: '52%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '1800px',
                        height: '800px',
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
                <div className='row' style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                    <div className='col-lg-4'>
                        <div>
                            <h3>Tour Details</h3>
                            <p>Tour Name: <input type="text" value={tourDetails.tourName} onChange={(e) => setTourDetails({ ...tourDetails, tourName: e.target.value })} /></p>
                            <p>Price: <input type="number" value={tourDetails.price} onChange={(e) => setTourDetails({ ...tourDetails, price: e.target.value })} /></p>
                            <p>Start Date: <input type="datetime-local" value={tourDetails.startDate} onChange={(e) => setTourDetails({ ...tourDetails, startDate: e.target.value })} /></p>
                            <p>End Date: <input type="datetime-local" value={tourDetails.endDate} onChange={(e) => setTourDetails({ ...tourDetails, endDate: e.target.value })} /></p>
                            <p>Number of Days: <input type="number" value={tourDetails.numberOfDays} onChange={(e) => setTourDetails({ ...tourDetails, numberOfDays: e.target.value })} /></p>
                            <p>Number of Nights: <input type="number" value={tourDetails.numberOfNights} onChange={(e) => setTourDetails({ ...tourDetails, numberOfNights: e.target.value })} /></p>
                            <p>Tour Description: <textarea value={tourDetails.tourDescription} onChange={(e) => setTourDetails({ ...tourDetails, tourDescription: e.target.value })} /></p>
                            <p>Location: <input type="text" value={tourDetails.location} onChange={(e) => setTourDetails({ ...tourDetails, location: e.target.value })} /></p>
                            <p>Max Guests: <input type="number" value={tourDetails.maxGuests} onChange={(e) => setTourDetails({ ...tourDetails, maxGuests: e.target.value })} /></p>
                            <p>Tour Image URL: <input type="text" value={tourDetails.tourImage} onChange={(e) => setTourDetails({ ...tourDetails, tourImage: e.target.value })} /></p>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                            <Tab eventKey="schedule" title="Lịch trình">
                                <div>
                                    <h3>Activities</h3>
                                    {activities.map((activity, dayIndex) => (
                                        <div key={dayIndex} style={{ marginBottom: '10px' }}>
                                            <p>Day: <input type="text" value={activity.day} readOnly /></p>
                                            <p>Date: <input type="datetime-local" value={activity.date} readOnly /></p>
                                            <button onClick={() => addActivity(dayIndex)}>Add Activity</button>
                                            {activity.activities.map((act, actIndex) => (
                                                <div key={actIndex} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                                                    <p>Title: <input type="text" value={act.title} onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)} /></p>
                                                    <p>Start Time: <input type="time" step="1" value={act.startTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'startTime', e.target.value)} /></p>
                                                    <p>End Time: <input type="time" step="1" value={act.endTime} onChange={(e) => updateActivity(dayIndex, actIndex, 'endTime', e.target.value)} /></p>
                                                    <p>Note: <input type="text" value={act.note} onChange={(e) => updateActivity(dayIndex, actIndex, 'note', e.target.value)} /></p>
                                                    <p>Description: <input type="text" value={act.description} onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)} /></p>
                                                    <p>Address: <input type="text" value={act.activityAddress} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAddress', e.target.value)} /></p>
                                                    <p>Amount: <input type="number" value={act.activityAmount} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityAmount', e.target.value)}/></p>
                                                    <p>Image URL: <input type="text" value={act.activityImage} onChange={(e) => updateActivity(dayIndex, actIndex, 'activityImage', e.target.value)} /></p>
                                                    <button onClick={() => removeActivity(dayIndex, actIndex)}>Remove activity</button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </Tab>
                            <Tab eventKey="cost" title="Chi phí">
                                <div>
                                    <h3>Cost Details</h3>
                                    {costDetails.map((costDetail, index) => (
                                        <div key={index} style={{ marginBottom: '10px' }}>
                                            <p>Title: <input type="text" value={costDetail.title} onChange={(e) => {
                                                const updatedCostDetails = [...costDetails];
                                                updatedCostDetails[index].title = e.target.value;
                                                setCostDetails(updatedCostDetails);
                                            }} /></p>
                                            <p>Amount: <input type="number" value={costDetail.amount} onChange={(e) => {
                                                const updatedCostDetails = [...costDetails];
                                                updatedCostDetails[index].amount = e.target.value;
                                                setCostDetails(updatedCostDetails);
                                            }} /></p>
                                            <p>Notes: <input type="text" value={costDetail.notes} onChange={(e) => {
                                                const updatedCostDetails = [...costDetails];
                                                updatedCostDetails[index].notes = e.target.value;
                                                setCostDetails(updatedCostDetails);
                                            }} /></p>
                                            <button onClick={() => removeCostDetail(index)}>Remove Cost</button>
                                        </div>
                                    ))}
                                    <button onClick={addCostDetail}>Add New Cost</button>
                                </div>
                            </Tab>
                            <Tab eventKey="regulation" title="Quy định">
                                <p>Additional Info: <textarea value={tourDetails.additionalInfo} onChange={(e) => setTourDetails({ ...tourDetails, additionalInfo: e.target.value })} /></p>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end', gap: '20px' }}>
                    <button onClick={closeModal}>Close Modal</button>
                    <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
            </Modal>
        </div>
    );
}

export default CreateTour;
