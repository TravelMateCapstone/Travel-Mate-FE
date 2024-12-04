import React, { useState, useEffect } from 'react'
import '../../assets/css/Destination/Destination.css'
import Navbar from '../../components/Shared/Navbar'
import { Button, Col, Row, Dropdown, Form } from 'react-bootstrap'
import { id } from 'date-fns/locale'
import TourCard from '../../components/Destination/TourCard'
import Tag from '../../components/Destination/Tag'
import { useLocation } from 'react-router-dom'
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

    const tours = [
        {
            id: 1,
            name: 'Tour Phú Quốc 5 ngày 4 đêm',
            description: 'Phú Quốc là một hòn đảo xinh đẹp với các bãi biển cát trắng và làn nước trong xanh. Đây là điểm đến lý tưởng để thư giãn, khám phá thiên nhiên và thưởng thức hải sản tươi ngon.',
            destination: 'Phú Quốc',
            duration: '5 ngày 4 đêm',
            participants: 20,
            price: formatPrice(3500000),
            image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGR1JTIwbCVFMSVCQiU4QmNoJTIwcGh1JTIwcXVvY3xlbnwwfHwwfHx8MA%3D%3D',
            localName: 'Lê Thị Lan Anh',
            localAvatar: 'https://cdn.vietnam.vn/wp-content/uploads/2024/07/Ly-do-Anh-Tu-noi-bat-o-Anh-trai-say.jpg',
            rating: 4.9,
            trip: 30,
            timeParticipate: '2023-08-20',
            localLocation: 'Phú Quốc',
        },
        {
            id: 2,
            name: 'Tour Phú Quốc 5 ngày 4 đêm',
            description: 'Phú Quốc là một hòn đảo xinh đẹp với các bãi biển cát trắng và làn nước trong xanh. Đây là điểm đến lý tưởng để thư giãn, khám phá thiên nhiên và thưởng thức hải sản tươi ngon.',
            destination: 'Phú Quốc',
            duration: '5 ngày 4 đêm',
            participants: 20,
            price: formatPrice(3500000),
            image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGR1JTIwbCVFMSVCQiU4QmNoJTIwcGh1JTIwcXVvY3xlbnwwfHwwfHx8MA%3D%3D',
            localName: 'Lê Thị Lan Anh',
            localAvatar: 'https://cdn.vietnam.vn/wp-content/uploads/2024/07/Ly-do-Anh-Tu-noi-bat-o-Anh-trai-say.jpg',
            rating: 4.9,
            trip: 30,
            timeParticipate: '2023-08-20',
            localLocation: 'Phú Quốc',
        },
        {
            id: 3,
            name: 'Tour Phú Quốc 5 ngày 4 đêm',
            description: 'Phú Quốc là một hòn đảo xinh đẹp với các bãi biển cát trắng và làn nước trong xanh. Đây là điểm đến lý tưởng để thư giãn, khám phá thiên nhiên và thưởng thức hải sản tươi ngon.',
            destination: 'Phú Quốc',
            duration: '5 ngày 4 đêm',
            participants: 20,
            price: formatPrice(3500000),
            image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGR1JTIwbCVFMSVCQiU4QmNoJTIwcGh1JTIwcXVvY3xlbnwwfHwwfHx8MA%3D%3D',
            localName: 'Lê Thị Lan Anh',
            localAvatar: 'https://cdn.vietnam.vn/wp-content/uploads/2024/07/Ly-do-Anh-Tu-noi-bat-o-Anh-trai-say.jpg',
            rating: 4.9,
            trip: 30,
            timeParticipate: '2023-08-20',
            localLocation: 'Phú Quốc',
        },
        {
            id: 4,
            name: 'Tour Nha Trang 3 ngày 2 đêm',
            description: 'Nha Trang là thành phố biển nổi tiếng với bãi biển dài, cát trắng và những hòn đảo xinh đẹp. Các hoạt động như lặn biển, tham quan tháp Bà Ponagar hay thưởng thức hải sản đặc sản là những điểm nổi bật của chuyến đi.',
            destination: 'Nha Trang',
            duration: '3 ngày 2 đêm',
            participants: 12,
            price: formatPrice(2200000),
            image: 'https://media.istockphoto.com/id/1744623865/photo/chua-long-son-pagoda-temple-in-nha-trang-vietnam.webp?a=1&b=1&s=612x612&w=0&k=20&c=80nuMaq4y366whXjl9ttVPWScohJ4JeQH5mPl4uqfbs=',
            localName: 'Phạm Minh Tuấn',
            localAvatar: 'https://images2.thanhnien.vn/528068263637045248/2024/1/10/truong-giang-56-1704913245711242412702.jpg',
            rating: 4.6,
            trip: 15,
            timeParticipate: '2023-07-05',
            localLocation: 'Nha Trang',
        },
        {
            id: 5,
            name: 'Tour Sapa 2 ngày 1 đêm',
            description: 'Sapa là một thị trấn vùng cao với cảnh quan tuyệt đẹp, những dãy núi xanh mướt, thung lũng mù sương và các bản làng của người dân tộc H\'Mông, Dao. Đây là nơi lý tưởng để thưởng thức khí hậu mát mẻ và khám phá văn hóa độc đáo.',
            destination: 'Sapa',
            duration: '2 ngày 1 đêm',
            participants: 8,
            price: formatPrice(1500000),
            image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRvdXIlMjBkdSUyMGwlRTElQkIlOEJjaCUyMHNhcGF8ZW58MHx8MHx8fDA%3D',
            localName: 'Hoàng Đức Quang',
            localAvatar: 'https://cafefcdn.com/thumb_w/640/203337114487263232/2023/8/22/avatar1692709004135-16927090046852041812399.jpg',
            rating: 4.4,
            trip: 12,
            timeParticipate: '2023-06-01',
            localLocation: 'Sapa',
        }
    ]

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
                    <h5 className='fw-bold mt-4'>Danh sách tour du lịch</h5>
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
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
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

                <div className='container_tours'>
                    {tours.map(tour => (
                        <TourCard tour={tour} />
                    ))}
                </div>

            </div>

        </div>
    )
}

export default Destination