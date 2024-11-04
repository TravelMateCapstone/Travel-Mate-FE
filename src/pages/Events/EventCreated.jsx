import React, { useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../../assets/css/Events/EventCreated.css';
import { useSelector } from 'react-redux';

function EventCreated() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [members, setMembers] = useState([]);
  const selectedEvent = useSelector(state => state.event.selectedEvent) || JSON.parse(localStorage.getItem('selectedEvent'));
  console.log("ev id:", selectedEvent.id);
  console.log("ev mb:", members.length);
  useEffect(() => {
    if (selectedEvent) {
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

  if (!selectedEvent) {
    return <div>No event selected</div>;
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
              <a href="#" className="dropdown-item">Chỉnh sửa thông tin</a>
              <a href="#" className="dropdown-item">Quản lý sự kiện</a>
            </div>
          )}
        </div>
      </div>

      <div className='justify-content-between'>
        <p className='event-name-inf'>{selectedEvent.title}</p>
        <div className='event-location-inf'>
          <i className='bi bi-geo-alt'></i> {selectedEvent.location}
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
      <div>
        <p><ion-icon name="people-outline" className="icon-margin"></ion-icon> {selectedEvent.members} người tham gia</p>
      </div>
    </div>
  );
}

export default EventCreated;
