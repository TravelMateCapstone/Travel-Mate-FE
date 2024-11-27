import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap'
import '../../assets/css/ProfileManagement/CreateTour.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function CreateTour() {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [valueSchedule, setValueSchedule] = useState('');
    const [valueCost, setValueCost] = useState('');
    const [valueRegulations, setValueRegulations] = useState('');
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
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

    return (
        <div>
            <Button variant="success" onClick={handleShow}  className='rounded-5'>
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
                                <Form.Label className='text-nowrap'>Chọn địa điểm</Form.Label>
                                <Form.Control type="text" placeholder="Nhập tên tour du lịch" />
                            </Form.Group>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Thời gian diễn ra</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Chọn thời gian diễn ra" />
                            </Form.Group>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Địa điểm</Form.Label>
                                <Form.Control type="text" placeholder="Nhập tên địa điểm du lịch" />
                            </Form.Group>
                            
                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Số lượng khách</Form.Label>
                                <Form.Control type="number" placeholder="Nhập tên tour du lịch" />
                            </Form.Group>
                            
                        </Col>
    
                        <Col lg={4}>
                            <div className='upload_image_create_trip d-flex align-items-center justify-content-center' onClick={() => {
                                document.getElementById('upload_trip_img_detail').click()
                            }}>
                                {image ? <img src={image} alt="Uploaded" className='w-100 object-fit-cover'  style={{
                                    maxHeight: '300px',
                                    borderRadius: '10px'
                                }}/> : (
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
                            <ReactQuill className='ql-container' modules={modules}  formats={formats} theme="snow" value={valueSchedule} onChange={setValueSchedule} />

                        </Tab>

                        {/* Tab Chi phí */}
                        <Tab eventKey="profile" title="CHI PHÍ">
                            <ReactQuill className='ql-container' modules={modules}  formats={formats} theme="snow" value={valueCost} onChange={setValueCost} />
                        </Tab>

                        {/* Tab Quy định */}
                        <Tab eventKey="contact" title="QUY ĐỊNH">
                            <ReactQuill className='ql-container' modules={modules}  formats={formats} theme="snow" value={valueRegulations} onChange={setValueRegulations} />
                        </Tab>

                    </Tabs>
                </div>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} className='rounded-5'>
                        Hủy
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