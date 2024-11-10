import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormSubmit from '../../components/Shared/FormSubmit';
import Form from 'react-bootstrap/Form';
import RoutePath from '../../routes/RoutePath';
import { toast } from 'react-toastify';
import { viewGroup } from '../../redux/actions/groupActions';

const MyGroupDetail = () => {
  const navigate = useNavigate();
  const groupDataRedux = useSelector((state) => state.group.selectedGroup);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [groupData, setGroupData] = useState();
  const [posts, setPosts] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const editTextareaRef = useRef(null);

  const [description, setDescription] = useState(groupDataRedux?.description || groupDataRedux?.text || '');
  const [location, setLocation] = useState(groupDataRedux?.location || '');
  const [bannerImage, setBannerImage] = useState(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
  const [groupName, setGroupName] = useState(groupDataRedux?.title || groupDataRedux.groupName || '');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    setGroupData(groupDataRedux);
    setDescription(groupDataRedux?.description || groupDataRedux?.text || '');
    setLocation(groupDataRedux?.location || '');
    setBannerImage(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
    setGroupName(groupDataRedux?.title || groupDataRedux.groupName || '');
    fetchPosts();
    fetchLocations();
  }, [groupDataRedux]);


  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleGroupNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 25) {
      setErrorMessage('Tên nhóm không được vượt quá 25 ký tự');
    } else if (value.length < 10) {
      setErrorMessage('Tên nhóm phải có ít nhất 10 ký tự');
    } else {
      setErrorMessage(''); // Xóa thông báo lỗi nếu hợp lệ
    }
    setGroupName(value);
  };

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };
  const handleBannerFileChange = (event) => {
    setSelectedBannerFile(event.target.files[0]);
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
  const uploadBannerImage = async () => {
    if (!selectedBannerFile) return null;
    const storageRef = ref(storage, `group_banners/${selectedBannerFile.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, selectedBannerFile);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading banner image:', error);
      return null;
    }
  };
  const updateGroup = async () => {
    setIsLoading(true);
    let newBannerUrl = bannerImage;
    if (selectedBannerFile) {
      newBannerUrl = await uploadBannerImage();
      setBannerImage(newBannerUrl);
    }
    try {
      const updatedGroup = {
        id: groupDataRedux.id || groupDataRedux.groupId,
        groupName: groupName,
        location: location,
        description: description,
        groupImageUrl: newBannerUrl,
      };
      await axios.put(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}`, updatedGroup, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success('Nhóm đã được cập nhật thành công');
      dispatch(viewGroup(updatedGroup));
      fetchPosts();
    } catch (error) {
      console.error('Error updating group:', error);
    } finally {
      setIsLoading(false);
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
      navigate('/group');
    } catch (error) {
      console.error('Error deleting group:', error);
    }
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
        <Dropdown>
          <Dropdown.Toggle variant="" className='button_setting border-0 p-0 bg-transparent'>
            <ion-icon name="settings" style={{
              fontSize: '30px',
            }}></ion-icon>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{
            border: 'none',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
          }}>
            <Dropdown.Item className='form_edit_group'>
              <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'} onButtonClick={updateGroup}>
                <h4>Tên nhóm</h4>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder='Nhập tên nhóm'
                  value={groupName}
                  className='mb-3 border-1 name_group rounded-5 px-3 w-100'
                  onChange={handleGroupNameChange}
                />
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <h4>Miêu tả</h4>
                <textarea

                  placeholder='Nhập miêu tả'
                  className='mb-3 border-1 rounded-4 p-3 w-100 description_group'
                  value={description}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChange={(e) => setDescription(e.target.value)}
                  onInput={autoResize}
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
                <input
                  type="file"
                  className='mb-3'
                  id='banner_group'
                  style={{ display: 'none' }}
                  onChange={handleBannerFileChange}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant=''
                  className='rounded-5 mb-3 button_banner_group d-flex gap-1 justify-content-center align-items-center'
                  onClick={() => document.getElementById('banner_group').click()}
                >
                  Nhấn vào đây để <p className='text-primary m-0'>upload</p>
                </Button>
                {(selectedBannerFile || bannerImage) && (
                  <div className='mb-3 position-relative'>
                    <img
                      src={selectedBannerFile ? URL.createObjectURL(selectedBannerFile) : bannerImage}
                      alt="Group Banner"
                      width={100}
                      height={100}
                      className='object-fit-cover rounded-4'
                    />
                    <Button
                      variant=""
                      className='mt-2 position-absolute'
                      style={{
                        top: -15,
                        left: 55,
                        borderRadius: '50%',
                        color: 'red',
                        fontSize: '30px',
                      }}
                      onClick={() => {
                        setSelectedBannerFile(null);
                        setBannerImage('');
                      }}
                    >
                      <ion-icon name="close-circle-outline"></ion-icon>
                    </Button>
                  </div>
                )}
              </FormSubmit>
            </Dropdown.Item>

            <Dropdown.Item>
              <Link className='text-black' to={RoutePath.Group_Management}>Quản lí thành viên</Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Xóa nhóm</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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


      {posts.length > 0 ? (
        posts.map((post) => (
          <div>
            <hr className='line_spit' />
            <PostGroupDetail key={post.groupPostId} post={post} onDelete={handleDeletePost} fetchPosts={fetchPosts} /></div>
        ))
      ) : (
        <p>Chưa có bài viết nào</p>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="custom-modal_deletGroup">
        <Modal.Body className="custom-modal-body">
          <div>
            <ion-icon name="warning-outline" style={
              {
                fontSize: '30px',
                color: '#AC0B0B',
              }
            }></ion-icon>
          </div>
          <p className='mb-0 fw-medium text-black'>Bạn có muốn xóa không ?</p>
          <p className='m-0' style={{
            fontSize: '12px',
            color: '#6E6E6E',
          }}>Sau khi xóa bạn không thể hoàn tác</p>
        </Modal.Body>
        <Modal.Footer className='d-flex gap-3 justify-content-center'>
          <Button variant="" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="" onClick={() => {
            deleteGroup();
            setShowDeleteModal(false);
          }}
            className='rounded-5'
            style={{
              background: '#AC0B0B',
              color: '#fff',
            }}>
            Xóa nhóm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyGroupDetail;
