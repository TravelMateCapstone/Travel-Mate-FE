import React, { useState, useEffect } from 'react'
import '../../assets/css/Destination/Destination.css'
import Navbar from '../../components/Shared/Navbar'
import { Button, Col, Row, Dropdown, Form } from 'react-bootstrap'
import { id } from 'date-fns/locale'
import TourCard from '../../components/Destination/TourCard'
import Tag from '../../components/Destination/Tag'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Destination() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [rating, setRating] = useState(1);
    const [age, setAge] = useState(18);
    const [connections, setConnections] = useState(1);
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(100);
    const [minConnections, setMinConnections] = useState(1);
    const [maxConnections, setMaxConnections] = useState(10000);
    const [tags, setTags] = useState(['Thể thao', 'Âm nhạc', 'Ẩm thực']);
    const location = useLocation();
    const selectedLocation = location.state?.selectedLocation || JSON.parse(localStorage.getItem('selectedLocation'));

    useEffect(() => {
        if (selectedLocation) {
            console.log('Địa điểm được chọn: ', selectedLocation);
        }
    }, [selectedLocation]);


    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleToggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const handleClearAllTags = () => {
        setTags([]);
    };


    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };

    const handleConnectionsChange = (e) => {
        setConnections(e.target.value);
    };

    const handleMinAgeChange = (e) => {
        setMinAge(e.target.value);
    };

    const handleMaxAgeChange = (e) => {
        setMaxAge(e.target.value);
    };

    const handleMinConnectionsChange = (e) => {
        setMinConnections(e.target.value);
    };

    const handleMaxConnectionsChange = (e) => {
        setMaxConnections(e.target.value);
    };

    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchkey = useSelector(state => state.search.searchKey);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch(`https://travelmateapp.azurewebsites.net/api/FilterToursWOO/GetAllTour-WithUserDetails-ByLocation?location=${selectedLocation.locationName}`);
                const data = await response.json();
                console.log("data", data);
                setTours(data || []);
                setLoading(false);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải dữ liệu');
                setLoading(false);
            }
        };

        fetchTours();
    }, [selectedLocation]);

    return (
        <div>
            <Navbar />
            <img
                src={selectedLocation?.image || "https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2017/10/26015647/dich-vu-thiet-ke-banner-du-lich-chuyen-nghiep-tai-ha-noi4.jpg"}
                alt="image"
                className='w-100 object-fit-cover'
                height={586}
            />

            <div className='p-5'>
                <Row>
                    <Col lg={6}>
                        <h2 className='fw-bold'>{selectedLocation ? selectedLocation?.locationName + ", chào đón bạn" : "Chào mừng bạn khám phá Việt Nam"}</h2>
                        <div className='d-flex gap-3'>
                            <p>334 tour</p>
                            <p>334 tour</p>
                            <p>334 tour</p>
                        </div>
                        <p>{selectedLocation?.description || "Bắt Đầu Hành Trình Của Bạn Khám Phá Việt Nam Theo Cách Riêng"}</p>
                    </Col>
                    <Col lg={6}>
                        <iframe
                            src={selectedLocation?.mapHtml || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7864731.700104102!2d100.61635744583909!3d15.740501300528281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2sVietnam!5e0!3m2!1sen!2s!4v1733335793286!5m2!1sen!2s"}
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />


                    </Col>
                </Row>

                {/* Thông tin tours */}
                <div className='d-flex justify-content-between align-items-center'>
                    <h5 className='fw-bold mt-4 mb-4'>Danh sách tour du lịch</h5>
                    <Dropdown show={showDropdown} onToggle={handleToggleDropdown}>
                        <Dropdown.Toggle variant='outline-dark' className='rounded-5'>
                            Bộ lọc
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            padding: '25px 20px',
                        }}>
                            <Form.Control type='text' placeholder='Nhập điểm đến...' style={{
                                width: '377px',
                                marginBottom: '20px',
                            }} />
                            <h6>Giới tính</h6>
                            <Form.Select aria-label="Default select example" className='mb-2'>
                                <option>Chọn giới tính</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                                <option value="3">Khác</option>
                            </Form.Select>
                            <h6>Số sao <span>{rating}</span></h6>
                            <Form.Range min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} className='star-range' />
                            <h6>Độ tuổi <span>{minAge} - {maxAge}</span></h6>
                            <div className="range-container">
                                <Form.Range min={18} max={100} value={minAge} onChange={handleMinAgeChange} className="custom-range" />
                                <Form.Range min={18} max={100} value={maxAge} onChange={handleMaxAgeChange} className="custom-range" />
                            </div>
                            <h6>Số lượng kết nối <span>{minConnections} - {maxConnections}</span></h6>
                            <div className="range-container">
                                <Form.Range min={1} max={10000} value={minConnections} onChange={handleMinConnectionsChange} className="custom-range" />
                                <Form.Range min={1} max={10000} value={maxConnections} onChange={handleMaxConnectionsChange} className="custom-range" />
                            </div>
                            <h6>Tiện nghi</h6>
                            <div className='mb-3'>
                                <Form.Check
                                    type='checkbox'
                                    label={<div className='ms-2'>
                                        <h6 className='m-0'>Chỗ ngủ cho du khách</h6>
                                        <small>Nơi ngủ thoải mái cho du khách, có thể là giường riêng hoặc nệm trải trên sàn.</small>
                                    </div>}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label={<div className='ms-2'>
                                        <h6 className='m-0'>Phương tiện di chuyển</h6>
                                        <small>Người địa phương có thể cung cấp xe đạp để du khách có thể tự do khám phá khu vực.</small>
                                    </div>}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label={<div className='ms-2'>
                                        <h6 className='m-0'>Chỗ ngủ cho du khách</h6>
                                        <small>Nơi ngủ thoải mái cho du khách, có thể là giường riêng hoặc nệm trải trên sàn.</small>
                                    </div>}
                                />
                            </div>
                            <Form.Control type='text' placeholder='Thêm sở thích...' style={{
                                width: '377px',
                                marginBottom: '20px',
                            }} />
                            <div className="container_tag_hobbies d-flex gap-2 flex-wrap">
                                {tags.map((tag, index) => (
                                    <Tag
                                        key={index}
                                        label={tag}
                                        onRemove={() => handleRemoveTag(tag)}
                                    />
                                ))}
                            </div>
                            <p
                                className='text-success mb-0 mt-2'
                                style={{ cursor: 'pointer' }}
                                onClick={handleClearAllTags}
                            >
                                xóa tất cả
                            </p>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="container_tours">
                    {tours.length > 0 ? (
                        tours.map((tour) => <TourCard key={tour.TourId} tour={tour} />)
                    ) : (
                        <div>Không có dữ liệu tour</div>
                    )}
                </div>

            </div>

        </div>
    )
}

export default Destination