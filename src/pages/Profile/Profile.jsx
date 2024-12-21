import React, { useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import '../../assets/css/Profile/Profile.css';
import AboutMe from '../../components/Profile/AboutMe';
import Favorites from '../../components/Profile/Favorites';
import Friends from '../../components/Profile/Friends';
import MyHome from '../../components/Profile/MyHome';
import PastTrips from '../../components/Profile/PastTrips';
import TourList from '../../components/Profile/TourList';  // Import the TourList component

function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  // Component array for mapping
  const tabComponents = [
    <AboutMe />,
    <MyHome />,
    <PastTrips />,
    <Friends />,
    // <Favorites />,
    <TourList />
  ];

  const tabIcons = [
    'information-circle-outline',
    'home-outline',
    'car-sport-outline',
    'people-outline',
    'bookmarks-outline',
    'map-outline',
  ];

  return (
    <div className="tabs">
      <div className="tab-header">
        {['Giới thiệu', 'Nhà của tôi', 'Chuyến đi', 'Bạn bè', 'Danh sách tour'].map((tab, index) => (
          <div
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => handleTabClick(index)}
          >
            {/* Add icon before the tab name */}
            <ion-icon name={tabIcons[index]} style={{
              fontSize: '14px',
            }}></ion-icon>
            <div className='fw-semibold' style={{
              fontSize: '13px',
            }}>{tab}</div>
          </div>
        ))}
      </div>

      <div className="tab-indicator">
        <div style={{ left: `${activeTab * 16.67}%` }}></div> {/* Adjust the width of the indicator */}
      </div>

      <div className="tab-body">
        <div className="active">
          {tabComponents[activeTab]}
        </div>
      </div>
    </div>
  );
}

export default Profile;
