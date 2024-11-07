import React from 'react';
import { Card, Image, Container, Nav, Dropdown } from 'react-bootstrap';

function PastTrips() {
  return (
    <Container className='p-3 border rounded-3'>
      <h2 className="mb-4 text-success fw-bold"><i className="bi bi-clipboard-check"></i> CHUYẾN ĐI</h2>

      <div className='mx-2'>
      </div>
      <Card className="p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Image
              src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
              roundedCircle
              className="me-3"
              style={{ width: '80px', height: '80px' }} // Adjust image size
            />
            <div>
              <div className="d-flex">
                <Card.Title className="mb-0 fw-bold mx-2">Tran Hai Dang</Card.Title>
                <Card.Text>tại Phố cổ Hội An, Quảng Nam</Card.Text>
              </div>
              <div className="mx-2">
                <Card.Link className="text-muted border rounded px-3 py-1 me-2 fs-6">
                  16 tháng 8
                </Card.Link>
              </div>
            </div>
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle as="div" id="dropdown-custom-components" style={{ cursor: 'pointer' }}>
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Chỉnh sửa</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Xóa</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Card.Text className='mt-3'>
          Hội An – phố cổ với những con hẻm nhỏ, đèn lồng lung linh và không khí yên bình. Mỗi góc phố đều mang trong mình dấu ấn thời gian, khiến mình như lạc vào một khung cảnh hoài cổ, thơ mộng. Đêm xuống, phố lên đèn, cảm giác thật bình yên và dịu dàng. Nhất định phải ghé thăm lần nữa! 🏮✨
        </Card.Text>

        {/* Styled image container */}
        <div className="d-flex align-items-center justify-content-start m-2">
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            className='me-3'
            style={{ width: '30%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            className='me-3'
            style={{ width: '30%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            className='me-3'
            style={{ width: '30%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>

        <Card.Title className='mb-0 fw-bold m-2'>Guest Review</Card.Title>
        <div className="d-flex align-items-center m-2">
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            roundedCircle
            className='me-3'
            style={{ width: '80px', height: '80px' }} // Adjust image size
          />
          <div>
            <div className='d-flex'>
              <Card.Title className='mb-0 fw-bold me-3'>Hai Dang</Card.Title>
              <div className='d-flex'>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
                <i class="bi bi-star"></i>
              </div>
            </div>
            <Card.Text className='text-muted'>Dien Ban, Quang Nam</Card.Text>
          </div>
        </div>
        <Card.Text >"Đăng là người bạn đồng hành tuyệt vời! Vui vẻ, thân thiện và rất am hiểu về Hội An. Nhờ cậu ấy mà chuyến đi của mình thêm phần thú vị. Rất vui được gặp và đi cùng bạn!"</Card.Text>

      </Card>


      <Card className="p-3 mb-3">
        <div className="d-flex align-items-center">
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            roundedCircle
            className='me-3'
            style={{ width: '80px', height: '80px' }} // Adjust image size
          />
          <div>
            <Card.Title className='mb-0 fw-bold'>Stunning nature beauty Da Nang City</Card.Title>
            <Card.Text>Hosted by Tran Hai Dang</Card.Text>
          </div>
        </div>

        <div className="d-flex mt-3">
          <Card.Link className='text-muted border rounded px-3 py-1 me-2'>
            Da Nang, Viet Nam
          </Card.Link>
          <Card.Link className='text-muted border rounded px-3 py-1 me-2'>
            1 Guest
          </Card.Link>
        </div>

        <Card.Text className='mt-3'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Potenti viverra dictum nunc natoque torquent ligula duis.
          Sit gravida imperdiet sem nec eget morbi sodales. Eros lacus lectus vulputate viverra lacinia dictumst dictumst.
          Iaculis dolor ad tortor praesent facilisi blandit ridiculus.
        </Card.Text>

        {/* Styled image container */}
        <div className="d-flex align-items-center justify-content-start m-2">
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            className='me-3'
            style={{ width: '50%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            className='me-3'
            style={{ width: '50%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>

        <Card.Title className='mb-0 fw-bold m-2'>Guest Review</Card.Title>
        <div className="d-flex align-items-center m-2">
          <Image
            src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
            roundedCircle
            className='me-3'
            style={{ width: '80px', height: '80px' }} // Adjust image size
          />
          <div>
            <div className='d-flex'>
              <Card.Title className='mb-0 fw-bold me-3'>Hai Dang</Card.Title>
              <div className='d-flex'>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
                <i class="bi bi-star"></i>
              </div>
            </div>
            <Card.Text className='text-muted'>Dien Ban, Quang Nam</Card.Text>
          </div>
        </div>
        <Card.Text >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Potenti viverra dictum nunc natoque torquent ligula duis.
          Sit gravida imperdiet sem nec eget morbi sodales. Eros lacus lectus vulputate viverra lacinia dictumst dictumst.</Card.Text>

      </Card>
    </Container>
  );
}

export default PastTrips;
