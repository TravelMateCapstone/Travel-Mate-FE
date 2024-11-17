import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormSubmit from '../../components/Shared/FormSubmit';
import Form from 'react-bootstrap/Form';
import RoutePath from '../../routes/RoutePath';
import { toast } from 'react-toastify';
import { viewGroup } from '../../redux/actions/groupActions';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import TextareaAutosize from 'react-textarea-autosize';
import ConfirmModal from '../../components/Shared/ConfirmModal';
import { useCustomQuery, useCustomMutation, fetchData, postData, putData, deleteData } from '../../hooks/customHook';

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
  const [postTitle, setPostTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [description, setDescription] = useState(groupDataRedux?.description || groupDataRedux?.text || '');
  const [location, setLocation] = useState(groupDataRedux?.location || '');
  const [bannerImage, setBannerImage] = useState(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
  const [groupName, setGroupName] = useState(groupDataRedux?.title || groupDataRedux.groupName || '');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const queryClient = useQueryClient();

  const uploadFiles = useCallback(async () => {
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
  }, [selectedFiles]);

  const uploadBannerImage = useCallback(async () => {
    if (!selectedBannerFile) return null;
    const storageRef = ref(storage, `group_banners/${selectedBannerFile.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, selectedBannerFile);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading banner image:', error);
      return null;
    }
  }, [selectedBannerFile]);

  const fetchGroupData = useCallback(async () => {
    try {
      const [postsResponse, locationsResponse] = await Promise.all([
        fetchData(`${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux?.id || groupDataRedux?.groupId}/groupposts`, token),
        axios.get('https://provinces.open-api.vn/api/')
      ]);

      const sortedPosts = postsResponse.$values.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
      const processedLocations = locationsResponse.data.map((location) => ({
        ...location,
        name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
      }));

      return { sortedPosts, processedLocations };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { sortedPosts: [], processedLocations: [] };
    }
  }, [groupDataRedux?.id, groupDataRedux?.groupId, token]);

  const createPost = useCallback(async () => {
    setIsPosting(true);
    const uploadedUrls = await uploadFiles();
    setUploadedImageUrls(uploadedUrls);
    const newPost = {
      title: postTitle,
      GroupPostPhotos: uploadedUrls.map((url) => ({ photoUrl: url })),
    };
    try {
      await postData(`${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux?.id || groupDataRedux?.groupId}/groupposts`, newPost, token);
      setPostTitle('');
      setSelectedFiles([]);
      toast.success('Bài viết đã được đăng thành công');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  }, [groupDataRedux?.id, groupDataRedux?.groupId, postTitle, token, uploadFiles]);

  const updateGroup = useCallback(async () => {
    setIsLoading(true);
    let newBannerUrl = bannerImage;
    if (selectedBannerFile) {
      newBannerUrl = await uploadBannerImage();
      setBannerImage(newBannerUrl);
    }
    try {
      const updatedGroup = {
        id: groupDataRedux?.id || groupDataRedux?.groupId,
        groupName: groupName,
        location: location,
        description: description,
        groupImageUrl: newBannerUrl,
      };
      await putData(`${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux?.id || groupDataRedux?.groupId}`, updatedGroup, token);
      toast.success('Nhóm đã được cập nhật thành công');
      dispatch(viewGroup(updatedGroup));
    } catch (error) {
      console.error('Error updating group:', error);
    } finally {
      setIsLoading(false);
    }
  }, [bannerImage, description, dispatch, groupDataRedux?.groupId, groupDataRedux?.id, groupName, location, selectedBannerFile, token, uploadBannerImage]);

  const deleteGroup = useCallback(async () => {
    try {
      await deleteData(`${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux?.id || groupDataRedux?.groupId}`, token);
      console.log('Nhóm đã được xóa thành công');
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  }, [groupDataRedux?.groupId, groupDataRedux?.id, token]);

  const updatePost = useCallback(async (postId, updatedData) => {
    try {
      await putData(`${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux?.id || groupDataRedux?.groupId}/groupposts/${postId}`, updatedData, token);
      toast.success('Bài viết đã được cập nhật thành công');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Không thể cập nhật bài viết');
    }
  }, [groupDataRedux?.id, groupDataRedux?.groupId, token]);

  const { data, refetch } = useCustomQuery(
    ['groupData', groupDataRedux?.id || groupDataRedux?.groupId],
    fetchGroupData,
    { enabled: !!groupDataRedux?.id || !!groupDataRedux?.groupId }
  );

  const createPostMutation = useCustomMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['groupData', groupDataRedux?.id || groupDataRedux?.groupId]);
    },
  });

  const updateGroupMutation = useCustomMutation(updateGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries(['groupData', groupDataRedux?.id || groupDataRedux?.groupId]);
    },
  });

  const deleteGroupMutation = useCustomMutation(deleteGroup, {
    onSuccess: () => {
      navigate('/group');
    },
  });

  const updatePostMutation = useCustomMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['groupData', groupDataRedux?.id || groupDataRedux?.groupId]);
      refetch(); // Add this line to refetch the data
    },
  });

  useEffect(() => {
    if (data) {
      setPosts(data.sortedPosts);
      setLocations(data.processedLocations);
    }
  }, [data]);

  useEffect(() => {
    setGroupData(groupDataRedux);
    setDescription(groupDataRedux?.description || groupDataRedux?.text || '');
    setLocation(groupDataRedux?.location || '');
    setBannerImage(groupDataRedux?.img || groupDataRedux?.groupImageUrl || '');
    setGroupName(groupDataRedux?.title || groupDataRedux?.groupName || '');
    refetch();
  }, [groupDataRedux, refetch]);

  useEffect(() => {
    const textarea = document.querySelector('.description_group');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [showDeleteModal]);

  const autoResize = useCallback((e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  const toggleDescription = useCallback(() => {
    setShowFullDescription((prev) => !prev);
  }, []);

  const handleGroupNameChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length > 25) {
      setErrorMessage('Tên nhóm không được vượt quá 25 ký tự');
    } else if (value.length < 10) {
      setErrorMessage('Tên nhóm phải có ít nhất 10 ký tự');
    } else {
      setErrorMessage(''); // Xóa thông báo lỗi nếu hợp lệ
    }
    setGroupName(value);
  }, []);

  const handleFileChange = useCallback((event) => {
    setSelectedFiles([...event.target.files]);
  }, []);
  const handleBannerFileChange = useCallback((event) => {
    setSelectedBannerFile(event.target.files[0]);
  }, []);

  const handleDeletePost = useCallback((groupPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.groupPostId !== groupPostId));
    refetch(); // Add this line to refetch the data
  }, [refetch]);

  const handleDeleteImage = useCallback((index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  return (
    <div className='my_group_detail_container'>
      <img src={groupDataRedux?.img || groupDataRedux?.groupImageUrl} alt="" className='banner_group' />
      <div className='d-flex justify-content-between'>
        <div className='d-flex flex-column'>
          <p className='fw-bold m-0' style={{
            fontSize: '40px',
          }}>{groupDataRedux?.title || groupDataRedux?.groupName || ''}</p>
          <p className='m-0 fw-medium' style={{
            fontSize: '20px',
          }}>{groupDataRedux?.location}</p>
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
              <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'} onButtonClick={() => updateGroupMutation.mutate()} onOpen={() => {
                const textarea = document.querySelector('.description_group');
                if (textarea) {
                  textarea.style.height = 'auto';
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }
              }}>
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
                <TextareaAutosize
                  placeholder='Nhập miêu tả'
                  className='mb-3 border-1 rounded-4 p-3 w-100'
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
              <Link className='text-black' to={RoutePath.Group_Management} style={{
                fontSize: '16px',
              }}>Quản lí thành viên</Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowDeleteModal(true)} style={{
                fontSize: '16px',
              }}>Xóa nhóm</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <p className='fw-medium d-flex align-items-center gap-2 my-1'><ion-icon name="people-outline" style={{
        fontSize: '20px',
      }}></ion-icon> {groupDataRedux?.members || groupDataRedux?.numberOfParticipants} thành viên</p>
      <p className={`m-0 ${showFullDescription ? '' : 'description_short'}`}>
        {groupDataRedux?.text || groupDataRedux?.description}
      </p>
      {!showFullDescription && (groupDataRedux?.description || groupDataRedux?.text)?.length > 100 && (
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
          <img src={user.avatarUrl || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw'} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
          <h5 className='m-0'>{user.FullName}</h5>
        </div>
        <TextareaAutosize
          name=""
          id="post_title"
          placeholder='Bạn đang nghĩ gì... ?'
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        ></TextareaAutosize>
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
          <Button variant='outline-success' className='rounded-5' onClick={() => createPostMutation.mutate()} disabled={isPosting}>
            {isPosting ? <><Spinner  as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"/> Đang đăng</> : 'Đăng bài'}
          </Button>
        </div>
      </div>


      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.groupPostId}>
            <hr className='line_spit' />
            <PostGroupDetail post={post} onDelete={handleDeletePost} fetchPosts={refetch} />
          </div>
        ))
      ) : (
        <p>Chưa có bài viết nào</p>
      )}

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteGroupMutation.mutate();
          setShowDeleteModal(false);
        }}
        title="Bạn có muốn xóa không?"
        message="Nhóm sẽ bị xóa vĩnh viễn"
      />
    </div>
  );
};

export default MyGroupDetail;
