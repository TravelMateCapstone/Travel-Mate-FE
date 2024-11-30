import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal, Dropdown, Form, Tabs, Tab, Button, Collapse } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import RoutePath from '../../../routes/RoutePath';
import { useDispatch } from 'react-redux';
import { fetchTour } from '../../../redux/actions/tourActions';
import ProvinceSelector from '../../Shared/ProvinceSelector';
import TextareaAutosize from 'react-textarea-autosize';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';

function MyFavorites() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 8;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const quillRef = useRef(null);
  const [showUpdateMoney, setShowUpdateMoney] = useState(false);

  const handleCloseUpdateMoney = () => setShowUpdateMoney(false);
  const handleShowUpdateMoney = () => setShowUpdateMoney(true);

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

  const fetchFavorites = async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Tour/local');
    return response.data;
  };

  const { data: dataProfile, isLoading: loading, refetch } = useQuery('favorites', fetchFavorites);

  const formatPrice = (tour) => {
    const totalCost = tour.costDetails.$values.reduce((sum, cost) => sum + cost.amount, 0);
    const totalActivityAmount = tour.itinerary.$values.reduce((sum, day) => {
      return sum + day.activities.$values.reduce((activitySum, activity) => activitySum + activity.activityAmount, 0);
    }, 0);
    const totalPrice = totalCost + totalActivityAmount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);
  };

  const handeleViewTour = (tour) => {
    dispatch(fetchTour(tour.tourId));
    navigate(RoutePath.TOUR_DETAIL);
  }

  const handleEditClick = async (tourId) => {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`);
    setSelectedFavorite(response.data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFavorite(null);
  };

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

  const handleDeleteTour = async (tourId) => {
    try {
      await axios.delete(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`);
      toast.success('Xóa tour thành công');
      refetch(); // Automatically update the list
      console.log('Tour deleted successfully');
    } catch (error) {
      console.error('Error deleting tour', error);
    }
  };

  const displayedFavorites = loading || !dataProfile || !dataProfile.$values
    ? []
    : dataProfile.$values;
  const [key, setKey] = useState("home");


  const [tourName, setTourName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [tourImage, setTourImage] = useState('');
  const [itinerary, setItinerary] = useState([]);
  const [costDetails, setCostDetails] = useState([]);
  const [valueRegulations, setValueRegulations] = useState('');

  const [costTitle, setCostTitle] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costNotes, setCostNotes] = useState('');


  useEffect(() => {
    if (selectedFavorite) {
      setTourName(selectedFavorite.tourName);
      setStartDate(new Date(selectedFavorite.startDate).toISOString().slice(0, 16));
      setEndDate(new Date(selectedFavorite.endDate).toISOString().slice(0, 16));
      setDuration(selectedFavorite.numberOfDays);
      setLocation(selectedFavorite.location);
      setMaxGuests(selectedFavorite.maxGuests);
      setTourImage(selectedFavorite.tourImage);
      setItinerary(selectedFavorite.itinerary.$values);
      setCostDetails(selectedFavorite.costDetails.$values);
      setValueRegulations(selectedFavorite.additionalInfo);
    }
  }, [selectedFavorite]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTourImage(URL.createObjectURL(file));
    }
  };
  const [openDays, setOpenDays] = useState([]);
  const toggleDay = (day) => {
    setOpenDays((prevOpenDays) =>
      prevOpenDays.includes(day)
        ? prevOpenDays.filter((d) => d !== day)
        : [...prevOpenDays, day]
    );
  };

  const handleUpdateTour = () => {
    const formData = {
      tourName: tourName,
      price: 1,
      startDate: startDate,
      endDate: endDate,
      numberOfDays: duration,
      numberOfNights: duration - 1,
      location: location,
      maxGuests: maxGuests,
      tourImage: tourImage,
      itinerary: itinerary,
      costDetails: costDetails,
      additionalInfo: valueRegulations
    };
    console.log('update tour', formData);
    axios.put(`https://travelmateapp.azurewebsites.net/api/Tour/${selectedFavorite.tourId}`, formData)
      .then(response => {
        console.log('Tour updated successfully', response.data);
        setShowModal(false);
        refetch(); // Refetch the data after updating the tour
      })
      .catch(error => {
        console.error('Error updating tour', error);
      });
  }

  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.$values[activityIndex][field] = value;
    setItinerary(updatedItinerary);
  };

  const handleActivityImageChange = (dayIndex, activityIndex, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedItinerary = [...itinerary];
      updatedItinerary[dayIndex].activities.$values[activityIndex].activityImage = URL.createObjectURL(file);
      setItinerary(updatedItinerary);
    }
  };

  const handleActivityImageClick = (dayIndex, activityIndex) => {
    document.getElementById(`activity-image-input-${dayIndex}-${activityIndex}`).click();
  };

  const addActivity = (dayIndex) => {
    const newActivity = {
      time: '',
      activityImage: '',
      activityAddress: '',
      description: '',
      activityAmount: ''
    };
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.$values.push(newActivity);
    setItinerary(updatedItinerary);
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.$values.splice(activityIndex, 1);
    setItinerary(updatedItinerary);
  };

  return (
    <Container className='py-3 px-0 border-0 rounded-5'>
      {/* Content */}
      {loading ? (
        <Skeleton height={200} count={4} style={{ marginBottom: '20px' }} />
      ) : (
        <div>
          {displayedFavorites.length === 0 ? (
            <div className="text-center" style={{ fontStyle: 'italic', color: '#6c757d' }}>
              Không có tours nào
            </div>
          ) : (
            <div className='px-3'>
              {displayedFavorites.map((favorite, index) => (
                <><Row key={index} className="border-bottom rounded p-3 mb-3 bg-white">
                  {/* Phần Ảnh */}
                  <Col md={2} className="d-flex align-items-center">
                    <img
                      src={favorite.tourImage}
                      alt={favorite.tourName}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  </Col>

                  {/* Phần thông tin */}
                  <Col md={4}>
                    <h5>{favorite.tourName}</h5>
                    <p className="d-flex align-items-center">
                      <ion-icon name="location-outline" style={{ marginRight: '8px' }}></ion-icon> {favorite.location}</p>
                    <p className="d-flex align-items-center">
                      <ion-icon name="time-outline" style={{ marginRight: '8px' }}></ion-icon> {favorite.numberOfDays} ngày {favorite.numberOfNights} đêm</p>
                  </Col>

                  {/* Phần giá và số lượng */}
                  <Col md={2} className="d-flex align-items-center">
                    <p>{formatPrice(favorite)}</p>
                  </Col>

                  <Col md={3} className="d-flex flex-column justify-content-center align-items-center">
                    <p className="d-flex align-items-center">
                      <ion-icon name="people-outline" style={{ marginRight: '8px' }}></ion-icon>
                      {favorite.maxGuests}
                    </p>
                    <p className="d-flex align-items-center">
                      {favorite.status}
                    </p>
                    <p className="d-flex align-items-center">
                      {favorite.startDate}
                    </p>
                  </Col>
                  {/* onClick={() => handeleViewTour(favorite)} */}
                  {/* Icon cài đặt */}
                  <Col md={1} className="">
                    <Dropdown>
                      <Dropdown.Toggle variant="" className='d-flex justify-content-center align-items-center'>
                        <ion-icon name="settings-outline"></ion-icon>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handeleViewTour(favorite)}>Xem thêm</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEditClick(favorite.tourId)}>Chỉnh sửa</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeleteTour(favorite.tourId)}>Xóa</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>


                </>


              ))}
            </div>
          )}

        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} dialogClassName='modal_extraDetailForm' >
        <Modal.Body>
     <div className='w-100'>
            <h4>Chỉnh sửa tour</h4>
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
                  <ProvinceSelector onSelect={(value) => setLocation(value)} initialValue={location} />
                </div>
  
                <Form.Group className='d-flex align-items-center mb-3'>
                  <Form.Label className='text-nowrap'>Số lượng khách</Form.Label>
                  <Form.Control type="number" placeholder="Nhập tên tour du lịch" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
                </Form.Group>
  
              </Col>
  
              <Col lg={4}>
                <div className='upload_image_create_trip d-flex align-items-center justify-content-center' onClick={() => {
                  document.getElementById('upload_trip_img_detail_update').click()
                }}>
                  {tourImage ? <img src={tourImage} alt="Uploaded" className='w-100 object-fit-cover' style={{
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
                          {day.activities.$values.map((activity, idx) => (
                            <div className='w-100 d-flex gap-3 border-1 rounded-3 p-2 mb-2' key={idx}>
                              <div>
                                <Form.Control
                                  type="time"
                                  value={activity.time}
                                  onChange={(e) => handleActivityChange(index, idx, 'time', e.target.value)} />
                              </div>
                              <div className='d-flex gap-3 align-items-center'>
                                <img
                                  className=''
                                  src={activity.activityImage}
                                  alt=""
                                  width={50}
                                  height={50}
                                  onClick={() => handleActivityImageClick(index, idx)}
                                  style={{ cursor: 'pointer' }} />
                                <Form.Control
                                  id={`activity-image-input-${index}-${idx}`}
                                  type="file"
                                  className='d-none'
                                  onChange={(e) => handleActivityImageChange(index, idx, e)} />
                                <Form.Control
                                  placeholder='Nhập địa chỉ hoạt động'
                                  type="text"
                                  value={activity.activityAddress}
                                  onChange={(e) => handleActivityChange(index, idx, 'activityAddress', e.target.value)} />
                                <Form.Control
                                  type="text"
                                  placeholder='Nhập mô tả hoạt động'
                                  value={activity.description}
                                  onChange={(e) => handleActivityChange(index, idx, 'description', e.target.value)} />
                                <Form.Control
                                  type="number"
                                  placeholder='Nhập giá của hoạt động'
                                  value={activity.activityAmount}
                                  onChange={(e) => handleActivityChange(index, idx, 'activityAmount', e.target.value)} />
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
                    onChange={setValueRegulations} />
  
                </div>
                <div className='d-flex gap-2 mt-3'>
                  <input type="checkbox" />
                  <div className='m-0'>Bằng cách tạo tour này, bạn xác nhận rằng đã đọc, hiểu và đồng ý với các <Link to={RoutePath.HOMEPAGE} className='m-0 text-decoration-underline'>Điều khoản và Quy định</Link> của chúng tôi</div>
                </div>
              </Tab>
            </Tabs>
  
  
     </div>
        </Modal.Body>
        <Modal.Footer className='border-top-0'>
          <button className='btn btn-primary' onClick={() => handleUpdateTour()}>Lưu thay đổi</button>
          <button className='btn btn-secondary' onClick={handleCloseModal}>Đóng</button>
        </Modal.Footer>
      </Modal>

      <input type="file" id='upload_trip_img_detail_update' className='d-none' onChange={handleImageChange} />
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
    </Container>
  );
}

export default MyFavorites;
