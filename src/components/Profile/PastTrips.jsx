// PastTrips.js
import React from 'react';
import { Container } from 'react-bootstrap';
import PostProfile from '../../components/Profile/PostProfile';

function PastTrips() {
  const posts = [
    {
      title: "Tran Hai Dang",
      location: "Phố cổ Hội An, Quảng Nam",
      localLocation: 'Quảng Nam, Việt Nam',
      date: "24 tháng 9 lúc 9:01",
      description: "Hội An – phố cổ với những con hẻm nhỏ...",
      images: [
        "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg",
        "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg",
        "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
      ],
      userImage: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg",
      userName: "Hai Dang",
      userReview: "Đăng là người bạn đồng hành tuyệt vời!"
    },
    {
      title: "Stunning nature beauty Da Nang City",
      location: "Da Nang, Viet Nam",
      localLocation: 'Đà Nẵng, Việt Nam',
      date: "24 tháng 9 lúc 9:01",
      description: "Lorem ipsum dolor sit amet...",
      images: [
        "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg",
        "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
      ],
      userImage: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg",
      userName: "Hai Dang",
      userReview: "Lorem ipsum dolor sit amet..."
    }
  ];

  return (
    <Container className='border-0 rounded-5' style={{
      background: '#f9f9f9', 
      padding: '30px 40px',
    }}>
      <p className="mb-4 text-success fw-bold" style={{
        fontSize: '32px',
      }}>CHUYẾN ĐI</p>
      <div className=''>
      {posts.map((post, index) => (
        <PostProfile
          key={index}
          title={post.title}
          location={post.location}
          date={post.date}
          description={post.description}
          images={post.images}
          userImage={post.userImage}
          userName={post.userName}
          userReview={post.userReview}
          localLocation={post.localLocation}
        />
      ))}
      </div>
    </Container>
  );
}

export default PastTrips;
