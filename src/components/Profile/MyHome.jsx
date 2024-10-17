import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../../assets/css/Profile/MyHome.css";

function MyHome() {
  return (
    <Container className='py-3 px-0 border-0 rounded-5'  style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }}>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">NHÀ CỦA TÔI</h2>

      <div className="mb-3 ms-lg-4 rounded-3 cus-prioritize">
        <h4 className="mx-4 mt-3">ƯU TIÊN</h4>
        <div className="px-3">
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="people-outline" style={{
              fontSize: '16px'
            }}></ion-icon> <p className='fw-medium'>Số lượng khách tối đa: 2</p>
          </div>
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="male-female-outline" style={{
              fontSize: '16px'
            }}></ion-icon> <p className='fw-medium'>Giới tính tôi muốn đón: Bất kỳ</p>
          </div>
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="logo-no-smoking" style={{
              fontSize: '16px'
            }}></ion-icon> <p className='fw-medium'>Số lượng khách tối đa: 2</p>
          </div>
        </div>
      </div>

      <div className="mb-3 ms-lg-4 rounded-3 cus-home">
        <h4 className="mx-4 mt-3">NƠI TÁ TÚC</h4>
        <div className="px-3">
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="bed-outline" style={{
              fontSize: '24px'
            }}></ion-icon> <p className='fw-medium m-0' style={{
              fontSize: '20px'
            }}>Phòng đơn</p>
          </div>
          <p className="small ms-3" style={{
            fontSize: '20px',
          }}>
            Sofa in the living room or private room
          </p>
          <hr />
        </div>

      </div>

      <div className="mb-3 ms-lg-4 rounded-3 cus-details">
        <h4 className="mx-4 mt-3">CHI TIẾT</h4>
        <div className="px-3">
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="accessibility-outline" style={{
              fontSize: '24px'
            }}></ion-icon> <p className='fw-medium m-0' style={{
              fontSize: '20px'
            }}>Phòng đơn</p>
          </div>
          <p className="small ms-5" style={{
            fontSize: '20px'
          }}>Sofa ở phòng khách, riêng tư</p>

          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="link-outline" style={{
              fontSize: '24px'
            }}></ion-icon> <p className='fw-medium m-0' style={{
              fontSize: '20px'
            }}>Phòng đơn</p>
          </div>
          <p className="small ms-5" style={{
            fontSize: '20px'
          }}>Một nơi để ngủ, bếp miễn phí, phòng tắm miễn phí, wifi, thời gian của tôi và người đi cùng</p>

          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="bus-outline" style={{
              fontSize: '24px'
            }}></ion-icon> <p className='fw-medium m-0' style={{
              fontSize: '20px'
            }}>Phương tiện di chuyển</p>
          </div>
          <p className="small ms-5" style={{
            fontSize: '20px'
          }}>Tôi có xe đạp, phương tiện giao thông công cộng</p>


          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="add-circle-outline" style={{
              fontSize: '24px'
            }}></ion-icon> <p className='fw-medium m-0' style={{
              fontSize: '20px'
            }}>Thông tin bổ sung</p>
          </div>
          <p className="small ms-5" style={{
            fontSize: '20px'
          }}>Hãy thoải mái hỏi tôi bất cứ điều gì. Chào mừng!</p>
        </div>
      </div>

      <div className="mb-3 ms-lg-4 rounded-3 cus-images">
        <h5 className="mx-4 mt-3 d-flex">HÌNH ẢNH NHÀ CỦA BẠN</h5>
        <Row className="px-3 py-3">
          <Col xs={12} md={4} className="mb-3">
            <img src="https://via.placeholder.com/300" alt="House 1" className="img-fluid rounded-3" />
          </Col>
          <Col xs={12} md={4} className="mb-3">
            <img src="https://via.placeholder.com/300" alt="House 2" className="img-fluid rounded-3" />
          </Col>
          <Col xs={12} md={4} className="mb-3">
            <img src="https://via.placeholder.com/300" alt="House 3" className="img-fluid rounded-3" />
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default MyHome;
