import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import '../../assets/css/Groups/GroupDetail.css';
import RoutePath from '../../routes/RoutePath';
import FormSubmit from '../../components/Shared/FormSubmit';
import PostGroupDetail from '../../components/Group/PostGroupDetail';

function GroupDetail() {
  // Redux selectors
  const selectedGroup = useSelector(state => state.group.selectedGroup);
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  // State for group details
  const [groupName, setGroupName] = useState(selectedGroup.title || selectedGroup.groupName || '');
  const [groupDescription, setGroupDescription] = useState(selectedGroup.text || '');
  const [groupLocation, setGroupLocation] = useState(selectedGroup.location || '');
  const [isGroupCreate, setIsGroupCreate] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for locations
  const [locations, setLocations] = useState([]);

  // State for file uploads
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [filePlaceholder, setFilePlaceholder] = useState("Nhấn vào đây để upload");
  const [errors, setErrors] = useState({ groupImageUrl: '' });

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  // Static data
  const members = [
    { id: 1, image: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj' },
    { id: 2, image: 'https://kenh14cdn.com/thumb_w/640/203336854389633024/2024/10/5/hieuthuhai-6-1724922106140134622997-0-0-994-1897-crop-17249221855301721383554-17281064622621203940077.jpg' },
    { id: 3, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3HUU-eAMPAQL0wpBBY2taVQkWH4EwUWeHw&s' },
  ];

  const postDetailsList = [
    {
      id: 1,
      authorAvatar: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj',
      authorName: 'Nhơn Trần',
      date: '24 tháng 09 lúc 9:01',
      content: 'Xin chào mọi người, Hôm nay chúng tôi chia sẻ đến mọi người chuyến đi Đà Nẵng 2 ngày 1 đêm của chúng tôi.',
      images: [
        'https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg',
        'https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg',
        'https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg',
      ],
      comments: [
        { id: 1, avatar: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj', name: 'Nhơn Trần', location: 'Quảng Nam', content: 'Đăng là người bạn đồng hành tuyệt vời!' },
        { id: 2, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Huy Nguyễn', location: 'Hà Nội', content: 'Một trải nghiệm thật tuyệt vời!' },
      ],
    },
  ];

  useEffect(() => {
    setIsGroupCreate(localStorage.getItem('lastPath') === RoutePath.GROUP_CREATED);
    axios.get('https://provinces.open-api.vn/api/p/')
      .then(response => {
        const modifiedLocations = response.data.map(location => {
          const newName = location.name.replace(/^(Tỉnh|Thành phố)\s*/, '');
          return { ...location, name: newName };
        });
        setLocations(modifiedLocations);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
    console.log(user);
  }, []);

  const handleViewImage = (url) => {
    setModalImageUrl(url);
    setShowModal(true);
  };

  const handleCoverImageUpload = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `cover_images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCoverImageUrl(url);
      console.log("Cover image uploaded successfully:", url);
      toast.success('Ảnh bìa đã được tải lên thành công!');
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error('Lỗi khi tải lên ảnh bìa!');
    }
  };

  const handleFileUpload = async (files) => {
    setUploadingFiles((prev) => [...prev, ...files]);
    const urls = [...uploadedUrls];
    for (let file of files) {
      const storageRef = ref(storage, `posts/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push({ url, name: file.name });
        console.log("File uploaded successfully:", url);
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrors((prevErrors) => ({ ...prevErrors, groupImageUrl: 'Lỗi khi tải lên ảnh bìa' }));
      }
    }
    setUploadedUrls(urls);
    setUploadingFiles((prev) => prev.filter((file) => !files.includes(file)));
    toast.success('Ảnh đã được tải lên thành công!');
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      setFilePlaceholder(`${files.length} file(s) selected`);
      await handleFileUpload(files);
    }
  };

  const handleDeleteImage = async (image) => {
    const storageRef = ref(storage, `posts/${image.name}`);
    try {
      await deleteObject(storageRef);
      setUploadedUrls((prev) => prev.filter((img) => img.url !== image.url));
      toast.success('Ảnh đã được xóa thành công!');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Lỗi khi xóa ảnh!');
    }
  };

  const handleCoverImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await handleCoverImageUpload(file);
    }
  };

  const handleDeleteCoverImage = async () => {
    if (coverImageUrl) {
      const fileName = coverImageUrl;
      const storageRef = ref(storage, `${coverImageUrl}`);
      try {
        await deleteObject(storageRef);
        setCoverImageUrl(null);
        toast.success('Ảnh bìa đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting cover image:', error);
        toast.error('Lỗi khi xóa ảnh bìa!');
      }
    }
  };

  const handleUpdateGroupDetail = async () => {
    const groupData = {
      groupName,
      location: groupLocation,
      description: groupDescription,
      groupImageUrl: coverImageUrl,
    };

    console.log('Group Data:', groupData);
    console.log(selectedGroup.id);
    console.log('Token:', token);

    try {
      const response = await axios.put(`https://travelmateapp.azurewebsites.net/api/groups/${selectedGroup.id}`, groupData, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Group Details Updated:', response.data);
      toast.success('Thông tin nhóm đã được cập nhật thành công!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating group details:', error);
      toast.error('Lỗi khi cập nhật thông tin nhóm!');
    }
  };

  return (
    <div className='join-group-detail-container' style={{ paddingRight: '85px' }}>
      <img src={selectedGroup.img || selectedGroup.groupImageUrl} alt={selectedGroup.title || selectedGroup.groupName} style={{ height: '331px', objectFit: 'cover', borderRadius: '20px', marginBottom: '23px', width: '100%' }} />
      <div className='d-flex justify-content-between'>
        <div className='d-flex gap-4'>
          <p className='group-name-inf' style={{ fontSize: '40px', fontWeight: 'bold', margin: '0', marginBottom: '10px' }}>{selectedGroup.title || selectedGroup.groupName}</p>
          <div className='group-location-inf' style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '15px' }}>{selectedGroup.location}</div>
        </div>
        {isGroupCreate ? (
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" className='bg-transparent border-0'>
              <ion-icon name="settings-outline" style={{ fontSize: '25px' }}></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className='dropdown-edit-group-item'>
                <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'} onButtonClick={handleUpdateGroupDetail}>
                  <h3>Bảng thông tin</h3>
                  <small>Thay đổi thông tin chi tiết cho nhóm của bạn</small>
                  <Form>
                    <Form.Group className="mb-3 mt-3">
                      <Form.Label className='fw-bold'>Tên nhóm</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tên nhóm"
                        className='rounded-5 border-black'
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ height: '120px' }}>
                      <Form.Label className='fw-bold'>Miêu tả</Form.Label>
                      <textarea
                        placeholder="Nhập miêu tả về nhóm của bạn"
                        style={{ height: '85%', width: '100%' }}
                        className='border-1 border-black rounded-4 p-2'
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className='fw-bold'>Địa điểm</Form.Label>
                      <Form.Select
                        className='rounded-5 border-black'
                        value={groupLocation}
                        onChange={(e) => setGroupLocation(e.target.value)}
                      >
                        <option>Chọn địa điểm</option>
                        {locations.map(location => (
                          <option key={location.code} value={location.name}>
                            {location.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex flex-column gap-2">
                      <Form.Label>Ảnh bìa</Form.Label>
                      <Button onClick={() => document.getElementById('coverFileInput').click()} style={{
                        width: '260px',
                        display: 'flex',
                        gap: '10px',
                        border: '1px dashed #00A3FF',
                        backgroundColor: '#F2F7FF',
                        height: '44px',
                        borderRadius: '19px',
                        alignItems: 'center',
                      }}><p className='m-0 text-black'>Nhấn vào đây để</p> <p className='text-primary m-0'>upload</p></Button>
                      <div>
                        {coverImageUrl && (
                          <div style={{ position: 'relative', width: '245px', height: '183px' }}>
                            <img src={coverImageUrl} alt="Cover" style={{ width: '245px', height: '183px', objectFit: 'cover', borderRadius: '4px' }} />
                            <Button variant="link" style={{ position: 'absolute', top: 0, right: 0, color: 'red' }} onClick={handleDeleteCoverImage}>
                              <ion-icon name="trash-outline"></ion-icon>
                            </Button>
                          </div>
                        )}
                      </div>
                      <Form.Control type="file" id="coverFileInput" onClick={(e) => e.stopPropagation()} onChange={handleCoverImageSelect} style={{ display: 'none' }} />
                    </Form.Group>
                  </Form>
                </FormSubmit>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Quản lí nhóm</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Form.Select className='group-dropdown-inf' style={{ height: '44px', width: '200px', fontSize: '18px', padding: '10px 20px', borderRadius: '22px', color: 'green' }}>
            <option>Đã tham gia</option>
            <option value="Rời khỏi nhóm">Rời khỏi nhóm</option>
          </Form.Select>
        )}
      </div>

      <p style={{ padding: '0px', fontWeight: '500', fontSize: '16px', marginBottom: '12px' }}>
        {members.map((member, index) => (
          <img key={member.id} src={member.image} alt={`member-${index}`} style={{ width: '24px', height: '24px', borderRadius: '24px', objectFit: 'cover', marginRight: index === members.length - 1 ? '10px' : '-10px' }} />
        ))}
        {selectedGroup.members}
      </p>

      <p className='group-decription'>{selectedGroup.text}</p>

      <hr style={{ border: '1px solid #7F7F7F', margin: '40px 0' }} />

      <div style={{ border: "1px solid #ddd", borderRadius: "20px", padding: "20px 40px", width: "100%", margin: "0 auto", boxShadow: '0 0 7px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ alignItems: "center" }}>
          {user ? (
            <>
              <div>
                <img src={user.avatarUrl} alt="User Avatar" style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "12px" }} />
                <span style={{ fontWeight: "bold", fontSize: '20px' }}>{user.username}</span>
              </div>
              <div style={{ flex: 1 }}>
                <textarea className='post-group-detail-textarea' placeholder="Bạn đang nghĩ gì...?" style={{ width: "100%", padding: "8px", border: "0px", borderRadius: "4px", marginTop: "8px", fontSize: '16px', color: 'black' }} />
              </div>
            </>
          ) : (
            <p style={{ color: 'gray', fontStyle: 'italic' }}>Vui lòng đăng nhập để tham gia cuộc trò chuyện.</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          {uploadedUrls.map((image, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img src={image.url} alt={`Uploaded ${index}`} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "4px" }} />
              <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)', opacity: 0, transition: 'opacity 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                <Button variant="link" style={{ color: 'white', fontSize: '16px', marginRight: '-10px' }} onClick={() => handleViewImage(image.url)}>
                  <ion-icon name="eye-outline"></ion-icon>
                </Button>
                <Button variant="link" style={{ color: 'white', fontSize: '16px' }} onClick={() => handleDeleteImage(image)}>
                  <ion-icon name="trash-outline"></ion-icon>
                </Button>
              </div>
            </div>
          ))}
          {uploadingFiles.map((file, index) => (
            <div key={index} style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
              <Skeleton height="100%" width="100%" />
            </div>
          ))}
          <div style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed black", borderRadius: "4px", cursor: "pointer" }} onClick={() => document.getElementById('iconFileInput').click()}><ion-icon name="add-outline" style={{
            fontSize: '30px',
          }}></ion-icon></div>
        </div>
        <input type="file" id="iconFileInput" style={{ display: 'none' }} onChange={handleFileSelect} multiple />
        <div className='d-flex justify-content-end align-items-center'>
          <Button variant='outline-success' className='rounded-5 fw-medium' style={{ cursor: "pointer", height: '44px' }}>Đăng bài</Button>
        </div>
      </div>
      <hr style={{ border: '1px solid #7F7F7F', margin: '40px 0' }} />
      <div style={{ padding: '0px 32px' }} className='group-input'>
        {postDetailsList.map(postDetails => (
          <PostGroupDetail key={postDetails.id} postDetails={postDetails} />
        ))}
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop={false}
        dialogClassName="transparent-modal"
      >
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <img
              src={modalImageUrl}
              alt="Ảnh lớn"
              className="zoom-in-image"
              style={{ width: '50%', borderRadius: '5px' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GroupDetail;