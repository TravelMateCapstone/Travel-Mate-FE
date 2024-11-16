import React, { useEffect, useState } from 'react';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import PostGroupDetail from '../../components/Group/PostGroupDetail';

const GroupView = () => {
  const groupDataRedux = useSelector((state) => state.group.selectedGroup);
  const token = useSelector((state) => state.auth.token);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [status, setStatus] = useState('Hủy yêu cầu');
  const [posts, setPosts] = useState([]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const fetchPosts = async () => {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    setPosts(response.data.$values.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime)));
  };

  useEffect(() => {
    if (groupDataRedux.isJoined !== 'Pending' && groupDataRedux.isJoined !== 'UnJoined') {
      fetchPosts();
    }
  }, [groupDataRedux]);

  return (
    <div className='my_group_detail_container'>
      <img src={groupDataRedux.img || groupDataRedux.groupImageUrl} alt="" className='banner_group' />
      <div className='d-flex justify-content-between'>
        <div className='d-flex flex-column'>
          <p className='fw-bold m-0' style={{
            fontSize: '40px',
          }}>{groupDataRedux?.title || groupDataRedux.groupName || ''}</p>
          <p className='m-0 fw-medium' style={{
            fontSize: '20px',
          }}>{groupDataRedux.location}</p>
        </div>

      {status === 'Hủy yêu cầu' ? (
         <Button variant='outline-danger' className='rounded-5 d-flex align-items-center justify-content-center gap-1' style={{
          width: '175px',
          height: '44px',
          borderRadius: '10px',
          fontSize: '16px',
          textAlign: 'center'
        }}>Hủy Yêu cầu <ion-icon name="close" style={{
          fontSize: '20px',
        }}></ion-icon></Button>
      ) : (
        <Button variant='outline-success' className='rounded-5 d-flex align-items-center justify-content-center gap-1' style={{
          width: '175px',
          height: '44px',
          borderRadius: '10px',
          fontSize: '16px',
          textAlign: 'center'
        }}>Gửi yêu cầu <ion-icon name="arrow-forward" style={{
          fontSize: '20px',
        }}></ion-icon></Button>
      )}

      
      </div>
      <p className='fw-medium d-flex align-items-center gap-2 my-1'><ion-icon name="people-outline" style={{
        fontSize: '20px',
      }}></ion-icon> {groupDataRedux.members || groupDataRedux.numberOfParticipants} thành viên</p>
      <p className={`m-0 ${showFullDescription ? '' : 'description_short'}`}>
        {groupDataRedux.text || groupDataRedux.description}
      </p>
      {!showFullDescription && (groupDataRedux.description || groupDataRedux.text).length > 100 && (
        <button className='btn p-0' onClick={toggleDescription} style={{
          color: '#007931',
        }}>
          Xem thêm
        </button>
      )}
      {showFullDescription && (
        <button className='btn p-0' style={{
          color: '#007931',
        }} onClick={toggleDescription}>
          Thu gọn
        </button>
      )}
      <hr className='my-5' />
      {groupDataRedux.isJoined !== 'Pending' && groupDataRedux.isJoined !== 'UnJoined' && (
        <>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostGroupDetail key={post.groupPostId} post={post} />
            ))
          ) : (
            <p>Chưa có bài viết nào</p>
          )}
        </>
      )}
    </div>
  );
};

export default GroupView;
