import React, { useCallback } from 'react';
import { Container, Placeholder } from 'react-bootstrap';
import PostProfile from '../../components/Profile/PostProfile';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

const PostProfileMemo = React.memo(PostProfile);

function PastTrips() {
  const token = useSelector((state) => state.auth.token);

  const fetchPosts = useCallback(async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/api/PastTripPosts', {
      headers: {
        Authorization: `${token}`
      }
    });
    return response.data.$values.map((post) => ({
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
      review: post.review,
      star: post.star,
      pastTripPostId: post.pastTripPostId,
      isPublic: post.isPublic
    }));
  }, [token]);

  const { data: posts, error, refetch, isLoading } = useQuery('pastTripPosts', fetchPosts, {
    enabled: !!token
  });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <Container className='border-0 rounded-5' style={{
      background: '#f9f9f9', 
      padding: '30px 40px',
    }}>
      <p className="mb-4 text-success fw-bold" style={{
        fontSize: '32px',
      }}>CHUYẾN ĐI</p>
      <div className=''>
        {isLoading ? (
          <PostProfileMemo isLoading={true} />
        ) : (
          posts?.length > 0 ? (
            posts.map((post, index) => (
              <PostProfileMemo
                key={index}
                title={post.title}
                location={post.location}
                date={post.date}
                description={post.description}
                images={post.images}
                userImage={post.userImage}
                userName={post.userName}
                review={post.review}
                star={post.star}
                id={post.pastTripPostId}
                isPublic={post.isPublic}
                onDelete={refetch}
              />
            ))
          ) : (
            <p>Bạn chưa có chuyến đi nào</p>
          )
        )}
      </div>
    </Container>
  );
}

export default PastTrips;
