import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap'
import '../../assets/css/ProfileManagement/CreateTour.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Collapse from 'react-bootstrap/Collapse';
import ProvinceSelector from '../../components/Shared/ProvinceSelector'
import TextareaAutosize from 'react-textarea-autosize';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
function CreateTour() {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [valueSchedule, setValueSchedule] = useState('');
    const [valueCost, setValueCost] = useState('');
    const [valueRegulations, setValueRegulations] = useState('');
    const [openDays, setOpenDays] = useState([]); // Change to an array to track multiple open days
    const quillRef = useRef(null);
    const [showUpdateMoney, setShowUpdateMoney] = useState(false);

    const handleCloseUpdateMoney = () => setShowUpdateMoney(false);
    const handleShowUpdateMoney = () => setShowUpdateMoney(true);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Handle the mutation
                }
            });
        });

        if (quillRef.current) {
            observer.observe(quillRef.current, { childList: true, subtree: true });
        }

        return () => {
            observer.disconnect();
        };
    }, []);


    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]
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

    const toggleDay = (day) => {
        setOpenDays((prevOpenDays) =>
            prevOpenDays.includes(day)
                ? prevOpenDays.filter((d) => d !== day)
                : [...prevOpenDays, day]
        );
    };


    return (
        <div>
            <Button variant="success" onClick={handleShow} className='rounded-5'>
                Tạo tour du lịch
            </Button>
            <Modal show={show} onHide={handleClose} className='modal_extraDetailForm'>

                <div style={{
                    padding: '1.5rem 2rem'
                }} className='overflow-y-scroll d-flex flex-column gap-3 container_create_trip'>
                    <Row>
                        <h5 className='fw-bold mb-3'>Tạo tour du lịch</h5>
                        <Col lg={8} className='form_create_tour border-1 p-3 rounded-4'>
                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Tên tour du lịch</Form.Label>
                                <Form.Control type="text" placeholder="Nhập tên tour du lịch" />
                            </Form.Group>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Ngày bắt đầu</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Chọn thời gian diễn ra" />
                            </Form.Group>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Ngày kêt thúc</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Chọn thời gian diễn ra" />
                            </Form.Group>

                            <div className='location_createtour'><ProvinceSelector /></div>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Số lượng khách</Form.Label>
                                <Form.Control type="number" placeholder="Nhập tên tour du lịch" />
                            </Form.Group>

                        </Col>

                        <Col lg={4}>
                            <div className='upload_image_create_trip d-flex align-items-center justify-content-center' onClick={() => {
                                document.getElementById('upload_trip_img_detail').click()
                            }}>
                                {image ? <img src={image} alt="Uploaded" className='w-100 object-fit-cover' style={{
                                    maxHeight: '300px',
                                    borderRadius: '10px'
                                }} /> : (
                                    <>
                                        <ion-icon name="image-outline"></ion-icon>
                                        <p className='m-0'>Tải lên ảnh du lịch</p>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="my-3 no-border-radius"
                    >
                        {/* Tab Lịch trình */}
                        <Tab eventKey="home" title="LỊCH TRÌNH">
                            <div className='day_plan'>
                                <Button
                                    variant='' // Add a default variant
                                    className='d-flex justify-content-between align-items-center gap-3'
                                    onClick={() => toggleDay(1)}
                                    aria-controls="open_plan_day_1"
                                    aria-expanded={openDays.includes(1)}
                                >
                                    <p className='m-0 d-flex justify-content-center align-items-center'>{openDays.includes(1) ? <ion-icon name="chevron-down-outline"></ion-icon> : <ion-icon name="chevron-forward-outline"></ion-icon>}</p>
                                    <h6 className='m-0 fw-bold'>Ngày 1</h6>
                                </Button>
                                <Collapse in={openDays.includes(1)}>
                                    <div id="open_plan_day_1">
                                        <div>
                                            <sub>20-11-2024</sub>
                                        </div>
                                        <div className='timeline_day_container'>
                                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2'>
                                                <div>00:20-1:20</div>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" width={40} height={40} />
                                                    <p className='m-0'>Khởi hành từ Hà Nội</p>
                                                </div>
                                            </div>

                                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2'>
                                                <div>00:20-1:20</div>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" width={40} height={40} />
                                                    <p className='m-0'>
                                                        Ăn trưa tại nhà hàng địa phương
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2'>
                                                <div>00:20-1:20</div>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" width={40} height={40} />
                                                    <p className='m-0'>
                                                        Tham quan làng Lô Lô Chải
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                        <div id=''><ion-icon name="add-circle-outline"></ion-icon> Thêm hoạt động mới</div>
                                    </div>
                                </Collapse>
                            </div>
                            <hr />
                            <div className='day_plan'>
                                <Button
                                    variant='' // Add a default variant
                                    className='d-flex justify-content-between align-items-center gap-3'
                                    onClick={() => toggleDay(2)}
                                    aria-controls="open_plan_day_2"
                                    aria-expanded={openDays.includes(2)}
                                >
                                    <p className='m-0 d-flex justify-content-center align-items-center'>{openDays.includes(2) ? <ion-icon name="chevron-down-outline"></ion-icon> : <ion-icon name="chevron-forward-outline"></ion-icon>}</p>
                                    <h6 className='m-0 fw-bold'>Ngày 2</h6>
                                </Button>
                                <Collapse in={openDays.includes(2)}>
                                    <div id="open_plan_day_2">
                                        <div>
                                            <sub>20-11-2024</sub>
                                        </div>
                                        <div className='timeline_day_container'>
                                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2'>
                                                <div>00:20-1:20</div>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" width={40} height={40} />
                                                    <p className='m-0'>Khởi hành từ Hà Nội</p>
                                                </div>
                                            </div>

                                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2'>
                                                <div>00:20-1:20</div>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" width={40} height={40} />
                                                    <p className='m-0'>
                                                        Ăn trưa tại nhà hàng địa phương
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2'>
                                                <div>00:20-1:20</div>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" width={40} height={40} />
                                                    <p className='m-0'>
                                                        Tham quan làng Lô Lô Chải
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                        <div id=''><ion-icon name="add-circle-outline"></ion-icon> Thêm hoạt động mới</div>
                                    </div>
                                </Collapse>
                            </div>
                        </Tab>

                        {/* Tab Chi phí */}
                        <Tab eventKey="profile" title="CHI PHÍ">
                            <Row>
                                <Col lg={6}>
                                    <Form.Group className=''>
                                        <Form.Label>Tên chi phí</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên chi phí" />
                                    </Form.Group>
                                    <Form.Group className=''>
                                        <Form.Label>Tên chi phí</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên chi phí" />
                                    </Form.Group>
                                </Col>
                                <Col lg={5}>
                                    <Form.Group className='d-flex flex-column'>
                                        <Form.Label>Ghi chú</Form.Label>
                                        <TextareaAutosize minRows={5} className='rounded-3 p-2 fw-normal' style={{
                                            borderColor: '#ced4da'
                                        }} />
                                    </Form.Group>
                                </Col>
                                <Col lg={1} className='d-flex align-items-center'>
                                    <Button variant='' className=''>
                                        <ion-icon name="add-circle-outline" style={{
                                            fontSize: '40px',
                                            color: '#198754'
                                        }}></ion-icon>
                                    </Button>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col lg={12}>
                                    <div className='money_item p-2 w-100'>
                                        <div className='d-flex justify-content-between align-content-center'>
                                            <div className='d-flex gap-3 align-items-center'>
                                                <div onClick={setShowUpdateMoney}><ion-icon name="ellipsis-vertical-outline"></ion-icon></div>
                                                <p className='m-0'>Xe đưa đón toàn bộ hành trình</p>
                                            </div>
                                            <p className='m-0 text-success'>
                                                300.000 VND
                                            </p>
                                        </div>
                                        <p className='w-50' style={{
                                            fontSize: '12px'
                                        }}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat porttitor aptent eget imperdiet eleifend porta proin potenti etiam et et nulla litora. Est parturient dolor conubia porttitor nunc pulvinar mi tempus malesuada phasellus lacinia ac aenean.
                                        </p>
                                    </div>
                                </Col>

                                <Col lg={12} >
                                    <div className='money_item p-2 w-100'>
                                        <div className='d-flex justify-content-between align-content-center'>
                                            <div className='d-flex gap-3 align-items-center'>
                                                <div onClick={setShowUpdateMoney}><ion-icon name="ellipsis-vertical-outline"></ion-icon></div>
                                                <p className='m-0'>Bảo hiểm du lịch</p>
                                            </div>
                                            <p className='m-0 text-success'>
                                                100.000 VND
                                            </p>
                                        </div>
                                        <p className='w-50' style={{
                                            fontSize: '12px'
                                        }}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat porttitor aptent eget imperdiet eleifend porta proin potenti etiam et et nulla litora. Est parturient dolor conubia porttitor nunc pulvinar mi tempus malesuada phasellus lacinia ac aenean.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Tab>

                        {/* Tab Quy định */}
                        <Tab eventKey="contact" title="QUY ĐỊNH">
                            <div>
                            <ReactQuill
                                    ref={quillRef}
                                    className=''
                                    modules={modules}
                                    formats={formats}
                                    theme="snow"
                                    value={valueRegulations}
                                    onChange={setValueRegulations}
                                />
    
                            </div>
                            <div className='d-flex gap-2 mt-3'>
                                <input type="checkbox" />
                                <div className='m-0'>Bằng cách tạo tour này, bạn xác nhận rằng đã đọc, hiểu và đồng ý với các <Link to={RoutePath.HOMEPAGE} className='m-0 text-decoration-underline'>Điều khoản và Quy định</Link> của chúng tôi</div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <Modal.Footer className='border-top-0'>
                    <Button variant="outline-secondary" onClick={handleClose} className='rounded-5'>
                        Hủy
                    </Button>
                    <Button variant="success" onClick={handleClose} className='rounded-5'>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            <input type="file" id='upload_trip_img_detail' className='d-none' onChange={handleImageChange} />
            <Modal show={showUpdateMoney} centered onHide={handleCloseUpdateMoney}>
                <Modal.Body className='d-flex flex-column overflow-y-scroll'>
                    <h5 className='text-center'>Cập nhật chi phí </h5>
                    <Form.Group className='w-100'>
                        <Form.Label>Tên chi phí</Form.Label>
                        <Form.Control type="text" placeholder="Nhập tên chi phí" />
                    </Form.Group>
                    <Form.Group className='w-100'>
                        <Form.Label>Tên chi phí</Form.Label>
                        <Form.Control type="text" placeholder="Nhập tên chi phí" />
                    </Form.Group>
                    <Form.Group className='d-flex flex-column w-100'>
                        <Form.Label>Ghi chú</Form.Label>
                        <TextareaAutosize minRows={5} className='rounded-3 p-2 fw-normal' style={{
                            borderColor: '#ced4da'
                        }} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='rounded-5' onClick={handleCloseUpdateMoney}>
                        Đóng
                    </Button>
                    <Button variant="success" className='rounded-5' onClick={handleCloseUpdateMoney}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateTour