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
import VerifySignatureRSA from "../../components/Tour/VerifySignatureRSA";
import TimeLine from "../../components/Contracts/TimeLine";

function CreateContract() {
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const tourInfo = useSelector((state) => state.tour.tour);
  const navigate = useNavigate();
  const travlerrSignature = useSelector((state) => state.signature.signature);
  const [isValidSignature, setIsValidSignature] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: vi });
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://travelmateapp.azurewebsites.net/api/Profile/current-profile`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Profile:", response.data);
        
        if (response.data.city === "") {
          console.log("Vui lòng cập nhật địa phương đăng kí");
          toast.error("Vui lòng cập nhật địa phương đăng kí");
          navigate(RoutePath.PROFILE_MY_PROFILE);
        }
        setProfile(response.data);
        
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleCreateContractAndPayment = async () => {
    if (!isValidSignature) {
      toast.error("Vui lòng tải chữ ký hợp lệ trước khi tiếp tục");
      return;
    }
    const contractInfo = {
      travelerId: parseInt(user.id),
      localId: tourInfo.creator.id,
      tourId: tourInfo.tourId,
      location: tourInfo.location,
      details: JSON.stringify(tourInfo),
      travelerSignature: travlerrSignature,
      // localSignature: "chuky8",
    };
    console.log(contractInfo);
    localStorage.setItem("contractInfo", JSON.stringify(contractInfo));
    console.log("contractInfo", contractInfo);
    
    localStorage.setItem("isLocal", 'traveler');
    try {
      const response = await axios.post(
        "https://travelmateapp.azurewebsites.net/api/BlockContract/create-contract-local-pass",
        contractInfo
      );
      if (response.data.data.isCompleted) {
        const infoPayment = {
          tourName: 'Tour du lịch',
          tourId: tourInfo.tourId,
          localId: tourInfo.creator.id,
          travelerId: user.id,
          // amount: tourInfo.price,
          amount: tourInfo.price,
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
      toast.success("Tạo hơp đồng thành công");
      console.log("Contract created successfully:", response.data);
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error(error.response.data?.message);
      if(error.response.data?.message == 'Chữ ký số không tồn tại hoặc người dùng chưa tạo chữ ký số.'){
        toast.error('Vui lòng tạo chữ ký số trước khi tiếp tục');
        navigate(RoutePath.SETTING);
      }
    }
  };

  return (
    <div className="">
      <TimeLine activeStep={1} />
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
                  {profile?.firstName +' '+ profile?.lastName || "Không có thông tin"}
                </p>
                <sub className="fw-medium">{profile?.city}</sub>
              </div>
            </div>
            <VerifySignatureRSA setIsValidSignature={setIsValidSignature} />
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
