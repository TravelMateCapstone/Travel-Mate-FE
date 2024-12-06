import React, { useEffect, useState } from "react";
import "../../assets/css/Contracts/CreateContract.css";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import VerirySignature from "../../components/Shared/VerirySignature";

function CreateContract() {
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const tourInfo = useSelector((state) => state.tour.tour);
  const navigate = useNavigate();
  console.log(tourInfo);
  
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: vi });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://travelmateapp.azurewebsites.net/api/Profile/${user.id}`
        );
        setProfile(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleCreateContractAndPayment = async () => {
    const contractInfo = {
      travelerId: user.id,
      localId: tourInfo.creator.id,
      tourId: tourInfo.tourId,
      location: tourInfo.location,
      details: JSON.stringify(tourInfo),
      travelerSignature: "luongtaokhoa37",
      localSignature: "chuky8",
    };
    console.log(contractInfo);

    try {
      const response = await axios.post(
        "https://travelmateapp.azurewebsites.net/api/BlockContract/create-contract",
        contractInfo
      );
      if (response.data.data.isCompleted) {
        const infoPayment = {
          tourName: 'Tour du lịch',
          tourId: tourInfo.tourId,
          localId: tourInfo.creator.id,
          travelerId: user.id,
          // amount: tourInfo.price,
          amount: 2000,
        };
        // Redirect to payment form submission
        const form = document.createElement("form");
        form.action = "https://travelmateapp.azurewebsites.net/api/order";
        form.method = "GET";

        Object.keys(infoPayment).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = infoPayment[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
      toast.success("Contract created successfully");
      console.log("Contract created successfully:", response.data);
    } catch (error) {
      toast.error("Error creating contract");
      console.error("Error creating contract:", error);
    }
  };

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
                src={
                  profile?.imageUser ||
                  "https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw"
                }
                alt="avatar"
                className="rounded-circle object-fit-cover"
                height={60}
                width={60}
              />
              <div>
                <p className="m-0 fw-bold">
                  {profile?.user.fullName || "Không có thông tin"}
                </p>
                <sub className="fw-medium">{profile?.address}</sub>
              </div>
            </div>
            <VerirySignature publickey={'chuky8'}/>
            {/* <Button variant="outline-warning" className="rounded-5">
              Chưa đồng ý
            </Button> */}
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
                  tourInfo.creator.avatarUrl ||
                  "https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw"
                }
                alt="avatar"
                className="rounded-circle object-fit-cover"
                height={60}
                width={60}
              />
              <div>
                <p className="m-0 fw-bold">{tourInfo.creator.fullname}</p>
                <sub className="fw-medium">{tourInfo.creator.address}</sub>
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
          <p className="m-0 fw-medium">{tourInfo.location}</p>
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
          <p className="p-2 m-0 fw-medium">{formatDate(tourInfo.startDate)}</p>
          <div
            className="py-2 px-3 rounded-5 text-danger fw-medium"
            style={{
              backgroundColor: "#f9f9f9",
            }}
          >
            {formatDate(tourInfo.endDate)}
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
            {tourInfo.costDetails.$values.map((cost) => (
              <div className="d-flex justify-content-between">
                <strong>{cost.title}</strong>{" "}
                <div className="m-0 d-flex gap-1">
                  <p className="m-0">{cost.amount}</p>{" "}
                  <p className="m-0 text-muted">VNĐ</p>
                </div>
              </div>
            ))}
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
              {tourInfo.itinerary.$values.map((day) => (
                <div>
                  <h6>Ngày {day.day}: {day.title}</h6>
                  <ul>
                    {day.activities.$values.map((activity) => (
                      <li>{activity.description}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-end">
              <Button
                onClick={handleCreateContractAndPayment}
                variant="success"
                className="rounded-5 d-flex align-items-center gap-2"
              >
                <p className="m-0">Tiếp tục</p>{" "}
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CreateContract;
