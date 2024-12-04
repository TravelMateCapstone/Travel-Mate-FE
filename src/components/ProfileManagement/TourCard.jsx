import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux';
import {fetchTour} from '../../redux/actions/tourActions'
import { useSelector } from 'react-redux';
import RoutePath from '../../routes/RoutePath'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TourCard({ tour }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useSelector(state => state.auth.token)

    const handleDelete = async ({tourId}) => {
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
    }

    const handleEdit = () => {

    }

    const handleView = (tourId) => {
        dispatch(fetchTour(tourId, token))
        navigate(RoutePath.TOUR_DETAIL);
    }

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
                        <Dropdown.Item  onClick={() => handleView(tour.tourId)}>Xem thêm</Dropdown.Item>
                        <Dropdown.Item >Chỉnh sửa</Dropdown.Item>
                        <Dropdown.Item >Quản lí</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            handleDelete(tour.tourId)
                        }}>Xóa</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

        </div>
    )
}

export default TourCard