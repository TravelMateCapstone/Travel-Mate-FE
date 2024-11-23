import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import PostProfile from '../../components/Profile/PostProfile';
import { useSelector } from 'react-redux';

const PostProfileMemo = React.memo(PostProfile);

function PastTrips() {
  const [posts, setPosts] = useState([]);

  const dataProfile = useSelector(state => state.profile);

  // Chỉ setPosts khi dataProfile.trip có dữ liệu hợp lệ
  useEffect(() => {
    if (dataProfile?.trip?.$values && Array.isArray(dataProfile.trip.$values)) {
      setPosts(dataProfile.trip.$values);
    }
  }, [dataProfile]);  // Chạy lại khi dataProfile thay đổi

  return (
    <Container className='border-0 rounded-5' style={{
      background: '#f9f9f9',
      padding: '30px 40px',
    }}>
      <p className="mb-4 text-success fw-bold" style={{
        fontSize: '32px',
      }}>CHUYẾN ĐI</p>

      {posts.length > 0 ? (
        posts.map(post => (
          <PostProfileMemo key={post.pastTripPostId} {...post} />
        ))
      ) : (
        <div className=''>
          <p>Bạn chưa có chuyến đi nào</p>
        </div>
      )}
    </Container>
  );
}

export default PastTrips;
