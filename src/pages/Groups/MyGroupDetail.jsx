import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import RoutePath from '../../routes/RoutePath';

const MyGroupDetail = () => {
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

  const [description, setDescription] = useState(groupDataRedux?.description || groupDataRedux?.text || '');
  const [location, setLocation] = useState(groupDataRedux?.location || '');
  const [bannerImage, setBannerImage] = useState(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
  const [groupName, setGroupName] = useState(groupDataRedux?.title || groupDataRedux.groupName || '');

  console.log('Group Data redux:', groupDataRedux);


  useEffect(() => {
    setGroupData(groupDataRedux);
    setDescription(groupDataRedux?.description || groupDataRedux?.text || '');
    setLocation(groupDataRedux?.location || '');
    setBannerImage(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
    setGroupName(groupDataRedux?.title || groupDataRedux.groupName || '');
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


    try {
      console.log('Group id', groupDataRedux.groupId);

      await axios.post(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts`, newPost, {
        headers: {
          Authorization: `${token}`,
        },
      });
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

  const updateGroup = async () => {
    try {
      const updatedGroup = {
        groupName: groupName,
        location: location,
        description: description,
        groupImageUrl: bannerImage,
      };
      await axios.put(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}`, updatedGroup, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log('Nhóm đã được cập nhật thành công');
      fetchPosts();
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const deleteGroup = async () => {
    try {
      await axios.delete(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log('Nhóm đã được xóa thành công');
      navigate('/group'); // Chuyển hướng về trang GroupList
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <div className='my_group_detail_container'>
      <img src={groupDataRedux.img || groupDataRedux.groupImageUrl} alt="" className='banner_group' />
      <div className='d-flex justify-content-between'>
        <div className='d-flex gap-2'>
          <h2 className='fw-bold m-0'>{groupDataRedux?.title || groupDataRedux.groupName || ''}</h2>
          <h5 className='m-0 fw-medium'>{groupDataRedux.location}</h5>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="" id="dropdown-basic" className='border-0 bg-transparent'>
            <ion-icon name="settings-outline"></ion-icon>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className='form_edit_group'>
              <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'} onButtonClick={updateGroup}>
                <h4 className='fw-bold'>Bảng thông tin</h4>
                <p>Thay đổi thông tin chi tiết cho nhóm của bạn</p>
                <h4>Tên nhóm</h4>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder='Nhập tên nhóm'
                  value={groupName}
                  className='mb-3 border-1 name_group rounded-5 px-3 w-100'
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <h4>Miêu tả</h4>
                <textarea
                  placeholder='Nhập miêu tả'
                  className='mb-3 border-1 rounded-4 p-3 w-100 description_group'
                  value={description}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <h4>Địa điểm</h4>
                <Form.Select
                  aria-label="Default select example"
                  className='rounded-5 selecte_location mb-4'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Địa điểm</option>
                  {locations.map((loc) => (
                    <option key={loc.code} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </Form.Select>
                <h4>Ảnh bìa nhóm</h4>
                <input type="file" className='mb-3' id='banner_group' style={{ display: 'none' }} onChange={handleModalFileChange} onClick={(e) => e.stopPropagation()} />
                <Button variant='' className='rounded-5 mb-3 button_banner_group d-flex gap-1 justify-content-center align-items-center' onClick={() => document.getElementById('banner_group').click()}>
                  Nhấn vào đây để <p className='text-primary m-0'>upload</p>
                </Button>
                {bannerImage && (
                  <div className='mb-3'>
                    <img src={bannerImage} alt="Group Banner" width={100} height={100} />
                  </div>
                )}
              </FormSubmit>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link className='text-black' to={RoutePath.Group_Management}>Quản lí thành viên</Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={deleteGroup}>Xóa nhóm</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <p className='fw-semibold'>{groupDataRedux.members || groupDataRedux.numberOfParticipants} thành viên</p>
      <p className='fw-light'>{groupDataRedux.text || groupDataRedux.description}</p>
      <hr className='my-5' />

      <div className='write_post_container mb-5'>
        <div className='d-flex align-items-center gap-3'>
          <img src={user.avatarUrl} alt="" width={50} height={50} className='rounded-circle' />
          <h5 className='m-0'>{user.username}</h5>
        </div>
        <textarea name="" id="post_title" placeholder='Bạn đang nghĩ gì... ?'></textarea>
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
      <hr className='mb-4' />

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

export default MyGroupDetail;
