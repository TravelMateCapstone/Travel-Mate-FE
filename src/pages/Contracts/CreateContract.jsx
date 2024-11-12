import React from "react";
import "../../assets/css/Contracts/CreateContract.css";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
function CreateContract() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="">
      <Row
        className="rounded-top-4"
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
          <div className="d-flex justify-content-between align-items-center">
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
            <Button variant="outline-warning" className="rounded-5">
              Chưa đồng ý
            </Button>
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
            <Button variant="outline-success" className="rounded-5">
              Đồng ý
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="">
        <Col
          lg={12}
          style={{
            borderLeft: "1px solid #CCCCCC",
            borderRight: "1px solid #CCCCCC",
            borderBottom: "1px solid #CCCCCC",
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
      <Row className="">
        <Col
          lg={12}
          style={{
            borderLeft: "1px solid #CCCCCC",
            borderRight: "1px solid #CCCCCC",
            padding: "15px 25px",
            display: "flex",
            alignContent: "center",
            gap: "15px",
          }}
        >
          <ion-icon
            name="time-outline"
            style={{
              fontSize: "24px",
              padding: "8px 0",
            }}
          ></ion-icon>{" "}
          <p className="py-2 m-0">Thời gian diễn ra</p>
          <p className="p-2 m-0 fw-medium">T7, 03, tháng 9 lúc 09:00</p>
          <div
            className="py-2 px-3 rounded-5 text-danger fw-medium"
            style={{
              backgroundColor: "#f9f9f9",
            }}
          >
            T7, 03, tháng 9 lúc 09:00
          </div>
        </Col>
      </Row>
      <Row
        className="rounded-bottom-4"
        style={{
          border: "1px solid #CCCCCC",
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
          <div className="d-flex align-items-center gap-2">
            <ion-icon
              name="list-circle-outline"
              style={{
                fontSize: "24px",
              }}
            ></ion-icon>
            <h6 className="fw-normal m-0">Chi phí thanh toán</h6>
          </div>
          <div className="d-flex justify-content-between flex-column gap-2 mt-2">
            <div className="d-flex justify-content-between">
              <strong>Phí dịch vụ</strong>{" "}
              <div className="m-0 d-flex gap-1">
                <p className="m-0">1.050.000</p> <p className="m-0 text-muted">VNĐ</p>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <strong>Di chuyển</strong>{" "}
              <div className="m-0 d-flex gap-1">
                <p className="m-0">250.000</p> <p className="m-0 text-muted">VNĐ</p>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <strong>Chỗ ở</strong>{" "}
              <div className="m-0 d-flex gap-1">
                <p className="m-0">0</p> <p className="m-0 text-muted">VNĐ</p>
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
          <div className="d-flex align-items-center gap-2">
            <ion-icon
              name="list-circle-outline"
              style={{
                fontSize: "24px",
              }}
            ></ion-icon>
            <h6 className="fw-normal m-0">Chi tiết chuyến đi</h6>
          </div>
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
  );
}

export default CreateContract;
