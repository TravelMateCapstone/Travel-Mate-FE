import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import PostProfile from '../../components/Profile/PostProfile';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PostProfileMemo = React.memo(PostProfile);

function PastTrips() {
  const [posts, setPosts] = useState([]);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    axios.get('https://travelmateapp.azurewebsites.net/api/PastTripPosts/UserTrips', {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => setPosts(response.data.$values))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

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
