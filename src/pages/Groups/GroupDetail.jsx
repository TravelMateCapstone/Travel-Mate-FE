import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormSubmit from '../../components/Shared/FormSubmit';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import RoutePath from '../../routes/RoutePath';

const GroupDetail = () => {
  const navigate = useNavigate();
  const groupDataRedux = useSelector((state) => state.group.selectedGroup);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [groupData, setGroupData] = useState();
  const [posts, setPosts] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState(groupDataRedux?.description || '');
  const [location, setLocation] = useState(groupDataRedux?.location || '');
  const [bannerImage, setBannerImage] = useState(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
  const [groupName, setGroupName] = useState(groupDataRedux?.text || groupDataRedux.groupName || '');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    setGroupData(groupDataRedux);
    setDescription(groupDataRedux?.description || '');
    setLocation(groupDataRedux?.location || '');
    setBannerImage(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
    setGroupName(groupDataRedux?.text || groupDataRedux.groupName || '');
    fetchPosts();
    fetchLocations();
  }, [groupDataRedux]);


  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('https://provinces.open-api.vn/api/');
      const processedLocations = response.data.map((location) => ({
        ...location,
        name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
      }));
      setLocations(processedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleDeletePost = (groupPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.groupPostId !== groupPostId));
  };

  const handleModalFileChange = (event) => {
    const files = [...event.target.files];
    setSelectedFiles(files);
  };

  const uploadFiles = async () => {
    const uploadedUrls = [];
    for (let file of selectedFiles) {
      const storageRef = ref(storage, `group_posts/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return uploadedUrls;
  };

  const createPost = async () => {


    const uploadedUrls = await uploadFiles();
    setUploadedImageUrls(uploadedUrls);
    const newPost = {
      title: document.getElementById('post_title').value,
      GroupPostPhotos: uploadedUrls.map((url) => ({ photoUrl: url })),
    };
    console.log(newPost);
    try {
      const respone = await axios.post(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts`, newPost, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(respone.data);

      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeleteImage = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const sortedPosts = response.data.$values.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  const leaveGroup = async () => {
    try {
      await axios.delete(`https://travelmateapp.azurewebsites.net/api/Groups/LeaveGroup/${groupDataRedux.id || groupDataRedux.groupId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success('Rời nhóm thành công');
      navigate(RoutePath.GROUP); // Điều hướng người dùng trở lại trang nhóm
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Có lỗi xảy ra khi rời nhóm');
    }
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

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
        <Form.Select
          size="lg"
          className='rounded-5'
          style={{
            width: '175px',
            height: '44px',
            border: '1px solid #409034',
            borderRadius: '10px',
            color: '#409034',
            fontSize: '16px',
            textAlign: 'center'
          }}
          onChange={(e) => {
            if (e.target.value === 'Rời nhóm') {
              leaveGroup();
            }
          }}
        >
          <option>Đã tham gia</option>
          <option>Rời nhóm</option>
        </Form.Select>

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

      <hr className='mt-4 mb-5 line_spit' />


      <div className='write_post_container mb-5'>
        <div className='d-flex align-items-center gap-3'>
          <img src={user.avatarUrl} alt="" width={50} height={50} className='rounded-circle' />
          <h5 className='m-0'>{user.FullName}</h5>
        </div>
        <textarea name="" id="post_title" placeholder='Bạn đang nghĩ gì... ?' onInput={autoResize} ></textarea>
        <input
          type="file"
          id="file-input"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className='uploaded_img_container'>
          {selectedFiles.length > 0 &&
            selectedFiles.map((file, index) => (
              <div className='uploaded_img_wrapper' key={index}>
                <img src={URL.createObjectURL(file)} alt="image-uploaded" className='object-fit-cover' />
                <div className='image_hover_overlay'>
                  <ion-icon name="eye-outline" class="overlay_icon" onClick={() => window.open(URL.createObjectURL(file), '_blank')}></ion-icon>
                  <ion-icon name="trash-outline" class="overlay_icon" onClick={() => handleDeleteImage(index)}></ion-icon>
                </div>
              </div>
            ))}
          <Button variant='outline-dark' className='button_add_upload' onClick={() => document.getElementById('file-input').click()}>
            <ion-icon name="add-outline"></ion-icon>
          </Button>
        </div>

        <div className='w-100 d-flex justify-content-end'>
          <Button variant='outline-success' className='rounded-5' onClick={createPost}>Đăng bài</Button>
        </div>
      </div>
      <hr className='mb-4 line_spit' />

      {posts.length > 0 ? (
        posts.map((post) => (
          <PostGroupDetail key={post.groupPostId} post={post} onDelete={handleDeletePost} fetchPosts={fetchPosts} />
        ))
      ) : (
        <p>Chưa có bài viết nào</p>
      )}
    </div>
  );
};

export default GroupDetail;
