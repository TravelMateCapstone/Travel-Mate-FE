import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import '../../assets/css/Shared/CarouselComponent.css'; // Thêm file CSS để định dạng

function CarouselComponent({ images }) {
    return (
        <Container fluid className="banner-container">
            <Carousel indicators={false} controls={false} fade>
                {images.map((item, index) => {
                    return (
                        <Carousel.Item key={index}>
                            <img
                                src={item}
                                alt=""
                                className="banner-container object-fit-cover w-100"
                                height={600}
                            />
                            <Carousel.Caption>
                                <div className="carousel-caption-content">
                                    <h1 className="carousel-title">VIET NAM</h1>
                                    <p className="carousel-subtitle">Hãy cùng khám phá những địa danh nổi tiếng và cảnh sắc tuyệt vời của đất nước Việt Nam.</p>
                                    <button className="carousel-button">
                                        <h5 className='header-text-subtitle fw-bold text-black'>Khám phá ngay</h5>
                                        <p className='small-text-subtitle fw-light fst-italic'>Tham gia kết nối với người bản địa với những trải nghiệm độc đáo</p>
                                    </button>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        </Container>
    );
}

export default CarouselComponent;