import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios' // Import axios for making API requests
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Routepath from '../../routes/RoutePath';
import { useDispatch } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
function TourList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tourdata, setTourData] = useState([]);
    const token = useSelector(state => state.auth.token);
    const profileTourData = useSelector(state => state.profile.tour.$values);

    useEffect(() => {
        setTourData(profileTourData);
    }, [profileTourData]);
    
    console.log(token);
    
    console.log(tourdata);

    const joinTour = async (tourId, tourName) => {
        // try {
        //     await axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/join/${tourId}`);
        //     toast.success(`Tham gia chuyến đi ${tourName} thành công!`);
        // } catch (error) {
        //     console.error('Error joining tour:', error);
        //     alert('Failed to join tour. Please try again later.');
        // }
        dispatch(fetchTour(tourId, token));
        navigate(Routepath.TOUR_DETAIL);
    };

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div>
            <h1>Tour List</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {tourdata.map(tour => (
                    <li key={tour.tourId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d9d9d9',}}>
                        <div className='d-flex' style={{
                            flex: '3'
                        }}><img src={tour.tourImage} alt={tour.tourName} width="136" height={92} style={{ marginRight: '20px', borderRadius: '10px' }} />
                            <div>
                                <strong>{tour.tourName}</strong>
                                <p className='m-0'>Location: {tour.location}</p>
                                <p>{tour.numberOfDays} ngày {tour.numberOfNights} đêm </p>
                            </div>
                        </div>

                        <div style={{
                            flex: '1'
                        }} className='d-flex align-items-center fw-medium text-success'><p>{formatCurrency(tour.price)}</p></div>
                        <div style={{
                            flex: '1'
                        }} className='d-flex align-items-center flex-column'>
                            <p className='m-0'>5/{tour.maxGuests}</p>
                            <small className='fw-medium'>{new Date(tour.startDate).toLocaleDateString()}</small>
                            <small className='fw-medium'>{new Date(tour.endDate).toLocaleDateString()}</small>
                        </div>
                        <button className='rounded-5 border-0 text-light fw-normal' style={{
                            height: '44px',
                            width: '176px',
                            backgroundColor: '#34A853',
                        }} onClick={() => joinTour(tour.tourId, tour.tourName)}>Xem chi tiết</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TourList