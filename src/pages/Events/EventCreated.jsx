import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Modal, Placeholder } from 'react-bootstrap';
import '../../assets/css/Events/EventCreated.css';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { storage } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import FormSubmit from '../../components/Shared/FormSubmit';

function EventCreated() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [locations, setLocations] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        const locationData = response.data.map((location) => ({
          ...location,
          name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
        }));
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();

    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));

    if (storedEvent) {
      setSelectedEvent(storedEvent);
      setEventName(storedEvent.title);
      setEventDescription(storedEvent.text || '');
      setEventLocation(storedEvent.location);
      setEventImage(storedEvent.img);
      setStartAt(storedEvent.startTime);
      setEndAt(storedEvent.startTime);
    }

    if (storedEvent) {
      const fetchMembers = async () => {
        try {
          const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/${storedEvent.id}/Event-With-Profiles-join`);
          setMembers(response.data.$values.map(item => item.profile));
        } catch (error) {
          console.error('Lỗi khi lấy danh sách người tham gia:', error);
        }
      };
      fetchMembers();
    }
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleEditForm = () => setShowEditForm(!showEditForm);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const formatDateTime = (dateTime) => {
    try {
      return format(new Date(dateTime), "hh:mm a dd/MM/yyyy");
    } catch {
      return dateTime;
    }
  };

  function formatDate(inputDateStr) {
    try {
      if (!inputDateStr || typeof inputDateStr !== 'string') {
        throw new Error("Input is not a valid string");
      }

      const [time, period, date] = inputDateStr.split(' ');
      if (!time || !period || !date) throw new Error("Invalid date format");

      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr, 10);
      let minute = parseInt(minuteStr, 10);
      if (isNaN(hour) || isNaN(minute)) throw new Error("Invalid time format");

      const [day, month, year] = date.split('/').map(Number);
      if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Invalid date components");
      }
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      const dateObj = new Date(year, month - 1, day, hour, minute);
      if (isNaN(dateObj.getTime())) throw new Error("Invalid Date Object");

      return dateObj.toISOString().slice(0, -8);
    } catch (error) {
      console.error("Date formatting error:", error.message);
      return null; // Trả về null hoặc xử lý lỗi phù hợp
    }
  }

  const handleEditEventSubmit = async () => {
    const createAt = selectedEvent.createAt || new Date().toISOString();

    try {

      const imageToUpdate = uploadedEventUrl || eventImage;

      const updatedEventData = {
        eventName,
        description: eventDescription,
        eventImageUrl: imageToUpdate,
        createAt,
        startAt: formatDate(startAt),
        endAt: formatDate(endAt),
        eventLocation,
      };

      // Log dữ liệu để kiểm tra
      console.log("Dữ liệu sự kiện cập nhật:", updatedEventData);

      const response = await axios.put(
        `https://travelmateapp.azurewebsites.net/api/EventControllerWOO/edit-by-current-user/${selectedEvent.id}`,
        updatedEventData,
        {
          headers: { Authorization: `${token}` },
        }
      );

      console.log("Response từ server:", response.data);

      // Cập nhật lại trạng thái của selectedEvent và eventImage
      const updatedEvent = { ...selectedEvent, ...updatedEventData };
      setSelectedEvent(updatedEvent);
      setEventImage(imageToUpdate); // Cập nhật lại eventImage để hiển thị ảnh mới
      localStorage.setItem('selectedEvent', JSON.stringify(updatedEvent));

      alert('Lưu thay đổi thành công!');
      toggleEditForm();
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      alert('Lỗi khi lưu thay đổi.');
    }
  };
  const handleDeleteEvent = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
      try {
        await axios.delete(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/current-user-delete-event/${selectedEvent.id}`, {
          headers: { Authorization: `${token}` },
        });
        alert('Xóa sự kiện thành công!');
        navigate(RoutePath.EVENT_CREATED);
      } catch (error) {
        console.error('Lỗi khi xóa sự kiện:', error);
        alert('Lỗi khi xóa sự kiện. Vui lòng thử lại sau.');
      }
    }
  };

  const [filePlaceholder, setFilePlaceholder] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [uploadedEventUrl, setUploadedEventUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showUploadButton, setShowUploadButton] = useState(false);

  const handleFileSelectForEvent = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const storageRef = ref(storage, `events/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setUploadedEventUrl(url);
        setEventImage(''); // Xóa ảnh mặc định khi upload ảnh mới
        setShowUploadButton(false); // Ẩn nút upload khi có ảnh mới
        toast.success('Ảnh đã được tải lên thành công');
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          uploadedEventUrl: 'Lỗi khi tải lên ảnh sự kiện',
        }));
        toast.error('Lỗi khi tải lên ảnh sự kiện');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const triggerFileInputEvent = () => {
    document.getElementById('fileInputEvent').click();
  };

  const handleDeleteImage = () => {
    setUploadedEventUrl('');
    setEventImage('');
    setShowUploadButton(true); // Hiển thị nút upload khi ảnh bị xóa
  };


  const [showViewImage, setShowViewImage] = useState(false);
  const [imageToView, setImageToView] = useState('');

  const handleView = (imageUrl) => {
    setImageToView(imageUrl);
    setShowViewImage(true);
  };

  const handleCloseView = () => {
    setShowViewImage(false);
  };


  if (!selectedEvent) {
    return <div>Không có sự kiện nào được chọn</div>;
  }

  return (
    <div className='event-create-container'>
      <img src={eventImage || selectedEvent.img} alt={eventName || selectedEvent.title} style={{
        height: '331px',
        objectFit: 'cover',
        borderRadius: '20px',
        marginBottom: '5px'
      }} />

      <div className='d-flex'>
        <div>
          <div className='d-flex'>
            <div className='event-time'>
              <p>{formatDateTime(startAt || selectedEvent.startTime)}</p>
            </div>
          </div>

          <div className='justify-content-between'>
            <p className='event-name-inf'>{eventName || selectedEvent.title}</p>
            <div className='event-location-inf d-flex align-items-center'>
              <div className='icon'>
                <ion-icon name="location-outline"></ion-icon>
              </div>
              <div>
                <i className='text-location'>{eventLocation || selectedEvent.location}</i>
              </div>
            </div>

            <div className='d-flex align-items-center'>
              <div className='event-start-date'>
                <p className='my-4'>{formatDateTime(startAt || selectedEvent.startTime)}</p>
              </div>
              <div className='m-2 event-end-date'>
                <p className='m-2'>{formatDateTime(endAt || selectedEvent.endTime)}</p>
              </div>
            </div>
          </div>

          <div className='event-location-inf d-flex align-items-center'>
            <div className='icon'>
              <ion-icon name="people-outline" className="icon-margin"></ion-icon>
            </div>
            <div>
              <i className='text-location'>{members.length} người tham gia</i>
            </div>
          </div>
        </div>
        <div className='event-setting' onClick={toggleDropdown} style={{ position: 'relative' }}>
          <ion-icon name="settings-outline"></ion-icon>
          {showDropdown && (
            <div className='dropdown-menu show' style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 1000,
              backgroundColor: '#fff',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '10px',
            }}>
              <a href="#" className="dropdown-item" onClick={toggleEditForm}>Chỉnh sửa thông tin</a>
              <a href="#" className="dropdown-item" onClick={handleDeleteEvent}>Xóa sự kiện</a>
            </div>
          )}
        </div>
      </div>
      <div className="section-container">
        <div className="section-left my-4">
          <p className='m-3 title'>Nội dung</p>
          <p className='left-content m-3'>{eventDescription || selectedEvent.text}</p>
        </div>
        <div className="section-right my-4">
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='m-3 title'>Người tham gia</h4>
            <a href="#" className='view-all-link m-3' onClick={handleShowModal}>Xem tất cả</a>
          </div>
          <div className='members-list m-3'>
            {members.map((member, index) => (
              <div key={index} className='member-item d-flex align-items-center'>
                <img
                  src={member.imageUser}
                  className='members-img'
                  alt={`member-${index}`}
                />
                <div className='member-info'>
                  <p className='member-name'>{member.fullName}</p>
                  <p className='member-location'>{member.city || 'Địa điểm không xác định'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal hiển thị danh sách người tham gia */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">Danh sách người tham gia</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          {members.map((member, index) => (
            <div key={index} className='member-item d-flex justify-content-between align-items-center member-list-item'>
              <div className='d-flex align-items-center member-info-container'>
                <img
                  src={member.imageUser}
                  className='members-img member-img'
                  alt={`member-${index}`}
                />
                <div className='member-info'>
                  <p className='member-name'>{member.fullName}</p>
                  <p className='member-location'>{member.city || 'Địa điểm không xác định'}</p>
                </div>
              </div>
              <Dropdown className="member-dropdown">
                <Dropdown.Toggle variant="light" id="dropdown-basic" className='dropdown-icon'>
                  <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu">
                  <Dropdown.Item href="#">Xem hồ sơ</Dropdown.Item>
                  <Dropdown.Item href="#">Gỡ</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {showEditForm && (
        <div className='edit-form'>
          <FormSubmit buttonText={'Lưu thay đổi'} onButtonClick={handleEditEventSubmit} title={'Chỉnh sửa sự kiện'} autoOpen={true}>
            <h3>Bảng thông tin</h3>
            <small>Nhập thông tin chỉnh sửa cho sự kiện của bạn</small>
            <Form>
              <Form.Group id="eventName" className="mb-3 mt-3">
                <Form.Label className='fw-bold'>Tên sự kiện</Form.Label>
                <Form.Control
                  className='form-input'
                  required
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </Form.Group>

              <Form.Group id="eventDescription" className="mb-3 mt-3">
                <Form.Label className='fw-bold'>Mô tả sự kiện</Form.Label>
                <Form.Control
                  className='form-input input-des'
                  required
                  as="textarea"
                  rows={4}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group id="eventLocation" className="mb-3 mt-3">
                <Form.Label className='fw-bold'>Địa điểm</Form.Label>
                <Form.Select
                  className='form-input'
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location.code} value={location.name}>{location.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className='time-event d-flex align-items-center'>
                <Form.Group id="startAt" className="mb-3 mt-3">
                  <Form.Label className='fw-bold'>Thời gian bắt đầu</Form.Label>
                  <Form.Control
                    className='form-input'
                    required
                    type="datetime-local"
                    value={formatDate(startAt)}
                    onChange={(e) => setStartAt(e.target.value)}
                  />
                </Form.Group>

                <Form.Group id="endAt" className="mb-3 mt-3">
                  <Form.Label className='fw-bold'>Thời gian kết thúc</Form.Label>
                  <Form.Control
                    className='form-input'
                    required
                    type="datetime-local"
                    value={formatDate(endAt)}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </Form.Group>
              </div>

              {/* Bắt đầu phần tải lên ảnh */}
              <Form.Group id="eventImage" className="mb-3 position-relative">
                <Form.Label>Ảnh sự kiện</Form.Label>

                {uploadedEventUrl || eventImage ? (
                  <div className="position-relative mt-3">
                    <img
                      src={uploadedEventUrl || eventImage}
                      alt="Ảnh đại diện sự kiện"
                      className="ms-3 mt-3"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px', marginBottom: '50px' }}
                    />
                    <ion-icon
                      name="eye-outline"
                      style={{
                        color: 'white',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '40%',
                        right: '50%',
                        fontSize: '32px',
                        borderRadius: '50%',
                        padding: '3px'
                      }}
                      onClick={() => handleView(uploadedEventUrl || eventImage)}
                    ></ion-icon>

                    <ion-icon
                      name="trash-outline"
                      style={{
                        color: 'white',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '40%',
                        right: '25%',
                        fontSize: '32px',
                        borderRadius: '50%',
                        padding: '3px'
                      }}
                      onClick={handleDeleteImage}
                    ></ion-icon>
                  </div>
                ) : (
                  showUploadButton && (
                    <Button onClick={triggerFileInputEvent} className="w-100 mb-2 upload-img">
                      Nhấn vào đây để <span className="upload">upload</span>
                    </Button>
                  )
                )}

                <Form.Control
                  type="file"
                  id="fileInputEvent"
                  onChange={handleFileSelectForEvent}
                  className="d-none"
                />

                {isUploading && (
                  <Placeholder as="div" animation="glow" className="mt-3">
                    <Placeholder xs={12} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
                  </Placeholder>
                )}

                {errors.uploadedEventUrl && (
                  <div style={{ color: 'red', marginTop: '5px' }}>
                    {errors.uploadedEventUrl}
                  </div>
                )}
              </Form.Group>
            </Form>
          </FormSubmit>
        </div>
      )}
      {/* Container để hiển thị ảnh phóng to mà không cần Modal */}
      {showViewImage && (
        <div className="fullscreen-image-container" onClick={handleCloseView}>
          <img
            src={imageToView}
            alt="Ảnh phóng to sự kiện"
            className="fullscreen-image"
          />
        </div>
      )}

    </div>
  );
}

export default EventCreated;
