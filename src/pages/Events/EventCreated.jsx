import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import '../../assets/css/Events/EventCreated.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

function EventCreated() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const selectedEvent = useSelector(state => state.event.selectedEvent) || JSON.parse(localStorage.getItem('selectedEvent'));
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (selectedEvent) {
      setEventName(selectedEvent.title);
      setEventDescription(selectedEvent.text || '');
      setEventLocation(selectedEvent.location);
      setEventImage(selectedEvent.img);
      setStartAt(selectedEvent.startTime);
      setEndAt(selectedEvent.endTime);

      const fetchMembers = async () => {
        try {
          const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/${selectedEvent.id}/Event-With-Profiles-join`);
          setMembers(response.data.$values.map(item => item.profile));
        } catch (error) {
          console.error('Lỗi khi lấy danh sách người tham gia:', error);
        }
      };
      fetchMembers();
    }
  }, [selectedEvent]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const handleEditEventSubmit = async () => {


    const eventData = {
      eventName,
      description: eventDescription,
      eventImageUrl: eventImage,
      createAt: selectedEvent.createAt,
      startAt,
      endAt,
      eventLocation
    };

    try {
      await axios.put(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/edit-by-current-user/${selectedEvent.id}`, eventData, {
        headers: { Authorization: `${token}` }
      });
      console.log('Event updated:', eventData);
      closeEditModal();
      alert('Lưu thay đổi thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      alert('Lỗi khi lưu thay đổi.');
    }
  };

  if (!selectedEvent) {
    return <div>No event selected</div>;
  }

  return (
    <div className='event-create-container'>
      <img src={selectedEvent.img} alt={selectedEvent.title} style={{
        height: '331px',
        objectFit: 'cover',
        borderRadius: '20px',
        marginBottom: '5px'
      }} />

      <div className='d-flex'>
        <div className='event-time'>
          <p>{selectedEvent.startTime}</p>
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
              <a href="#" className="dropdown-item" onClick={openEditModal}>Chỉnh sửa thông tin</a>
              <a href="#" className="dropdown-item">Quản lý sự kiện</a>
            </div>
          )}
        </div>
      </div>

      <div className='justify-content-between'>
        <p className='event-name-inf'>{eventName}</p>
        <div className='event-location-inf'>
          <i className='bi bi-geo-alt'></i> {eventLocation}
        </div>
      </div>

      <div>
        <p><ion-icon name="people-outline" className="icon-margin"></ion-icon> {members.length} người tham gia</p>
      </div>

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group id="eventName" className="mb-3">
              <Form.Label>Tên sự kiện</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sự kiện"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="eventDescription" className="mb-3">
              <Form.Label>Mô tả sự kiện</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả sự kiện"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="location" className="mb-3">
              <Form.Label>Địa điểm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa điểm"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="eventImage" className="mb-3">
              <Form.Label>Ảnh đại diện sự kiện</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL ảnh đại diện"
                value={eventImage}
                onChange={(e) => setEventImage(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="startAt" className="mb-3">
              <Form.Label>Thời gian bắt đầu</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="endAt" className="mb-3">
              <Form.Label>Thời gian kết thúc</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>Hủy</Button>
          <Button variant="primary" onClick={handleEditEventSubmit}>Lưu thay đổi</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EventCreated;
