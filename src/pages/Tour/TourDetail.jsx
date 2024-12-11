import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../../assets/css/Tour/TourDetail.css";
import { Button, Placeholder } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
import axios from "axios";
import { toast } from "react-toastify";

function TourDetail() {
    const [key, setKey] = useState("home");
    const tourData = useSelector((state) => state.tour?.tour);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    
    const handelJointTour = async (tourId) => {
        try {
            const response = await axios.post(
                `https://travelmateapp.azurewebsites.net/api/Tour/join/${tourId}`,
                {},
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log(response.data);
            navigate(RoutePath.CREATE_CONTRACT);
        } catch (error) {
            console.error("Error joining tour:", error);
            if (error.response && error.response.data === "You have joined this tour") {
                toast.error("You have already joined this tour");
            }
        }
    };

    if (!tourData) {
        return (
            <div>
                <main className="__className_843922">
                    <div>
                        <div className="py-0 container">
                            <section className="flex flex-col py-4">
                                <Placeholder as="h1" animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                            </section>
                            <div className="row">
                                <div className="col-md-8">
                                    <Placeholder as="div" animation="glow">
                                        <Placeholder className="w-100" style={{ height: "415px" }} />
                                    </Placeholder>
                                </div>
                                <div className="hidden lg:block col-md-4">
                                    <div className="border-1 p-3 rounded-4 d-flex flex-column align-items-center">
                                        <Placeholder as="div" animation="glow">
                                            <Placeholder className="rounded-circle" style={{ width: "50px", height: "50px" }} />
                                        </Placeholder>
                                        <Placeholder as="h5" animation="glow">
                                            <Placeholder xs={6} />
                                        </Placeholder>
                                        <Placeholder as="h6" animation="glow">
                                            <Placeholder xs={4} />
                                        </Placeholder>
                                        <div className="start_container">
                                            <Placeholder as="div" animation="glow">
                                                <Placeholder xs={2} />
                                                <Placeholder xs={2} />
                                                <Placeholder xs={2} />
                                                <Placeholder xs={2} />
                                                <Placeholder xs={2} />
                                            </Placeholder>
                                        </div>
                                        <Placeholder as="p" animation="glow">
                                            <Placeholder xs={4} />
                                        </Placeholder>
                                        <Placeholder as="p" animation="glow">
                                            <Placeholder xs={4} />
                                        </Placeholder>
                                    </div>
                                    <div className="border-1 p-3 rounded-4 mt-3">
                                        <div className="flex flex-col tour-form_gap__N_UmA ">
                                            <Placeholder as="h5" animation="glow">
                                                <Placeholder xs={4} />
                                            </Placeholder>
                                            <Placeholder as="div" animation="glow">
                                                <Placeholder xs={6} />
                                            </Placeholder>
                                            <Placeholder as="div" animation="glow">
                                                <Placeholder xs={6} />
                                            </Placeholder>
                                            <Placeholder as="div" animation="glow">
                                                <Placeholder xs={6} />
                                            </Placeholder>
                                        </div>
                                        <Placeholder as="div" animation="glow">
                                            <Placeholder xs={6} />
                                        </Placeholder>
                                        <div className="d-flex gap-3">
                                            <Placeholder.Button variant="success" xs={6} />
                                            <Placeholder.Button variant="outline-dark" xs={6} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="my-3 no-border-radius"
                            >
                                <Tab eventKey="home" title="Lịch trình">
                                    <Placeholder as="div" animation="glow">
                                        <Placeholder xs={12} />
                                        <Placeholder xs={12} />
                                        <Placeholder xs={12} />
                                    </Placeholder>
                                </Tab>
                                <Tab eventKey="profile" title="Chi phí">
                                    <Placeholder as="h4" animation="glow">
                                        <Placeholder xs={4} />
                                    </Placeholder>
                                    <Placeholder as="ul" animation="glow">
                                        <Placeholder as="li" xs={12} />
                                        <Placeholder as="li" xs={12} />
                                        <Placeholder as="li" xs={12} />
                                    </Placeholder>
                                </Tab>
                                <Tab eventKey="contact" title="Quy định">
                                    <Placeholder as="div" animation="glow">
                                        <Placeholder xs={12} />
                                        <Placeholder xs={12} />
                                        <Placeholder xs={12} />
                                    </Placeholder>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <main className="__className_843922">
                <div>
                    <div className="py-0 container">
                        <section className="flex flex-col py-4">
                            <h1 className="text-purple fw-semibold">
                                {tourData.tourName}
                            </h1>
                        </section>
                        <div className="row">
                            <div className="col-md-8">
                                <img
                                    alt="thumbnail"
                                    loading="lazy"
                                    width={793}
                                    height={415}
                                    decoding="async"
                                    data-nimg={1}
                                    className="tour-detail_mainImg___iF_K"
                                    style={{ color: "transparent" }}
                                    src={tourData.tourImage}
                                />
                            </div>
                            <div className="hidden lg:block col-md-4">
                                <div className="border-1 p-3 rounded-4 d-flex flex-column align-items-center">
                                    <img src={tourData.creator.avatarUrl} alt="" width={50} height={50} className="rounded-circle object-fit-cover" />
                                    <h5>{tourData.creator.fullname}</h5>
                                    <h6>{tourData.creator.address}</h6>
                                    <div className="start_container">
                                        {[...Array(tourData.creator.rating)].map((_, i) => (
                                            <ion-icon key={i} name="star"></ion-icon>
                                        ))}
                                        {[...Array(5 - tourData.creator.rating)].map((_, i) => (
                                            <ion-icon key={i} name="star-outline"></ion-icon>
                                        ))}
                                    </div>
                                    <p>{tourData.creator.totalTrips} chuyến đi</p>
                                    <p>Tham gia từ {new Date(tourData.creator.joinedAt).getFullYear()}</p>
                                </div>
                                <div className="border-1 p-3 rounded-4 mt-3">
                                    <div className="flex flex-col tour-form_gap__N_UmA ">
                                        <h5>Thông tin cơ bản</h5>
                                        <div>
                                            <span className="fw-semibold">Khởi hành từ: </span>
                                            {tourData.location}
                                        </div>
                                        <div>
                                            <span className="fw-semibold">Thời gian: </span>{tourData.numberOfDays} ngày {tourData.numberOfNights} đêm
                                        </div>
                                        <div>
                                            <span className="fw-semibold">Ngày khởi hành: </span>
                                            {new Date(tourData.startDate).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="fw-semibold">Ngày kết thúc: </span>
                                            {new Date(tourData.endDate).toLocaleString()}
                                        </div>
                                        <div className="flex flex-wrap gap-[10px]" />
                                    </div>
                                    <div>
                                        <span>{tourData.price.toLocaleString()}&nbsp;₫</span>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <Button variant="outline-secondary">🔥 Nhắn tin!</Button>
                                        <Button variant="outline-success" onClick={() => handelJointTour(tourData.tourId)}>🚀 Đặt chỗ ngay</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="my-3 no-border-radius"
                        >
                            <Tab eventKey="home" title="Lịch trình">
                                <Accordion defaultActiveKey="0">
                                    {tourData.itinerary.$values.map((day, index) => (
                                        <Accordion.Item eventKey={index.toString()} key={index}>
                                            <Accordion.Header>Ngày {day.day} - {new Date(day.date).toLocaleDateString()}</Accordion.Header>
                                            <Accordion.Body>
                                                {day.activities.$values.map((activity, idx) => (
                                                    <div key={idx} className="timeline-activity">
                                                        <p><strong>{activity.startTime} - {activity.endTime}</strong> - {activity.title}</p>
                                                        <p>Địa chỉ: {activity.activityAddress}</p>
                                                        <p>Chi phí: {activity.activityAmount.toLocaleString()}₫</p>
                                                        {activity.activityImage && <img src={activity.activityImage} alt="" className="activity-image fixed-size" />}
                                                    </div>
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Tab>
                            <Tab eventKey="profile" title="Chi phí">
                                <ul>
                                    {tourData.costDetails.$values.map((cost, index) => (
                                        <li key={index}>{cost.title}: {cost.amount.toLocaleString()}₫ - {cost.notes}</li>
                                    ))}
                                </ul>
                            </Tab>
                            <Tab eventKey="contact" title="Quy định">
                                <div dangerouslySetInnerHTML={{ __html: tourData.additionalInfo }} />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TourDetail;
