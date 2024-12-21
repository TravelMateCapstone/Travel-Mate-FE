import React, { useState, useEffect } from 'react';
import '../../assets/css/Destination/Destination.css';
import Navbar from '../../components/Shared/Navbar';
import { Button, Col, Row, Dropdown, Form } from 'react-bootstrap';
import TourCard from '../../components/Destination/TourCard';
import Tag from '../../components/Destination/Tag';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Placeholder from 'react-bootstrap/Placeholder';
import axios from 'axios';

function Destination() {
    const [originalTours, setOriginalTours] = useState([]); // Dữ liệu gốc từ API
    const [filteredTours, setFilteredTours] = useState([]); // Dữ liệu đã lọc
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]); // Sở thích người dùng
    const [allHobbies, setAllHobbies] = useState([]); // Danh sách tất cả sở thích
    const [selectedHobbies, setSelectedHobbies] = useState([]); // Sở thích đã chọn
    const location = useLocation();
    const selectedLocation = location.state?.selectedLocation || JSON.parse(localStorage.getItem('selectedLocation'));

    const [filters, setFilters] = useState({
        tourName: '',
        startDate: '',
        priceRange: [0, 10000000],
        gender: '',
        rating: 0, // Default to 0 stars
        connectionsRange: [1, 10000],
        interests: [],
    });

    // Hàm lấy danh sách tour
    const fetchTours = async () => {
        try {
            const queryParams = new URLSearchParams({
                location: selectedLocation.locationName,
                tourName: filters.tourName,
                startDate: filters.startDate,
                minPrice: filters.priceRange[0],
                maxPrice: filters.priceRange[1],
                gender: filters.gender,
                rating: filters.rating,
                minConnections: filters.connectionsRange[0],
                maxConnections: filters.connectionsRange[1],
                interests: filters.interests.join(','),
            });

            const response = await fetch(
                `https://travelmateapp.azurewebsites.net/api/FilterToursWOO/GetAllTour-WithUserDetails-ByLocation?${queryParams}`
            );
            const data = await response.json();
            setOriginalTours(data || []);
            setFilteredTours(data || []);
            setLoading(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
            setLoading(false);
        }
    };

    // Hàm áp dụng các bộ lọc
    const applyFilters = () => {
        const filtered = originalTours.filter((tour) => {
            const matchesTourName = tour.TourName.toLowerCase().includes(filters.tourName.toLowerCase());
            const matchesStartDate =
                !filters.startDate || new Date(tour.StartDate).toISOString().split('T')[0] === filters.startDate;
            const matchesPrice = tour.Price >= filters.priceRange[0] && tour.Price <= filters.priceRange[1];
            const matchesGender = !filters.gender || tour.User.CCCD.Sex === filters.gender;
            const matchesRating =
                filters.rating === 0 ? tour.User.Star === 0 : tour.User.Star >= filters.rating;
            const matchesConnections =
                tour.User.CountConnect >= filters.connectionsRange[0] &&
                tour.User.CountConnect <= filters.connectionsRange[1];
            const matchesInterests =
                filters.interests.length === 0 ||
                filters.interests.every((interest) => tour.User.ActivityIds.includes(interest));

            return (
                matchesTourName &&
                matchesStartDate &&
                matchesPrice &&
                matchesGender &&
                matchesRating &&
                matchesConnections &&
                matchesInterests
            );
        });

        setFilteredTours(filtered);
    };

    // Lấy danh sách sở thích từ API
    const fetchActivities = async () => {
        try {
            const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Activity');
            const activities = response.data.$values.map((activity) => ({
                id: activity.activityId,
                name: activity.activityName,
            }));
            setAllHobbies(activities);
        } catch (err) {
            console.error('Error fetching activities:', err);
        }
    };

    // Lấy các tour khi location thay đổi
    useEffect(() => {
        if (selectedLocation) {
            fetchTours();
        }
    }, [selectedLocation]);

    // Áp dụng bộ lọc khi có thay đổi ở filter
    useEffect(() => {
        applyFilters();
    }, [filters]);

    // Gọi API lấy activities khi component mount
    useEffect(() => {
        fetchActivities();
    }, []);

    // Hàm làm mới các bộ lọc
    const resetFilters = () => {
        setFilters({
            tourName: '',
            startDate: '',
            priceRange: [0, 10000000],
            gender: '',
            rating: 0,
            connectionsRange: [0, 10000],
            interests: [],
        });
        setSelectedHobbies([]);
        fetchTours();
    };

    // Cập nhật sở thích và lọc ngay
    const handleHobbySelect = (hobbyName) => {
        const updatedHobbies = selectedHobbies.includes(hobbyName)
            ? selectedHobbies.filter((hobby) => hobby !== hobbyName)
            : [...selectedHobbies, hobbyName];

        setSelectedHobbies(updatedHobbies);
        setFilters((prevFilters) => ({
            ...prevFilters,
            interests: updatedHobbies,
        }));
    };

    return (
        <div>
            <Navbar />
            <img
                src={selectedLocation?.image || "https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2017/10/26015647/dich-vu-thiet-ke-banner-du-lich-chuyen-nghiep-tai-ha-noi4.jpg"}
                alt="image"
                className='w-100 object-fit-cover'
                height={586}
            />

            <div className=''>
                <Row style={{ backgroundColor: '#f5f5f5' }} className='p-5'>
                    <Col lg={6}>
                        <h1 className='fw-bold'>{selectedLocation?.title || selectedLocation?.locationName || 'Xin chào'}</h1>
                        <div className='d-flex gap-3'>
                            <p className='fw-bold'>{filteredTours.length} tour</p>
                        </div>
                        <p>{selectedLocation?.description || "Bắt Đầu Hành Trình Của Bạn Khám Phá Việt Nam Theo Cách Riêng"}</p>
                    </Col>
                    <Col lg={6}>
                        <iframe
                            src={selectedLocation?.mapHtml || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7864731.700104102!2d100.61635744583909!3d15.740501300528281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2sVietnam!5e0!3m2!1sen!2s!4v1733335793286!5m2!1sen!2s"}
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '10px' }}
                            allowFullScreen="true"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </Col>
                </Row>

                <div className='px-5 pt-3'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='fw-bold mt-4 mb-5'>Danh sách tour du lịch</h3>
                        <Dropdown>
                            <Dropdown.Toggle variant='outline-dark' className='rounded-5'>
                                Bộ lọc
                            </Dropdown.Toggle>
                            <Dropdown.Menu align={'end'} style={{ width: '500px', padding: '25px 20px', marginTop: '10px' }}>
                                <h6>Tên tour</h6>
                                <Form.Control
                                    type='text'
                                    placeholder='Tìm kiếm tour...'
                                    value={filters.tourName}
                                    onChange={(e) => setFilters({ ...filters, tourName: e.target.value })}
                                />
                                <h6>Ngày khởi hành</h6>
                                <Form.Control
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                                <h6>Khoảng giá</h6>
                                <div className='d-flex gap-2'>
                                    <Form.Control
                                        type="number"
                                        placeholder="Giá từ"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            priceRange: [Number(e.target.value), filters.priceRange[1]],
                                        })}
                                    />
                                    <Form.Control
                                        type="number"
                                        placeholder="Giá đến"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            priceRange: [filters.priceRange[0], Number(e.target.value)],
                                        })}
                                    />
                                </div>
                                <h6>Giới tính</h6>
                                <Form.Select
                                    aria-label="Chọn giới tính"
                                    value={filters.gender}
                                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="NAM">Nam</option>
                                    <option value="NU">Nữ</option>
                                    <option value="KHAC">Khác</option>
                                </Form.Select>
                                <h6>Số sao</h6>
                                <Form.Select
                                    aria-label="Chọn số sao"
                                    value={filters.rating}
                                    onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                                >
                                    <option value={0}>0 sao</option>
                                    <option value={1}>1 sao</option>
                                    <option value={2}>2 sao</option>
                                    <option value={3}>3 sao</option>
                                    <option value={4}>4 sao</option>
                                    <option value={5}>5 sao</option>
                                </Form.Select>

                                <h6>Số lượng kết nối</h6>
                                <div className='d-flex gap-2'>
                                    <Form.Control
                                        type="number"
                                        placeholder="Từ"
                                        value={filters.connectionsRange[0]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            connectionsRange: [Number(e.target.value), filters.connectionsRange[1]],
                                        })}
                                    />
                                    <Form.Control
                                        type="number"
                                        placeholder="Đến"
                                        value={filters.connectionsRange[1]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            connectionsRange: [filters.connectionsRange[0], Number(e.target.value)],
                                        })}
                                    />
                                </div>
                                <h6>Sở thích</h6>
                                <div className="d-flex gap-2 flex-wrap">
                                    {allHobbies.map((hobby) => (
                                        <Button
                                            key={hobby.id}
                                            variant={selectedHobbies.includes(hobby.name) ? 'success' : 'outline-secondary'}
                                            onClick={() => handleHobbySelect(hobby.name)}
                                            className="m-1"
                                        >
                                            {hobby.name}
                                        </Button>
                                    ))}
                                </div>
                                <Button onClick={resetFilters}>Làm mới</Button>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="container_tours">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <Row className="w-100 d-flex m-0 mb-3" key={index}>
                                    <Col lg={3}>
                                        <Placeholder as="div" animation="wave">
                                            <Placeholder xs={12} className="tour-image" />
                                        </Placeholder>
                                    </Col>
                                    <Col lg={5} className="d-flex align-items-center">
                                        <div className="info_tour_container d-flex flex-column w-100">
                                            <Placeholder as="h5" animation="wave" className="m-0">
                                                <Placeholder xs={6} />
                                            </Placeholder>
                                            <Placeholder as="p" animation="wave" className="m-0 d-flex align-items-center gap-2">
                                                <Placeholder xs={4} />
                                            </Placeholder>
                                            <Placeholder as="p" animation="wave" className="m-0 d-flex align-items-center gap-2">
                                                <Placeholder xs={5} />
                                            </Placeholder>
                                            <Placeholder as="p" animation="wave" className="m-0 d-flex align-items-center gap-2">
                                                <Placeholder xs={6} />
                                            </Placeholder>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <Placeholder as="p" animation="wave" className="tour-description">
                                                    <Placeholder xs={8} />
                                                </Placeholder>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={2} className="d-flex align-items-center">
                                        <div className="d-flex justify-content-between align-items-end">
                                            <Placeholder as="p" animation="wave" className="tour-price w-100">
                                                <Placeholder xs={4} />
                                            </Placeholder>
                                        </div>
                                    </Col>
                                    <Col lg={2} className="d-flex flex-column align-items-center">
                                        <Placeholder as="div" animation="wave">
                                            <Placeholder xs={12} className="local-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                        </Placeholder>
                                        <Placeholder as="label" animation="wave" className="fw-semibold mb-0">
                                            <Placeholder xs={5} />
                                        </Placeholder>
                                        <Placeholder as="p" animation="wave" className="m-0">
                                            <Placeholder xs={6} />
                                        </Placeholder>
                                        <div className="d-flex gap-2 m-0 p-0 align-items-center">
                                            <Placeholder as="p" animation="wave" className="m-0">
                                                <Placeholder xs={2} />
                                            </Placeholder>
                                            <Placeholder as="div" animation="wave">
                                                <Placeholder xs={3} />
                                            </Placeholder>
                                        </div>
                                        <Placeholder as="p" animation="wave">
                                            <Placeholder xs={7} />
                                        </Placeholder>
                                        <Placeholder as="p" animation="wave">
                                            <Placeholder xs={4} />
                                        </Placeholder>
                                    </Col>
                                </Row>
                            ))
                        ) : filteredTours.length > 0 ? (
                            filteredTours.map((tour) => <TourCard key={tour.TourId} tour={tour} />)
                        ) : (
                            <div>Không có dữ liệu tour</div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Destination;
