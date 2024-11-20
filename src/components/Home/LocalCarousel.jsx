import React, { useRef } from 'react'
import '../../assets/css/Shared/LocalCarousel.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function LocalCarousel() {
    const carouselRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
    };

    const handleMouseLeaveOrUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // reduce scroll speed
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const cardData = [
        { imgSrc: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg', title: 'Card Title 1', text: 'Quảng Nam' },
        { imgSrc: 'holder.js/100px180', title: 'Card Title 2', text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.' },
        { imgSrc: 'holder.js/100px180', title: 'Card Title 3', text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.' },
        { imgSrc: 'holder.js/100px180', title: 'Card Title 4', text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.' },
        { imgSrc: 'holder.js/100px180', title: 'Card Title 5', text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.' },
        { imgSrc: 'holder.js/100px180', title: 'Card Title 6', text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.' }
    ];

    return (
        <div className='local-carousel my-3' ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}>
            <div className='d-flex gap-3'>
                {cardData.map((card, index) => (
                    <Card key={index} className='carousel-card'>
                        <Card.Img variant="top" src={card.imgSrc} className='carousel-card-img' />
                        <Card.Body className='carousel-card-body position-relative'>
                            <div className='position-absolute bottom-0'>
                                <p>{card.title}</p>
                                <p>{card.text}</p>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default LocalCarousel