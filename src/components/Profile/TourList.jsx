import  { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Routepath from '../../routes/RoutePath';
import { fetchTour } from '../../redux/actions/tourActions';
import { Form, InputGroup, Dropdown, Button, } from 'react-bootstrap'; // Import React Bootstrap components

function TourList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tourdata, setTourData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const token = useSelector(state => state.auth.token);
    const profileTourData = useSelector(state => state.profile.tour.$values);

    useEffect(() => {
        setTourData(profileTourData);
        console.log("Danh sách tour:", profileTourData);
        
    }, [profileTourData]);

    const filteredTours = tourdata.filter(tour => {
        const matchesSearchTerm = tour.tourName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriceRange = (!minPrice || tour.price >= minPrice) && (!maxPrice || tour.price <= maxPrice);
        const matchesDateRange = (!startDate || new Date(tour.startDate) >= new Date(startDate)) && (!endDate || new Date(tour.endDate) <= new Date(endDate));
        return matchesSearchTerm && matchesPriceRange && matchesDateRange;
    });

    // eslint-disable-next-line no-unused-vars
    const joinTour = async (tourId, tourName) => {
        dispatch(fetchTour(tourId, token));
        navigate(Routepath.TOUR_DETAIL);
    };

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div style={{ background: '#f9f9f9', }} className='rounded-5 py-3 px-0 item-container'>
            <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">Danh sách tour</h2>
            <div className='mx-5'>
                <div style={{ marginBottom: '20px' }} className='d-flex align-items-center justify-content-between'>
                    <InputGroup className="mb-3 w-50">
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm theo tên tour"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Dropdown>
                        <Dropdown.Toggle variant="success">
                            Tùy chọn lọc
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='p-2' style={{
                            width: '400px',
                        }}>
                            <div className='d-flex gap-2 justify-content-between'>
                                <Form.Group className="mb-3 w-100" controlId="formMinPrice">
                                    <Form.Label>Giá tối thiểu</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Giá tối thiểu"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 w-100" controlId="formMaxPrice">
                                    <Form.Label>Giá tối đa</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Giá tối đa"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                            <div className='d-flex gap-2 justify-content-between align-items-center'>
                                <Form.Group className="mb-3 w-100" controlId="formStartDate">
                                    <Form.Label>Ngày bắt đầu</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Ngày bắt đầu"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 w-100" controlId="formEndDate">
                                    <Form.Label>Ngày kết thúc</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Ngày kết thúc"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='d-flex flex-column gap-3'>
                    {filteredTours.map(tour => (
                        <div key={tour.tourId} style={{ display: 'flex', borderBottom: '1px solid #d9d9d9', }}>
                            <div className='d-flex align-items-center' style={{
                                flex: '5'
                            }}><img src={tour.tourImage} alt={tour.tourName} width="136" height={92} style={{ marginRight: '20px', borderRadius: '10px' }} />
                                <div>
                                    <strong>{tour.tourName}</strong>
                                    <p className='m-0 d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon> {tour.location}</p>
                                    <p className='m-0 d-flex align-items-center gap-2'><ion-icon name="cash-outline"></ion-icon> {formatCurrency(tour.price)}</p>
                                </div>
                            </div>
                            <div className='d-flex align-items-center'>
                            <button className='rounded-5 border-0 text-light fw-normal p-0' style={{
                                height: '44px',
                                width: '120px',
                                backgroundColor: '#34A853',
                                fontSize: '15px',
                            }} onClick={() => joinTour(tour.tourId, tour.tourName)}>Xem chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TourList