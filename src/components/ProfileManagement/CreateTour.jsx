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
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
function CreateTour() {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const [tourImage, setTourImage] = useState(''); // Updated to be a string
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [valueSchedule, setValueSchedule] = useState('');
    const [valueCost, setValueCost] = useState('');
    const [valueRegulations, setValueRegulations] = useState('');
    const [openDays, setOpenDays] = useState([]); // Change to an array to track multiple open days
    const quillRef = useRef(null);
    const [showUpdateMoney, setShowUpdateMoney] = useState(false);
    const [duration, setDuration] = useState(2);
    const handleCloseUpdateMoney = () => setShowUpdateMoney(false);
    const handleShowUpdateMoney = () => setShowUpdateMoney(true);
    const [tourName, setTourName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [costTitle, setCostTitle] = useState('');
    const [costAmount, setCostAmount] = useState('');
    const [costNotes, setCostNotes] = useState('');
    const user = useSelector(state => state.auth.user);
    const [costDetails, setCostDetails] = useState([]);
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
    const generateItinerary = () => {
        const days = [];
        for (let i = 1; i <= duration; i++) {
            days.push({
                day: i,
                date: new Date().toISOString(),
                activities: []
            });
        }
        return days;
    };

    const [itinerary, setItinerary] = useState(generateItinerary());

    useEffect(() => {
        setItinerary(generateItinerary());
    }, [duration]);

    const addCostDetail = () => {
        const newCostDetail = {
            title: costTitle,
            amount: costAmount,
            notes: costNotes
        };
        setCostDetails([...costDetails, newCostDetail]);
        setCostTitle('');
        setCostAmount('');
        setCostNotes('');
    };

    const handleScheduleChange = async () => {
        const errors = [];
        if (!tourName) {
            errors.push("Vui lòng nhập tên tour du lịch!");
        }
        if (!startDate) {
            errors.push("Vui lòng chọn ngày bắt đầu!");
        }
        if (!endDate) {
            errors.push("Vui lòng chọn ngày kết thúc!");
        }
        if (!location) {
            errors.push("Vui lòng chọn địa điểm!");
        }
        if (!maxGuests) {
            errors.push("Vui lòng nhập số lượng khách!");
        }
        if (!tourImage) {
            errors.push("Vui lòng tải lên ảnh du lịch!");
        }
        if (itinerary.some(day => day.activities.length === 0)) {
            errors.push("Mỗi ngày trong lịch trình phải có ít nhất một hoạt động!");
        }
        if (itinerary.some(day => day.activities.some(activity => parseFloat(activity.activityAmount) < 0))) {
            errors.push("Giá hoạt động không được âm!");
        }
        if (!costTitle) {
            errors.push("Vui lòng nhập tên chi phí!");
        }
        if (!costAmount) {
            errors.push("Vui lòng nhập số tiền!");
        }
        if (parseFloat(costAmount) < 0) {
            errors.push("Số tiền không được âm!");
        }

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        const formattedItinerary = itinerary.map(day => ({
            day: day.day,
            date: day.date,
            activities: day.activities.map(activity => ({
                time: activity.time,
                description: activity.description,
                activityAddress: activity.activityAddress,
                activityAmount: activity.activityAmount,
                activityImage: activity.activityImage
            }))
        }));

        const totalCost = costDetails.reduce((sum, cost) => sum + parseFloat(cost.amount), 0);

        const formData = {
            tourName: tourName,
            price: totalCost,
            startDate: startDate,
            endDate: endDate,
            numberOfDays: duration,
            numberOfNights: duration - 1,
            location: location,
            maxGuests: maxGuests,
            tourImage: tourImage,
            itinerary: formattedItinerary,
            costDetails: costDetails,
            additionalInfo: valueRegulations
        };
        console.log(formData);

        try {
            const response = await axios.post('https://travelmateapp.azurewebsites.net/api/Tour', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success("Tạo tour thành công!");
            console.log('Tour created successfully:', response.data);
        } catch (error) {
            toast.error("Tạo tour không thành công!");
            console.error('Error creating tour:', error);
        }
    };

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
            setTourImage(e.target.files[0].name); // Updated to store the image name as a string
        }
    };
    const handleActivityImageChange = (dayIndex, activityIndex, e) => {
        if (e.target.files && e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setItinerary((prevItinerary) => {
                const updatedItinerary = [...prevItinerary];
                updatedItinerary[dayIndex].activities[activityIndex].activityImage = imageUrl;
                return updatedItinerary;
            });
        }
    };
    const handleActivityImageClick = (dayIndex, activityIndex) => {
        document.getElementById(`activity-image-input-${dayIndex}-${activityIndex}`).click();
    };
    const removeActivity = (dayIndex, activityIndex) => {
        setItinerary((prevItinerary) => {
            const updatedItinerary = [...prevItinerary];
            updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
            return updatedItinerary;
        });
    };
    const [key, setKey] = useState("home");


    const toggleDay = (day) => {
        setOpenDays((prevOpenDays) =>
            prevOpenDays.includes(day)
                ? prevOpenDays.filter((d) => d !== day)
                : [...prevOpenDays, day]
        );
    };

    const addActivity = (dayIndex) => {
        const newActivity = {
            time: "",
            description: "",
            activityAddress: "",
            activityAmount: "",
            activityImage: ""
        };
        setItinerary((prevItinerary) => {
            const updatedItinerary = [...prevItinerary];
            updatedItinerary[dayIndex].activities.push(newActivity);
            return updatedItinerary;
        });
    };

    const handleActivityChange = (dayIndex, activityIndex, field, value) => {
        setItinerary((prevItinerary) => {
            const updatedItinerary = [...prevItinerary];
            updatedItinerary[dayIndex].activities[activityIndex][field] = value;
            return updatedItinerary;
        });
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
                                <Form.Control type="text" placeholder="Nhập tên tour du lịch" value={tourName} onChange={(e) => setTourName(e.target.value)} />
                            </Form.Group>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Ngày bắt đầu</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Chọn thời gian diễn ra" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </Form.Group>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Ngày kêt thúc</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Chọn thời gian diễn ra" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </Form.Group>

                            <div className='location_createtour'>
                                <ProvinceSelector onSelect={(value) => setLocation(value)} />
                            </div>

                            <Form.Group className='d-flex align-items-center mb-3'>
                                <Form.Label className='text-nowrap'>Số lượng khách</Form.Label>
                                <Form.Control type="number" placeholder="Nhập tên tour du lịch" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
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
                            {itinerary.map((day, index) => (
                                <div className='day_plan' key={index}>
                                    <Button
                                        variant='' // Add a default variant
                                        className='d-flex justify-content-between align-items-center gap-3'
                                        onClick={() => toggleDay(day.day)}
                                        aria-controls={`open_plan_day_${day.day}`}
                                        aria-expanded={openDays.includes(day.day)}
                                    >
                                        <p className='m-0 d-flex justify-content-center align-items-center'>
                                            {openDays.includes(day.day) ? <ion-icon name="chevron-down-outline"></ion-icon> : <ion-icon name="chevron-forward-outline"></ion-icon>}
                                        </p>
                                        <h6 className='m-0 fw-bold'>Ngày {day.day}</h6>
                                    </Button>
                                    <Collapse in={openDays.includes(day.day)}>
                                        <div id={`open_plan_day_${day.day}`}>
                                            <div>
                                                <sub>{new Date(day.date).toLocaleDateString()}</sub>
                                            </div>
                                            <div className='timeline_day_container'>
                                                {day.activities.map((activity, idx) => (
                                                    <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2' key={idx}>
                                                        <div>
                                                            <Form.Control 
                                                                type="datetime-local" 
                                                                value={activity.time} 
                                                                onChange={(e) => handleActivityChange(index, idx, 'time', e.target.value)} 
                                                            />
                                                        </div>
                                                        <div className='d-flex gap-3 align-items-center'>
                                                            <img 
                                                                className='' 
                                                                src={activity.activityImage} 
                                                                alt="" 
                                                                width={50} 
                                                                height={50} 
                                                                onClick={() => handleActivityImageClick(index, idx)} 
                                                                style={{ cursor: 'pointer' }} 
                                                            />
                                                            <Form.Control 
                                                                id={`activity-image-input-${index}-${idx}`} 
                                                                type="file" 
                                                                className='d-none' 
                                                                onChange={(e) => handleActivityImageChange(index, idx, e)} 
                                                            />
                                                            <Form.Control 
                                                                placeholder='Nhập địa chỉ hoạt động' 
                                                                type="text" 
                                                                value={activity.activityAddress} 
                                                                onChange={(e) => handleActivityChange(index, idx, 'activityAddress', e.target.value)} 
                                                            />
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder='Nhập mô tả hoạt động' 
                                                                value={activity.description} 
                                                                onChange={(e) => handleActivityChange(index, idx, 'description', e.target.value)} 
                                                            />
                                                            <Form.Control 
                                                                type="number" 
                                                                placeholder='Nhập giá của hoạt động' 
                                                                value={activity.activityAmount} 
                                                                onChange={(e) => handleActivityChange(index, idx, 'activityAmount', e.target.value)} 
                                                            />
                                                            <Button variant="danger" onClick={() => removeActivity(index, idx)}>
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div id='' onClick={() => addActivity(index)}><ion-icon name="add-circle-outline"></ion-icon> Thêm hoạt động mới</div>
                                        </div>
                                    </Collapse>
                                </div>
                            ))}
                        </Tab>

                        {/* Tab Chi phí */}
                        <Tab eventKey="profile" title="CHI PHÍ">
                            <Row>
                                <Col lg={6}>
                                    <Form.Group className=''>
                                        <Form.Label>Tên chi phí</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên chi phí" value={costTitle} onChange={(e) => setCostTitle(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className=''>
                                        <Form.Label>Số tiền</Form.Label>
                                        <Form.Control type="number" placeholder="Nhập số tiền" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg={5}>
                                    <Form.Group className='d-flex flex-column'>
                                        <Form.Label>Ghi chú</Form.Label>
                                        <TextareaAutosize minRows={5} className='rounded-3 p-2 fw-normal' style={{
                                            borderColor: '#ced4da'
                                        }} value={costNotes} onChange={(e) => setCostNotes(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg={1} className='d-flex align-items-center'>
                                    <Button variant='' className='' onClick={addCostDetail}>
                                        <ion-icon name="add-circle-outline" style={{
                                            fontSize: '40px',
                                            color: '#198754'
                                        }}></ion-icon>
                                    </Button>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                {costDetails.map((cost, index) => (
                                    <Col lg={12} key={index}>
                                        <div className='money_item p-2 w-100'>
                                            <div className='d-flex justify-content-between align-content-center'>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <div onClick={setShowUpdateMoney}><ion-icon name="ellipsis-vertical-outline"></ion-icon></div>
                                                    <p className='m-0'>{cost.title}</p>
                                                </div>
                                                <p className='m-0 text-success'>
                                                    {cost.amount} VND
                                                </p>
                                            </div>
                                            <p className='w-50' style={{
                                                fontSize: '12px'
                                            }}>
                                                {cost.notes}
                                            </p>
                                        </div>
                                    </Col>
                                ))}
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
                    <Button variant="success" onClick={handleScheduleChange} className='rounded-5'>
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
                        <Form.Control type="text" placeholder="Nhập tên chi phí" value={costTitle} onChange={(e) => setCostTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='w-100'>
                        <Form.Label>Số tiền</Form.Label>
                        <Form.Control type="number" placeholder="Nhập số tiền" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='d-flex flex-column w-100'>
                        <Form.Label>Ghi chú</Form.Label>
                        <TextareaAutosize minRows={5} className='rounded-3 p-2 fw-normal' style={{
                            borderColor: '#ced4da'
                        }} value={costNotes} onChange={(e) => setCostNotes(e.target.value)} />
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