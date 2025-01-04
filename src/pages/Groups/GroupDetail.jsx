/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button, Form } from 'react-bootstrap';
import ConfirmModal from '../../components/Shared/ConfirmModal';
import FormModal from '../../components/Shared/FormModal';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useSelector } from 'react-redux';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import useApi from '../../hooks/useApi';
import ImageSelector from '../../components/Shared/ImageSelector';
import TextareaAutosize from 'react-textarea-autosize';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { useDispatch } from 'react-redux';
import { updateGroup as updateGroupAction, viewGroup } from '../../redux/actions/groupActions';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProvinceSelector from '../../components/Shared/ProvinceSelector';
import { useQueryClient } from 'react-query';

const GroupDetail = () => {
  const group = useSelector(state => state.group.selectedGroup);
  const userJoinedStatus = useSelector(state => state.group.userJoinedStatus);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for group posts
  const [groupPosts, setGroupPosts] = useState([]);
  const { useFetch, useCreate } = useApi(`https://travelmateapp.azurewebsites.net/api/groups/${group?.groupId}/groupposts`, `groupPosts-${group?.groupId}`);
  const { useUpdate } = useApi(`https://travelmateapp.azurewebsites.net/api/groups`, `group-${group?.groupId}`);
  const { useDelete } = useApi(`https://travelmateapp.azurewebsites.net/api/groups`, `group-${group?.groupId}`);
  const { data: postsData } = useFetch();
  const { mutate: createPost, isLoading: isSubmitting, isSuccess: isSubmitted } = useCreate();
  const { mutate: updateGroup, isLoading: isUpdating, isSuccess: isSuccessUpdateGroup } = useUpdate();
  const { mutate: deleteGroup, isLoading: isDeleting, isSuccess: isDeleted } = useDelete(false);
  const { useDelete: useLeaveGroup } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/LeaveGroup`, `leaveGroup-${group?.groupId}`);
  const { mutate: leaveGroup, isLoading: isLeaving, isSuccess: isLeft } = useLeaveGroup(false);
  const { useDelete: useCancelJoinRequest } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/CancelJoinRequest`, `cancelJoinRequest-${group?.groupId}`);
  const { mutate: cancelJoinRequest, isLoading: isCanceling, isSuccess: isCanceled } = useCancelJoinRequest(false);
  const { useCreate: useSendJoinRequest } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups/Join/${group?.groupId}`, `sendJoinRequest-${group?.groupId}`);
  const { mutate: sendJoinRequest, isLoading: isSending, isSuccess: isSent } = useSendJoinRequest(false);
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);



  // State for post images
  const [selectedPostImages, setSelectedPostImages] = useState([]);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);

  // State for modals
  const [showFormModal, setShowFormModal] = useState(false);

  // State for description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(group?.location || '');

  useEffect(() => {
    if (userJoinedStatus === 'Joined' || userJoinedStatus === 'Owner') {
      setGroupPosts(postsData?.$values || []);
    }
  }, [userJoinedStatus, postsData]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups/${group?.groupId}`, {
          headers: { Authorization: `${token}` }
        });
        if (response.data.userJoinedStatus == 'Joined' || response.data.userJoinedStatus == 'Owner') {
          dispatch(viewGroup(group, response.data.userJoinedStatus));
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    if (group?.groupId) {
      fetchGroupData();
    }
  }, [group?.groupId, token]);

  // Modal handlers
  const handleOpenFormModal = () => setShowFormModal(true);
  const handleCloseFormModal = () => setShowFormModal(false);

  // Description toggle handler
  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);

  // Banner image handlers
  const handleBannerSelect = (selectedFiles) => {
    setSelectedBannerImage(selectedFiles);
  };

  const handleRemoveBannerImage = () => {
    setSelectedBannerImage(null);
  };

  // Post image handlers
  const handleSelectImagePost = (event) => {
    const files = Array.from(event.target.files);
    setSelectedPostImages(files);
  };

  const handleRemoveSelectedImage = (index) => {
    setSelectedPostImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Post submission handler
  const handleSubmitPost = async () => {
    const postTitle = document.getElementById('post_title').value;
    const postImages = await Promise.all(
      selectedPostImages.map(async (file) => {
        const storageRef = ref(storage, `groupPosts/${group?.groupId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoUrl = await getDownloadURL(storageRef);
        return { photoUrl };
      })
    );

    const newPost = {
      title: postTitle,
      GroupPostPhotos: postImages
    };

    createPost(newPost, {
      onSuccess: () => {
        setSelectedPostImages([]);
        document.getElementById('post_title').value = '';
        toast.success('Đăng bài viết thành công');
      }
    });
  };

  const dispatch = useDispatch();

  const handleUpdateGroup = async () => {

    const groupName = document.getElementById('group_name').value;
    const description = document.getElementById('description').value;
    const groupImageUrl = selectedBannerImage ? await uploadBannerImage(selectedBannerImage) : group?.groupImageUrl;

    const updatedGroup = {
      groupName: groupName,
      location: selectedProvince,
      description: description,
      groupImageUrl: groupImageUrl,
    };


    updateGroup({ id: group?.groupId, updatedData: updatedGroup }, {
      onSuccess: () => {
        dispatch(updateGroupAction(updatedGroup));
        queryClient.invalidateQueries('joinedGroup');
        queryClient.invalidateQueries('createdGroups');
        handleCloseFormModal();
        toast.success('Cập nhật thông tin nhóm thành công');
      }
    });
  };

  const uploadBannerImage = async (file) => {
    const storageRef = ref(storage, `groupBanners/${group?.groupId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleDeleteGroup = () => {
    deleteGroup(group?.groupId, {
      onSuccess: () => {
        navigate(RoutePath.GROUP_CREATED);
      }
    });
  };

  const handleLeaveGroup = () => {
    leaveGroup(group?.groupId, {
      onSuccess: () => {
        navigate(RoutePath.GROUP_JOINED);
      }
    });
  };

  const handleCancelJoinRequest = () => {
    cancelJoinRequest(group?.groupId, {
      onSuccess: () => {
        dispatch(viewGroup(group, 'Unjoin'));
        toast.success('Đã hủy yêu cầu tham gia nhóm');
      }
    });
  };

  const handleSendJoinRequest = () => {
    sendJoinRequest({ groupId: group?.groupId }, {
      onSuccess: () => {
        dispatch(viewGroup(group, 'Pending'));
        toast.success('Đã gửi yêu cầu tham gia nhóm');
      }
    });
  };

  return (
    <div className='my_group_detail_container'>
      <img src={group?.groupImageUrl} alt="Group Banner" className='banner_group' />
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex flex-column'>
          <p className='fw-bold m-0' style={{ fontSize: '40px' }}>{group?.groupName}</p>
          <p className='m-0 fw-medium' style={{ fontSize: '20px' }}>{group?.location}</p>
        </div>
        {userJoinedStatus === 'Unjoin' && (
          <Button variant='outline-success' className='rounded-5' onClick={handleSendJoinRequest} disabled={isSending}>
            {isSending ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Gửi yêu cầu tham gia'}
          </Button>
        )}
        {userJoinedStatus === 'Pending' && (
          <Button variant='outline-danger' className='rounded-5' onClick={handleCancelJoinRequest} disabled={isCanceling}>
            {isCanceling ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Hủy yêu cầu'}
          </Button>
        )}
        {userJoinedStatus === 'Joined' && (
          <Dropdown>
            <Dropdown.Toggle variant="outline-success" className='rounded-5'>
              Đã tham gia
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ border: 'none', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
              <Dropdown.Item className='form_edit_group'>Đã tham gia</Dropdown.Item>
              <Dropdown.Item onClick={handleLeaveGroup}>Rời nhóm</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        {userJoinedStatus === 'Owner' && (
          <Dropdown>
            <Dropdown.Toggle variant="" className='d-flex justify-content-center align-items-center'>
              <ion-icon name="settings-outline"></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ border: 'none', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
              <Dropdown.Item className='form_edit_group' onClick={handleOpenFormModal}>Cập nhật thông tin nhóm</Dropdown.Item>
              <Dropdown.Item className='form_edit_group' onClick={() => navigate(RoutePath.Group_Management)}>Quản lý Thành viên</Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteGroup}>Xóa nhóm</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <p className='fw-medium d-flex align-items-center gap-2 my-1'>
        <ion-icon name="people-outline" style={{ fontSize: '20px' }}></ion-icon> {group?.numberOfParticipants} thành viên
      </p>
      <p className='m-0'>
        {isDescriptionExpanded ? group?.description : `${group?.description?.slice(0, 200)}...`}
        {group?.description?.length > 200 && (
          <Button variant='' className="" onClick={toggleDescription}>
            {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
          </Button>
        )}
      </p>
      <hr className='mt-4 mb-5 line_spit' />
      {(userJoinedStatus === 'Joined' || userJoinedStatus === 'Owner') && (
        <div className='write_post_container mb-5'>
          <div className='d-flex align-items-center gap-3'>
            <img src={user.avatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
            <h5 className='m-0'></h5>
          </div>
          <TextareaAutosize name="" id="post_title" placeholder='Bạn đang nghĩ gì... ?'></TextareaAutosize>
          <input type="file" id="image_post" multiple style={{ display: 'none' }} onChange={handleSelectImagePost} />
          <div className='uploaded_img_container'>
            {selectedPostImages.map((file, index) => (
              <div key={index} className='position-relative image-container'>
                <img src={URL.createObjectURL(file)} alt={`selected ${index}`} width={100} height={100} className='selected-image' />
                <Button variant='danger' className='position-absolute top-0 end-0 m-1 p-1 delete-button' onClick={() => handleRemoveSelectedImage(index)}>
                  <ion-icon name="close-outline"></ion-icon>
                </Button>
              </div>
            ))}
            <Button variant='outline-dark' className='button_add_upload' onClick={() => document.getElementById('image_post').click()}>
              <ion-icon name="add-outline"></ion-icon>
            </Button>
          </div>
          <div className='w-100 d-flex justify-content-end'>
            <Button variant='outline-success' className='rounded-5' onClick={handleSubmitPost} disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Đăng bài'}
            </Button>
          </div>
        </div>
      )}
      {(userJoinedStatus === 'Joined' || userJoinedStatus === 'Owner') && (
        <div>
          {groupPosts.length > 0 ? (
            groupPosts.map(post => (
              <PostGroupDetail key={post.groupPostId} post={post} />
            ))
          ) : (
            <p>Chưa có bài viết nào</p>
          )}
        </div>
      )}
      <ConfirmModal show={false} onHide={() => { }} onConfirm={() => { }} title="Bạn có muốn xóa không?" message="Nhóm sẽ bị xóa vĩnh viễn" />
      <FormModal
        show={showFormModal}
        handleClose={handleCloseFormModal}
        title="Cập nhật thông tin nhóm"
        saveButtonText="Lưu thay đổi"
        handleSave={handleUpdateGroup}
      >
        <Form.Group>
          <Form.Label>Tên nhóm</Form.Label>
          <Form.Control type="text" id="group_name" defaultValue={group?.groupName} placeholder="Nhập tên nhóm" />
        </Form.Group>
        <Form.Group>
          {/* <Form.Label>Địa điểm</Form.Label> */}
          <ProvinceSelector onSelect={setSelectedProvince} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mô tả</Form.Label>
          <TextareaAutosize id="description" className='w-100 rounded-3 p-2 border-secondary' defaultValue={group?.description} placeholder="Nhập mô tả" style={{ fontSize: '12px' }} />
        </Form.Group>
        <Form.Label>Ảnh bìa</Form.Label>
        <ImageSelector multiple={false} onSelect={handleBannerSelect} />
        <div className='mt-2 position-relative'>
          {selectedBannerImage && (
            <>
              <img src={URL.createObjectURL(selectedBannerImage)} alt="Selected Banner" className='rounded-2 w-100' />
              <Button variant='danger' className='d-flex justify-content-center align-items-center position-absolute top-0 end-0 m-2' onClick={handleRemoveBannerImage}>
                <ion-icon name="close-outline"></ion-icon>
              </Button>
            </>
          )}
        </div>
        <div className='mt-2'>
          <Form.Label>Ảnh nhóm hiện tại</Form.Label>
          <img src={group?.groupImageUrl} alt="Group Image" className='rounded-2 w-100' />
        </div>
      </FormModal>
    </div>
  );
};

export default GroupDetail;
