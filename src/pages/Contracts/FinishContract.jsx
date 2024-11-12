import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

function FinishContract() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="">
      <Row>
        <Col
          className='rounded-top-4'
          lg={12}
          style={{
            borderLeft: "1px solid #CCCCCC",
            borderRight: "1px solid #CCCCCC",
            borderTop: "1px solid #CCCCCC",
            padding: "15px 25px",
            display: "flex",
            alignContent: "center",
            gap: "15px",
          }}
        >
          <ion-icon
            name="location-outline"
            style={{
              fontSize: "24px",
            }}
          ></ion-icon>{" "}
          <p className="m-0">Địa điểm</p>
          <p className="m-0 fw-medium">Quảng Trị</p>
        </Col>
      </Row>
      <Row
        style={{
          border: "1px solid #CCCCCC",
        }}
      >
        <Col
          lg={6}
          className=""
          style={{
            borderRight: "1px solid #CCCCCC",
            padding: "25px",
          }}
        >
          <h6>Khách du lịch</h6>
          <div className="">
            <div className="d-flex gap-2">
              <img
                src={user.avatarUrl || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw'}
                alt="avatar"
                className="rounded-circle object-fit-cover"
                height={60}
                width={60}
              />
              <div>
                <p className="m-0 fw-bold">{user.username}</p>
                <sub className="fw-medium">Quảng Nam</sub>
              </div>
            </div>
          </div>
        </Col>
        <Col
          lg={6}
          style={{
            padding: "25px",
          }}
        >
          <h6>Người địa phương</h6>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <img
                src={
                  "https://thanhnien.mediacdn.vn/Uploaded/game/st.game.thanhnien.com.vn/image/phaquan123/tao-thao.jpg"
                }
                alt="avatar"
                className="rounded-circle object-fit-cover"
                height={60}
                width={60}
              />
              <div>
                <p className="m-0 fw-bold">{"Tào tháo"}</p>
                <sub className="fw-medium">Quảng Nam</sub>
              </div>
            </div>
            <div className='d-flex gap-4 flex-column align-items-end'>
              <sub>Đánh giá người địa phương</sub>
              <div className='d-flex gap-4' style={{
                color: '#FFD600'
              }}>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star-outline"></ion-icon>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row
        className="rounded-bottom-4"
        style={{
          border: "1px solid #CCCCCC",
          borderTop: '0px'
        }}
      >
        <Col
          lg={6}
          className=""
          style={{
            borderRight: "1px solid #CCCCCC",
            padding: "10px 25px",
          }}
        >
          <h5 className="">Nội dung bài viết</h5>
          <textarea className='w-100' />
          <h5>Ảnh chuyến đi</h5>

          <Button variant='outline-secondary' className='rounded-5' onClick={() => document.getElementById('upload_img_traveller').click()}>Nhấn vào đây để upload</Button>
          <input type="file" className='d-none' id='upload_img_traveller' multiple />
          <div className='row mt-3'>
            <div className='col col-lg-4 mb-4'>
              <img src='https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/3ce14bf1a4e6d5ebfd34553bfd74ff80aaac0275-1280x720.jpg' alt='' className='w-100 rounded-4 object-fit-cover' />
            </div>

            <div className='col col-lg-4 mb-4'>
              <img src='https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/3ce14bf1a4e6d5ebfd34553bfd74ff80aaac0275-1280x720.jpg' alt='' className='w-100 rounded-4 object-fit-cover' />
            </div>

            <div className='col col-lg-4 mb-4'>
              <img src='https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/3ce14bf1a4e6d5ebfd34553bfd74ff80aaac0275-1280x720.jpg' alt='' className='w-100 rounded-4 object-fit-cover' />
            </div>

            <div className='col col-lg-4 mb-4'>
              <img src='https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/3ce14bf1a4e6d5ebfd34553bfd74ff80aaac0275-1280x720.jpg' alt='' className='w-100 rounded-4 object-fit-cover' />
            </div>

            <div className='col col-lg-4 mb-4'>
              <img src='https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/3ce14bf1a4e6d5ebfd34553bfd74ff80aaac0275-1280x720.jpg' alt='' className='w-100 rounded-4 object-fit-cover' />
            </div>

            <div className='col col-lg-4 mb-4'>
              <img src='https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/3ce14bf1a4e6d5ebfd34553bfd74ff80aaac0275-1280x720.jpg' alt='' className='w-100 rounded-4 object-fit-cover' />
            </div>

          </div>

        </Col>
        <Col
          lg={6}
          style={{
            padding: "25px",
          }}
        >
          <h5 className="">Đánh giá của người địa phương</h5>
          <div className="mt-2 d-flex flex-column">
            <div className="d-flex flex-column">
              <h6>Ngày 1 : Đông Hà - Thành cổ và sông Bến Hải</h6>
              <ul>
                <li>Sáng: Thăm Thành cổ Quảng Trị, nơi ghi dấu ấn lịch sử cuộc chiến 81 ngày đêm khốc liệt</li>
                <li>Trưa: Thưởng thức đặc sản địa phương tại Đông Hà như bún hến, bánh bột lọc, bún mắm nêm.</li>
                <li>Chiều: Ghé cầu Hiền Lương và sông Bến Hải - biểu tượng chia cắt Bắc Nam một thời.</li>
              </ul>
            </div>

            <div className="d-flex flex-column">
              <h6>Ngày 2 : Đông Hà - Thành cổ và sông Bến Hải</h6>
              <ul>
                <li>Sáng: Thăm Thành cổ Quảng Trị, nơi ghi dấu ấn lịch sử cuộc chiến 81 ngày đêm khốc liệt</li>
                <li>Trưa: Thưởng thức đặc sản địa phương tại Đông Hà như bún hến, bánh bột lọc, bún mắm nêm.</li>
                <li>Chiều: Ghé cầu Hiền Lương và sông Bến Hải - biểu tượng chia cắt Bắc Nam một thời.</li>
              </ul>
            </div>

            <div className="d-flex flex-column">
              <h6>Ngày 3 : Đông Hà - Thành cổ và sông Bến Hải</h6>
              <ul>
                <li>Sáng: Thăm Thành cổ Quảng Trị, nơi ghi dấu ấn lịch sử cuộc chiến 81 ngày đêm khốc liệt</li>
                <li>Trưa: Thưởng thức đặc sản địa phương tại Đông Hà như bún hến, bánh bột lọc, bún mắm nêm.</li>
                <li>Chiều: Ghé cầu Hiền Lương và sông Bến Hải - biểu tượng chia cắt Bắc Nam một thời.</li>
              </ul>
            </div>


            <div className="d-flex justify-content-end">
              <Button as={Link} to={RoutePath.PAYMENT_CONTRACT} variant="success" className="rounded-5 d-flex align-items-center gap-2"><p className="m-0">Tiếp tục</p> <ion-icon name="arrow-forward-outline"></ion-icon></Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default FinishContract