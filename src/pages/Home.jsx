import { useEffect, useState } from 'react';
import MapComponent from '../components/Shared/MapComponent';
import '../assets/css/Home/Home.css';
import { Col, Container, Row } from 'react-bootstrap';
import DestinationCard from '../components/Home/DestinationCard';
import ImageAccordionSlider from '../components/Home/ImageAccordionSlider';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../routes/RoutePath';
import TextareaAutosize from 'react-textarea-autosize';
function Home() {
  const [destinations, setDestinations] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const words = [
    'Bạn phân vân không biết nên đi đâu ?',
    'Hãy mô tả điểm đến của bạn...',
    'Chúng tôi sẽ chọn lọc điểm đến phù hợp với bạn...',
  ];
  const [placeholder, setPlaceholder] = useState('');
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
  useEffect(() => {
    const typeWriterEffect = () => {
      const currentWord = words[wordIndex]; // Lấy câu hiện tại trong mảng `words`
      if (charIndex < currentWord.length) {
        setPlaceholder((prev) => prev + currentWord[charIndex]); // Thêm chữ mới vào placeholder
        setCharIndex((prev) => prev + 1); // Tăng chỉ số vị trí ký tự
      } else {
        // Chuyển sang câu tiếp theo khi hoàn thành câu hiện tại
        setTimeout(() => {
          setCharIndex(0); // Đặt lại vị trí ký tự
          setWordIndex((prev) => (prev + 1) % words.length); // Chuyển đến câu tiếp theo, quay lại đầu nếu hết mảng
          setPlaceholder(''); // Xóa nội dung của placeholder khi chuyển câu
        }, 1500); // Thời gian nghỉ giữa các câu (1.5s)
      }
    };

    const interval = setInterval(typeWriterEffect, 150); // Tốc độ gõ chữ (150ms cho mỗi ký tự)

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [charIndex, wordIndex]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResult(null);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    fetch(`https://travelmateapp.azurewebsites.net/api/LocationPredict/predict?query=${query}`)
      .then(response => response.json())
      .then(data => {
        setSearchResult(data.$values);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching search result:', error);
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchResultClick = (result) => {
    navigate(RoutePath.DESTINATION, { state: { selectedLocation: result } });
  };

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
        }}>Trải nghiệm hành trình để ghi dấu chân trên bản đồ quê hương.</h1>
        <div className="home-map-container">
          <MapComponent />
          <div className="home-statistics">
            <div className="stat-item">
              <h3>
                {localStorage.getItem('selectedNames') ? JSON.parse(localStorage.getItem('selectedNames')).length : 0}/63
              </h3>
              <h3>Tỉnh thành</h3>
            </div>
            <div className="border-1"></div>
            <div className="stat-item">
              <h3>
                {localStorage.getItem('selectedNames') ? (JSON.parse(localStorage.getItem('selectedNames')).length / 63 * 100).toFixed(2) : 0} %
              </h3>
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
              color: '#34A853',
            }}>Bắt Đầu Hành Trình Của Bạn</p>
            <p className='fw-semibold' style={{
              fontSize: '32px',
              color: '#34A853',
            }}>Khám Phá Việt Nam Theo Cách Riêng</p>
            <div style={{
              height: '70px',
            }}>
              <p className='fw-medium' style={{ fontSize: '20px', lineHeight: '1.6' }}>
                Nhập từ khóa và để tính năng gợi ý thông minh của chúng tôi giúp bạn nhanh chóng tìm thấy điểm đến lý tưởng một cách dễ dàng và tiện lợi!</p></div>
            <div className='mt-4 d-flex gap-3'>
              <TextareaAutosize
              style={{
              }}
                minRows={3}
                type="text"
                className="w-100 search_AI_input"
                placeholder={placeholder}
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress} 
              />

            </div>
            {isLoading && (
              <div className="search-result mt-4">
                <strong>Đang tìm kiếm...</strong>
              </div>
            )}
            {searchResult && !isLoading && (
              <div className="search-result mt-4">
                <strong>Kết quả tìm kiếm</strong>
                {searchResult.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleSearchResultClick(result)}
                    style={{ cursor: 'pointer' }}
                    className="search-result-item"
                  >
                    <p><strong style={{
                      color: '#34A853',
                    }}>{result.title}</strong> {result.description}</p>
                  </div>
                ))}
              </div>
            )}
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
        height: '740px',
        paddingTop: '100px',
        marginTop: '51px',
      }}>
        <h2 className='text-center fw-bold'>Các địa điểm nổi bật</h2>
        <p className='text-center'>Địa điểm ưa thích bởi khách du lịch.</p>
        <Container style={{
          marginTop: '40px',
        }}>
          <h2 className='text-center fw-bold'></h2>
          <Row style={{ height: '250px' }}>
            {destinations.map((destination, index) => (
              <DestinationCard key={index} destination={destination} />
            ))}
          </Row>
        </Container>
      </div>

      <div style={{
        marginBottom: '50px',
      }}> <ImageAccordionSlider /></div>
    </>
  );
}

export default Home;
