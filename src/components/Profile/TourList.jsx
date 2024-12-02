import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios' // Import axios for making API requests
import { toast } from 'react-toastify';

function TourList() {
    const [tourdata, setTourData] = useState(useSelector(state => state.profile.tour.$values));
    console.log(tourdata);

    const joinTour = async (tourId, tourName) => {
        try {
            await axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/join/${tourId}`);
            toast.success(`Tham gia chuyến đi ${tourName} thành công!`);
        } catch (error) {
            console.error('Error joining tour:', error);
            alert('Failed to join tour. Please try again later.');
        }
    };

    return (
        <div>
            <h1>Tour List</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {tourdata.map(tour => (
                    <li key={tour.tourId} style={{ display: 'flex', marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                        <img src={tour.tourImage} alt={tour.tourName} width="200" style={{ marginRight: '20px' }} />
                        <div>
                            <h2>{tour.tourName}</h2>
                            <p>Location: {tour.location}</p>
                            <p>Price: {tour.price}</p>
                            <p>Start Date: {new Date(tour.startDate).toLocaleDateString()}</p>
                            <p>End Date: {new Date(tour.endDate).toLocaleDateString()}</p>
                            <button onClick={() => joinTour(tour.tourId, tour.tourName)}>Tham gia</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TourList