import { useState, useEffect } from "react";
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
import Table from 'react-bootstrap/Table';
import checkProfileCompletion from "../../utils/Profile/checkProfileCompletion";
import { useDispatch } from "react-redux";
import { viewProfile } from "../../redux/actions/profileActions";
import Modal from "react-modal";
import { setSelectedSchedule_redux } from "../../redux/actions/tourActions";

Modal.setAppElement('#root');

function TourDetail() {
    const [key, setKey] = useState("home");
    const tourData = useSelector((state) => state.tour?.tour);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    console.log(tourData);


    useEffect(() => {
        if (tourData && tourData.schedules && tourData.schedules.$values.length > 0) {
            setSelectedSchedule(tourData.schedules.$values[0]);
        }
    }, [tourData]);

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
        dispatch(setSelectedSchedule_redux(schedule.scheduleId));
    };
    const user = useSelector((state) => state.auth.user);
    const formatDateToVietnamese = (date) => {
        const parsedDate = new Date(date); // Chuyển chuỗi date về dạng Date object
        const day = String(parsedDate.getUTCDate()).padStart(2, '0'); // Lấy ngày theo UTC
        const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Lấy tháng theo UTC (cộng thêm 1)
        return `${day}/${month}`;
    };

    const viewLocal = (localId) => {
        if (parseInt(localId) === parseInt(user.id)) {
            dispatch(viewProfile(localId, token));
            window.open(RoutePath.PROFILE_MY_PROFILE, '_blank');
        } else {
            dispatch(viewProfile(localId, token));
            window.open(RoutePath.OTHERS_PROFILE, '_blank');
        }
    }

    const handelJointTour = async (tourId, scheduleId) => {
        try {
            const profileCompletion = await checkProfileCompletion("https://travelmateapp.azurewebsites.net", token);
            if (!profileCompletion) {
                toast.error("Bạn phải hoàn thành cả chữ kí số và CCCD. Vui lòng cập nhật hồ sơ của bạn.");
                return;
            }
            await axios.post(
                `https://travelmateapp.azurewebsites.net/api/TourParticipant/join`,
                {
                    tourId: tourId,
                    scheduleId: scheduleId,
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            dispatch(setSelectedSchedule_redux(scheduleId))
            navigate(RoutePath.CREATE_CONTRACT);
        } catch (error) {
            console.error("Error joining tour:", error);
            if (error.response && error.response.data === "You have joined this tour") {
                toast.error("Bạn đã tham gia tour này. Vui lòng kiểm tra hợp đồng của bạn.");
            } else if (error.response && error.response.data === "Access Denied! You are creator of this tour") {
                toast.error("Bạn là người tạo tour này. Vui lòng kiểm tra danh sách tour của bạn.");
            } else if (error.response && error.response.data === "Access Denied! Tour've already done!") {
                toast.error("Tour đã hoàn thành. Vui lòng chọn tour khác.");
            } else if (error.response && error.response.data === "Access Denied! Finish your tour booking process before booking another tour") {
                toast.error("Hoàn tất quy trình đặt tour trước khi đặt tour khác");
            } else if(error.response && error.response.data === "You have already joined this tour ."){
                toast.error("Bạn đã tham gia tour này. Vui lòng kiểm tra hợp đồng của bạn.");
            }
        }
    };

    const chatWithLocal = async (localId) => {
        try {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Chat/UserInfo/${localId}`);
            const userData = response.data;
            navigate(RoutePath.CHAT, { state: { user: userData } });
        } catch (error) {
            console.error("Error fetching chat user info:", error);
            toast.error("Không thể lấy thông tin người dùng để chat.");
        }
    };

    const handleShowModal = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedActivity(null);
    };

    if (!tourData) {
        return (
            <div>
                <main className="__className_843922">
                    <div>
                        <div className="py-0 container-fluid">
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
                                className="my-3 no-border-radius fixed-size-tabs"
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
                    <div className="py-0 container-fluid" style={{
                        padding: "0 150px",
                    }}>
                        <section className="flex flex-col py-4">
                            <div className="d-flex gap-2 align-items-end">
                                <h1>Tour/</h1>
                                <h2 >
                                    {tourData.tourName}
                                </h2>
                            </div>
                        </section>
                        <div className="row" style={{}}>
                            <div className="col-md-8">
                                <img
                                    alt="thumbnail"
                                    loading="lazy"
                                    width={'100%'}
                                    height={550}
                                    decoding="async"
                                    data-nimg={1}
                                    className="rounded-4 object-fit-cover"
                                    src={tourData.tourImage}
                                />
                            </div>
                            <div className="hidden lg:block col-md-4">
                                <div className="bg-white p-3 rounded-4 border-1" style={{
                                    borderColor: "rgba(0, 0, 0, 0.3)",
                                }}>
                                    <div className="d-flex justify-content-between mb-4">
                                        <div className="d-flex gap-3">
                                            <img src={tourData.creator.avatarUrl} alt="" width={60} height={60} className="rounded-circle object-fit-cover mb-2" />
                                            <div className="">
                                                <p className="mb-2 fw-medium">{tourData.creator.fullname}</p>
                                                <p className="fw-medium">{tourData.creator.address}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column align-items-center fw-medium pr-4">
                                            <div className="start_container mt-2 mb-0">
                                                {[...Array(tourData.creator.rating || 0)].map((_, i) => (
                                                    <ion-icon key={i} name="star"></ion-icon>
                                                ))}
                                                {[...Array(5 - (tourData.creator.rating || 0))].map((_, i) => (
                                                    <ion-icon key={i} name="star-outline"></ion-icon>
                                                ))}
                                            </div>
                                            <p className="mb-2">{tourData.creator.totalTrips || 0} chuyến đi</p>
                                            <p className="mb-0">Tham gia từ {new Date(tourData.creator.joinedAt).getFullYear()}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline-success" className="w-100" onClick={() => viewLocal(tourData.creator.id)}>Xem hồ sơ</Button>
                                </div>
                                <div className=" p-3 rounded-4 mt-3 tour_card_component bg-white border-1" style={{
                                    borderColor: "rgba(0, 0, 0, 0.3)",
                                }}>
                                    <div className="px-2">
                                        <h4>Giá <span className="text-danger">*</span></h4>
                                        <h2 className="fw-semibold text-success mb-4">{tourData.price.toLocaleString()}&nbsp;₫/ <sub className="text-dark">Khách</sub></h2>
                                        <div className="flex flex-col tour-form_gap__N_UmA ">
                                            <Table bordered hover style={{ overflow: 'hidden', }}>
                                                <tbody>
                                                    <tr>
                                                        <td className="fw-medium" style={{ width: '50%' }}><ion-icon name="location-outline"></ion-icon> Khởi hành</td>
                                                        <td style={{ width: '50%' }}>{tourData.location}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium" style={{ width: '50%' }}><ion-icon name="time-outline"></ion-icon> Thời gian</td>
                                                        <td style={{ width: '50%' }}>{tourData.numberOfDays}N{tourData.numberOfDays - 1}Đ</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium" style={{ width: '50%' }}><ion-icon name="people-outline"></ion-icon> Số người tham gia</td>
                                                        <td style={{ width: '50%' }}>{selectedSchedule && (
                                                            <div >
                                                                {selectedSchedule?.participants?.$values.length}/{tourData.maxGuests}
                                                            </div>
                                                        )}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium" style={{ width: '50%' }}><ion-icon name="calendar-outline"></ion-icon> Ngày khởi hành</td>
                                                        <td style={{ width: '50%' }}>
                                                            <div className="" style={{
                                                                width: "fit-content",
                                                                borderRadius: "10px",
                                                                display: "flex",
                                                                gap: "5px",
                                                            }}>
                                                                {tourData.schedules.$values.map((schedule, index) => (
                                                                    <Button
                                                                        variant={schedule.activeStatus ? (selectedSchedule?.scheduleId === schedule.scheduleId ? "success" : "outline-success") : "outline-secondary"}
                                                                        key={index}
                                                                        action
                                                                        onClick={() => handleScheduleSelect(schedule)}
                                                                        disabled={!schedule.activeStatus}
                                                                    >
                                                                        {formatDateToVietnamese(schedule.startDate)}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <div />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 ">
                                        <Button variant="outline-success" className="text-nowrap" onClick={() => chatWithLocal(tourData.creator.id)}>Nhắn tin</Button>
                                        {(selectedSchedule?.participants?.$values.length < tourData.maxGuests) ? (
                                            <Button variant="success" className="w-100" onClick={() => handelJointTour(tourData.tourId, selectedSchedule?.scheduleId)}>Đặt chỗ ngay</Button>
                                        ) : (
                                            <Button variant="dark" disabled><ion-icon name="sad-outline"></ion-icon> Đã đủ số lượng</Button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="my-3 no-border-radius mt-5"
                        >
                            <Tab className="fixed-size-tabs" eventKey="home" title="Lịch trình">
                                <Accordion defaultActiveKey="0" alwaysOpen>
                                    {tourData.itinerary.$values.map((day, index) => (
                                        <Accordion.Item eventKey={index.toString()} key={index}>
                                            <Accordion.Header><div className="d-flex flex-column"><strong>Ngày {index + 1}</strong></div></Accordion.Header>
                                            <Accordion.Body>
                                                <Table bordered hover>
                                                    <thead>
                                                        <tr >
                                                            <th >Thời gian</th>
                                                            <th >Hoạt động</th>
                                                            <th >Chi phí</th>
                                                            <th>Chi tiết</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {day.activities.$values.map((activity, idx) => (
                                                            <tr key={idx} >
                                                                <td >
                                                                    <strong>{activity.startTime} - {activity.endTime}</strong>
                                                                </td>
                                                                <td >{activity.title}</td>
                                                                <td className="fw-bold text-success">{activity.activityAmount.toLocaleString()}₫</td>
                                                                <td>
                                                                    <Button variant="outline-secondary" onClick={() => handleShowModal(activity)}>Chi tiết</Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Tab>
                            <Tab className="fixed-size-tabs" eventKey="profile" title="Chi phí">
                                <ul>
                                    {tourData.costDetails.$values.map((cost, index) => (
                                        <li key={index}><h5>{cost.title}: {cost.amount.toLocaleString()}₫</h5>{cost.notes}</li>
                                    ))}
                                </ul>
                            </Tab>
                            <Tab className="fixed-size-tabs" eventKey="contact" title="Quy định">
                                <div dangerouslySetInnerHTML={{ __html: tourData.additionalInfo }} />
                            </Tab>
                        </Tabs>

                        <h4 className="text-uppercase fw-semibold my-4 text-center">
                            Những thông tin cần lưu ý
                        </h4>

                        <div className="container_info_note">
                            <Accordion defaultActiveKey={['0']} alwaysOpen>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <strong>Điều kiện thanh toán</strong>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        Thanh toán đầy đủ 100% giá trị tour ngay tại thời điểm đăng ký để đảm bảo giữ chỗ và các dịch vụ trong tour.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>
                                        <strong>Điều kiện đăng ký</strong>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li> Đăng ký tour sớm để đảm bảo chỗ, đặc biệt trong mùa cao điểm hoặc lễ, Tết. </li>
                                            <li>Cung cấp đầy đủ thông tin cá nhân cần thiết (CMND/CCCD/Hộ chiếu) khi đăng ký.</li>
                                            <li>Thanh toán đúng theo điều kiện thanh toán quy định để giữ chỗ.</li>
                                            <li>Đọc kỹ các thông tin về chính sách hủy, đổi tour trước khi xác nhận đăng ký.</li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>
                                        <strong>Các điều kiện hủy tour đối với ngày thường</strong>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li>Trước ngày khởi hành từ 2 ngày trở lên: Phí hủy tour là 50% giá trị tour.</li>
                                            <li>Trong vòng 2 ngày trước ngày khởi hành: Phí hủy tour là 100% giá trị tour (không hoàn tiền).</li>
                                        </ul>
                                        <ul>
                                            <li>Việc hủy tour cần được thông báo qua email hoặc văn bản chính thức.</li>
                                            <li>Các chi phí phát sinh (vé máy bay, dịch vụ đã đặt trước) sẽ không được hoàn trả.</li>
                                            <li>Đối với các tour lễ, Tết, áp dụng chính sách không hoàn tiền ngay khi đăng ký.</li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </main>
            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Chi tiết hoạt động"
                style={{
                    content: {
                        top: '54%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        maxHeight: '80vh', // Added to limit the height
                        overflowY: 'auto', // Added to enable scrolling
                    },
                }}
            >
                <h2>Chi tiết hoạt động</h2>
                {selectedActivity && (
                    <>
                        <p><strong>Thời gian:</strong> {selectedActivity.startTime} - {selectedActivity.endTime}</p>
                        <p><strong>Hoạt động:</strong> {selectedActivity.title}</p>
                        <p><strong>Địa chỉ:</strong> {selectedActivity.activityAddress}</p>
                        <p><strong>Chi phí:</strong> {selectedActivity.activityAmount.toLocaleString()}₫</p>
                        <p><strong>Mô tả:</strong> {selectedActivity.description}</p>
                        {selectedActivity.activityImage && <img src={selectedActivity.activityImage} alt={selectedActivity.title} className="activity-image fixed-size rounded-3" />}
                    </>
                )}
                <div className="mt-4 d-flex justify-content-end">
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                </div>
            </Modal>
        </div>
    );
}

export default TourDetail;
