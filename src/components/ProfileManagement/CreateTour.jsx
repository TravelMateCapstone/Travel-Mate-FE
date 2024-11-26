import React, { useState } from 'react'
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap'
import '../../assets/css/ProfileManagement/CreateTour.css'
function CreateTour() {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    const [key, setKey] = useState("home");
    const tripData = {
        itinerary: [
            {
                day: "Ngày 1",
                schedule: [
                    { time: "8:00 AM", content: "Khởi hành từ Hà Nội" },
                    { time: "12:00 PM", content: "Ăn trưa tại nhà hàng địa phương" },
                    { time: "2:00 PM", content: "Tham quan làng Lô Lô Chải" },
                    { time: "6:00 PM", content: "Ăn tối và nghỉ ngơi tại homestay" }
                ],
                activities: [
                    {
                        content: "Nhóm dạy học: Tổ chức lớp học tiếng Anh và kỹ năng sống cho trẻ em vùng cao",
                        image: "https://via.placeholder.com/150"
                    },
                    {
                        content: "Nhóm cơ sở: Triển khai hoạt động tu sửa cơ sở vật chất",
                        image: "https://via.placeholder.com/150"
                    }
                ]
            },
            {
                day: "Ngày 2",
                schedule: [
                    { time: "7:00 AM", content: "Ăn sáng" },
                    { time: "8:00 AM", content: "Tham gia hoạt động tình nguyện" },
                    { time: "12:00 PM", content: "Ăn trưa" },
                    { time: "2:00 PM", content: "Khởi hành về Hà Nội" },
                    { time: "6:00 PM", content: "Về đến Hà Nội, kết thúc chuyến đi" }
                ],
                activities: []
            }
        ],
        cost: {
            notes: [
                "Trẻ em từ 5 – dưới 10 tuổi được giảm 25% chi phí tiêu chuẩn",
                "Phụ thu 10% chi phí đối với tình nguyện viên quốc tế"
            ],
            includes: [
                "Xe đưa đón toàn bộ hành trình",
                "Nơi ở trong toàn bộ hành trình",
                "Bữa ăn: 4 bữa chính, 2 bữa phụ",
                "Chi phí cho hoạt động tình nguyện và trải nghiệm văn hóa"
            ],
            excludes: [
                "Chi tiêu cá nhân",
                "Đồ ăn, uống tự gọi ngoài chương trình",
                "Hóa đơn VAT"
            ]
        },
        regulations: [
            "Tuân thủ mọi hướng dẫn từ hướng dẫn viên và người tổ chức.",
            "Không tự ý tách đoàn hoặc thay đổi lịch trình đã định.",
            "Tôn trọng văn hóa, phong tục địa phương và người dân bản địa.",
            "Giữ gìn vệ sinh môi trường và không xả rác bừa bãi.",
            "Không mang theo các vật dụng nguy hiểm như vũ khí, chất dễ cháy nổ.",
            "Không tham gia các hoạt động có nguy cơ gây nguy hiểm khi chưa được hướng dẫn.",
            "Luôn giữ liên lạc với trưởng đoàn trong suốt hành trình.",
            "Thanh toán đầy đủ chi phí chuyến đi trước ngày khởi hành.",
            "Không hoàn tiền trong trường hợp hủy chuyến đi mà không có lý do chính đáng."
        ]
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShow} >
                Tạo tua du lịch
            </Button>
            <Modal show={show} onHide={handleClose} className='modal_extraDetailForm'>

                <div className='p-3 overflow-y-scroll d-flex flex-column gap-3 container_create_trip'>
                    <h5 className='text-center'>Tạo chuyến đi của bạn</h5>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Nhập tên tua du lịch" />
                    </Form.Group>

                    <div className='upload_image_create_trip d-flex align-items-center justify-content-center' onClick={() => {
                        document.getElementById('upload_trip_img_detail').click()
                    }}>
                        {image ? <img src={image} alt="Uploaded" className='h-100 w-100 object-fit-cover' /> : (
                            <>
                                <ion-icon name="image-outline"></ion-icon>
                                <p className='m-0'>Tải lên ảnh du lịch</p>
                            </>
                        )}
                    </div>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="my-3 no-border-radius"
                    >
                        {/* Tab Lịch trình */}
                        <Tab eventKey="home" title="Lịch trình">
                            {tripData.itinerary.map((day, index) => (
                                <div key={index}>
                                    <h4>{day.day}</h4>
                                    {day.schedule.map((item, i) => (
                                        <p key={i}>
                                            <strong>{item.time}:</strong> {item.content}
                                        </p>
                                    ))}
                                    {day.activities.length > 0 && (
                                        <div>
                                            <h5>Hoạt động:</h5>
                                            {day.activities.map((activity, i) => (
                                                <div key={i} className="d-flex gap-2 align-items-center mb-2">
                                                    <img
                                                        src={activity.image}
                                                        alt="Activity"
                                                        style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                                                    />
                                                    <p className="m-0">{activity.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Tab>

                        {/* Tab Chi phí */}
                        <Tab eventKey="profile" title="Chi phí">
                            <h4>Quy định chi phí chuyến đi</h4>
                            <h5>1. Lưu ý</h5>
                            <ul>
                                {tripData.cost.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                            <h5>2. Chi phí bao gồm</h5>
                            <ul>
                                {tripData.cost.includes.map((include, index) => (
                                    <li key={index}>{include}</li>
                                ))}
                            </ul>
                            <h5>3. Chi phí không bao gồm</h5>
                            <ul>
                                {tripData.cost.excludes.map((exclude, index) => (
                                    <li key={index}>{exclude}</li>
                                ))}
                            </ul>
                        </Tab>

                        {/* Tab Quy định */}
                        <Tab eventKey="contact" title="Quy định">
                            <h4>Quy định khi tham gia chuyến đi</h4>
                            <ul>
                                {tripData.regulations.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        </Tab>

                    </Tabs>
                </div>



                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className='rounded-5'>
                        Đóng
                    </Button>
                    <Button variant="success" onClick={handleClose} className='rounded-5'>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            <input type="file" id='upload_trip_img_detail' className='d-none' onChange={handleImageChange} />
        </div>
    )
}

export default CreateTour