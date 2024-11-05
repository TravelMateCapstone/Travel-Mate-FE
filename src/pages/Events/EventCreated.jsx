import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import '../../assets/css/Events/EventCreated.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import FormSubmit from '../../components/Shared/FormSubmit';

function EventCreated() {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const selectedEvent = useSelector(state => state.event.selectedEvent) || JSON.parse(localStorage.getItem('selectedEvent'));
  const token = useSelector((state) => state.auth.token);

  const [locations, setLocations] = useState([]);
  const [lastPath, setLastPath] = useState(null);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    setLastPath(location.pathname);
    localStorage.setItem('lastPath', location.pathname);
    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        const locationData = response.data.map((location) => {
          return {
            ...location,
            name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
          };
        });
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();

    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    if (storedEvent) {
      setEventName(storedEvent.title);
      setEventDescription(storedEvent.text || '');
      setEventLocation(storedEvent.location);
      setEventImage(storedEvent.img);
      setStartAt(storedEvent.startTime);
      setEndAt(storedEvent.endTime);
    }

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
  const toggleEditForm = () => setShowEditForm(!showEditForm);

  const handleEditEventSubmit = async () => {
    const eventData = {
      eventName: eventName,
      description: eventDescription,
      eventImageUrl: eventImage,
      createAt: selectedEvent.createAt,
      startAt: startAt,
      endAt: endAt,
      eventLocation: eventLocation
    };

    try {
      await axios.put(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/edit-by-current-user/${selectedEvent.id}`, eventData, {
        headers: { Authorization: `${token}` }
      });

      // Cập nhật local state với dữ liệu mới
      const updatedEvent = {
        ...selectedEvent,
        title: eventName,
        text: eventDescription,
        img: eventImage,
        startTime: startAt,
        endTime: endAt,
        location: eventLocation,
      };

      // Cập nhật Redux store với dữ liệu sự kiện mới
      dispatch({ type: 'UPDATE_SELECTED_EVENT', payload: updatedEvent });

      // Hiển thị thông báo thành công
      alert('Lưu thay đổi thành công!');

      // Đóng form chỉnh sửa
      toggleEditForm();
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
        <div>
          <div className='d-flex'>
            <div className='event-time'>
              <p>{selectedEvent.startTime}</p>
            </div>
          </div>

          <div className='justify-content-between'>
            <p className='event-name-inf'>{selectedEvent.title}</p>
            <div className='event-location-inf d-flex align-items-center'>
              <div className='icon'>
                <ion-icon name="location-outline"></ion-icon>
              </div>
              <div>
                <i className='text-location'>{selectedEvent.location}</i>
              </div>
            </div>

            <div className='d-flex align-items-center'>
              <div className='event-start-date'>
                <p className='my-4'>{selectedEvent.startTime}</p>
              </div>
              <div className='m-2 event-end-date'>
                <p className='m-2'>{selectedEvent.endTime}</p>
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
              <a href="#" className="dropdown-item">Quản lý sự kiện</a>
            </div>
          )}
        </div>
      </div>
      <div className="section-container">
        <div className="section-left my-4">
          <p className='m-3 title'>Nội dung</p>
          <p className='left-content m-3'>{selectedEvent.text}</p>
        </div>
        <div className="section-right my-4">
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='m-3 title'>Người tham gia</h4>
            <a href="#" className='view-all-link m-3'>Xem tất cả</a>
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

      {showEditForm && (
        <div className='edit-form'>
          <FormSubmit buttonText={'Lưu thay đổi'} onButtonClick={handleEditEventSubmit} title={'Chỉnh sửa sự kiện'} autoOpen={true}>
            <h3>Bảng thông tin</h3>
            <small>Nhập thông tin chỉnh sửa cho sự kiện của bạn</small>
            <Form>
              <Form.Group id="eventName" className="mb-3 mt-3">
                <Form.Label className='fw-bold'>Tên sự kiện</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </Form.Group>

              <Form.Group id="eventDescription" className="mb-3 mt-3">
                <Form.Label className='fw-bold'>Nội dung</Form.Label>
                <Form.Control
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
                    required
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                  />
                </Form.Group>

                <Form.Group id="endAt" className="mb-3 mt-3">
                  <Form.Label className='fw-bold'>Thời gian kết thúc</Form.Label>
                  <Form.Control
                    required
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </Form.Group>
              </div>

              <Form.Group id="eventImage" className="mb-3 mt-3">
                <Form.Label className='fw-bold'>Ảnh sự kiện</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={eventImage}
                  onChange={(e) => setEventImage(e.target.value)}
                />
              </Form.Group>


            </Form>
          </FormSubmit>
        </div>
      )}
    </div>
  );
}

export default EventCreated;
