import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import PostProfile from '../../components/Profile/PostProfile';
import axios from 'axios';
import { useSelector } from 'react-redux';

function PastTrips() {
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.auth.token); // Giả sử token được lưu trong auth.token

  useEffect(() => {
    // Hàm lấy dữ liệu từ API

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/PastTripPosts', {
        headers: {
          Authorization: `${token}` // Thêm token vào header
        }
      });
      const data = response.data.$values.map((post) => ({
        title: post.caption,
        location: post.location,
        localLocation: post.localName,
        date: new Date(post.createdAt).toLocaleString('vi-VN', {
          day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        }),
        description: post.caption,
        images: post.postPhotos.$values.map(photo => photo.photoUrl),
        userImage: post.travelerAvatar,
        userName: post.travelerName,
        userReview: post.review,
        localName: post.localName,
        review: post.review,
        star: post.star,
        pastTripPostId: post.pastTripPostId,
        isPublic: post.isPublic
      }));
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
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
            localName={post.localName}
            review={post.review}
            star={post.star}
            id={post.pastTripPostId}
            isPublic={post.isPublic}
            onDelete={fetchPosts}
          />
        ))}
      </div>
    </Container>
  );
}

export default PastTrips;
