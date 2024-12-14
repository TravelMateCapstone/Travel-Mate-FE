import React, { useEffect, useState } from 'react';
import MapComponent from '../components/Shared/MapComponent';
import '../assets/css/Home/Home.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Destination from './Destination/Destination';
import DestinationCard from '../components/Home/DestinationCard';
import ImageAccordionSlider from '../components/Home/ImageAccordionSlider';

function Home() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch('https://travelmateapp.azurewebsites.net/api/Locations')
      .then(response => response.json())
      .then(data => {
        const randomDestinations = data.$values.sort(() => 0.5 - Math.random()).slice(0, 8);
        setDestinations(randomDestinations.map(location => ({
          locationName: location.locationName,
          tours: Math.floor(Math.random() * 50) + 1,
          imageUrl: location.image
        })));
      })
      .catch(error => console.error('Error fetching destinations:', error));
  }, []);

  const explore_now = () => {
    
  }


  return (
    <>
      <div className="home-background">
      </div>
      <div className="home-header">
        <h1 style={{
          fontSize: '36px',
          fontWeight: '500',
          marginTop: '28px',
          fontFamily: 'Play fair Display',
          letterSpacing: '-0.5%',
        }}>Khám phá Việt Nam qua góc nhìn người địa phương</h1>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '400',
          letterSpacing: '-0.5%',
        }}>Trải nghiệm chân thật, kỷ niệm đáng nhớ!</h1>
        <div className="home-map-container">
          <MapComponent />
          <div className="home-statistics">
            <div className="stat-item">
              <h3>2/63</h3>
              <h3>Tỉnh thành</h3>
            </div>
            <div className="border-1"></div>
            <div className="stat-item">
              <h3>3.17%</h3>
              <h3>Việt Nam</h3>
            </div>
          </div>
        </div>
      </div>

      <div className='container_content_home mt-5'>
        <Row>
          <Col lg={6}>
            <p className='fw-semibold m-0' style={{
              fontSize: '32px',
            }}>Bắt Đầu Hành Trình Của Bạn</p>
            <p className='fw-semibold' style={{
              fontSize: '32px',
            }}>Khám Phá Việt Nam Theo Cách Riêng</p>
            <p>Hãy để những người địa phương đồng hành cùng bạn trên hành trình khám phá Việt Nam một cách độc đáo và chân thực nhất. Chọn những chuyến đi được thiết kế riêng, từ phố thị sôi động đến làng quê yên bình. Mỗi trải nghiệm không chỉ là một chuyến du lịch mà còn là một câu chuyện đáng nhớ, nơi bạn cảm nhận được văn hóa, con người, và vẻ đẹp nguyên sơ của đất nước hình chữ S.</p>
            <button className='mt-5 button_explore'>
              Khám phá ngay
            </button>
          </Col>
          <Col lg={6}>
            <div className='w-100 d-flex justify-content-end gap-5'>
              <div className='d-flex flex-column gap-5'>
                <img width={355} height={185} src="https://media.istockphoto.com/id/2183694328/photo/man-and-woman-traveling-by-scooter-on-tea-plantations-in-sri-lanka.webp?a=1&s=612x612&w=0&k=20&c=KoYYdR9EvfPaSXt4ROoMhlZawh0qv5dsBMTnpnd2-Rw=" alt="" className='rounded-3 object-fit-cover' />
                <img width={355} height={185} src="https://media.istockphoto.com/id/1222720004/vi/anh/thuy%E1%BB%81n-du-l%E1%BB%8Bch-t%E1%BA%A1i-th%C3%A0nh-ph%E1%BB%91-h%E1%BB%99i-an-%E1%BB%9F-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=dZj0p4FaF3Fh4PPGcS6aeVwCDIonIg5mfBj392cfQQU=" alt="" className='rounded-3  object-fit-cover' />
              </div>
              <div className='d-flex flex-column mt-5 gap-5'>
                <img width={355} height={185} src="https://media.istockphoto.com/id/513806302/vi/anh/m%E1%BB%99t-nh%C3%B3m-nh%E1%BB%8F-kh%C3%A1ch-du-l%E1%BB%8Bch-%C4%91i-b%E1%BB%99-%C4%91%C6%B0%E1%BB%9Dng-d%C3%A0i-tr%C3%AAn-c%C3%A1nh-%C4%91%E1%BB%93ng-l%C3%BAa-%E1%BB%9F-sri-lanka.jpg?s=612x612&w=0&k=20&c=-cfUPGOI9XocmL2HmBG8pmcjsjLmldeK1lZZVenyHHs=" alt="" className='rounded-3  object-fit-cover' />
                <img width={355} height={185} src="https://media.istockphoto.com/id/470770644/photo/hut-in-the-mountain.webp?a=1&s=612x612&w=0&k=20&c=u7s376SuDOUwhn51MTcuea_q4m5awNgUw8MuFJiaSOY=" alt="" className='rounded-3  object-fit-cover' />
              </div>
            </div>
          </Col>
        </Row>

      </div>
      <div className='' style={{
        backgroundColor: '#F9F9F9',
        height: '619px',
        paddingTop: '100px',
        marginTop: '51px',
      }}>
        <h2 className='text-center fw-bold'>Các địa điểm nổi bật</h2>
        <p className='text-center'>Địa điểm ưa thích bởi khách du lịch.</p>
        <Container style={{
          marginTop: '40px',
        }}>
          <h2 className='text-center fw-bold'></h2>
          <Row>
            {destinations.map((destination, index) => (
              <DestinationCard key={index} destination={destination} />
            ))}
          </Row>
        </Container>
      </div>

      <ImageAccordionSlider />
    </>
  );
}

export default Home;
