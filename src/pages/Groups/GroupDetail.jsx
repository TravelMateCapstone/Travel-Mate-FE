import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import { useSelector } from 'react-redux';
import '../../assets/css/Groups/GroupDetail.css';
import RoutePath from '../../routes/RoutePath';
import FormSubmit from '../../components/Shared/FormSubmit';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import Skeleton from 'react-loading-skeleton';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
function GroupDetail() {
  const selectedGroup = useSelector(state => state.group.selectedGroup);
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
        { id: 3, avatar: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj', name: 'Nhơn Trần', location: 'Quảng Nam', content: 'Đăng là người bạn đồng hành tuyệt vời!' },
        { id: 4, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Huy Nguyễn', location: 'Hà Nội', content: 'Một trải nghiệm thật tuyệt vời!' },
      ],
    },
  ];
  const [isGroupCreate, setIsGroupCreate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [filePlaceholder, setFilePlaceholder] = useState("Nhấn vào đây để upload");
  const [errors, setErrors] = useState({ groupImageUrl: '' });
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const username = useSelector(state => state.auth.user.username);
  useEffect(() => {
    setIsGroupCreate(localStorage.getItem('lastPath') === RoutePath.GROUP_CREATED);
  }, []);
  const handleFileUpload = async (files) => {
    setUploadingFiles((prev) => [...prev, ...files]);
    const urls = [...uploadedUrls];
    for (let file of files) {
      const storageRef = ref(storage, `posts/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
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
  return (
    <div className='join-group-detail-container' style={{ paddingRight: '85px' }}>
      <ToastContainer />
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
                <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'}>
                  <h3>Bảng thông tin</h3>
                  <small>Thay đổi thông tin chi tiết cho nhóm của bạn</small>
                  <Form>
                    <Form.Group className="mb-3 mt-3">
                      <Form.Label className='fw-bold'>Tên nhóm</Form.Label>
                      <Form.Control type="text" placeholder="Nhập tên nhóm" className='rounded-5' />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ height: '120px' }}>
                      <Form.Label className='fw-bold'>Miêu tả</Form.Label>
                      <textarea placeholder="Nhập miêu tả về nhóm của bạn" style={{ height: '85%', width: '100%' }} className='border-1 rounded-4' />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className='fw-bold'>Địa điểm</Form.Label>
                      <Form.Select>
                        <option>Chọn địa điểm</option>
                        <option value="Da Nang, Viet Nam">Đà Nẵng, Việt Nam</option>
                        <option value="Ha Noi, Viet Nam">Hà Nội, Việt Nam</option>
                        <option value="Ho Chi Minh City, Viet Nam">Thành phố Hồ Chí Minh, Việt Nam</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Ảnh bìa</Form.Label>
                      <div>
                        <Button variant="secondary" onClick={() => document.getElementById('fileInput').click()}>Nhấn vào đây để upload</Button>
                        <Form.Control type="file" id="fileInput" onChange={handleFileSelect} style={{ display: 'none' }} multiple />
                      </div>
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

      <hr style={{ border: '1px solid #7F7F7F' }} />

      <div style={{ border: "1px solid #ddd", borderRadius: "20px", padding: "20px 40px", width: "100%", margin: "0 auto", boxShadow: '0 0 7px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ alignItems: "center" }}>
          <div>
            <img src="https://via.placeholder.com/40" alt="User Avatar" style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "12px" }} />
            <span style={{ fontWeight: "bold", fontSize: '20px' }}>{username}</span>
          </div>
          <div style={{ flex: 1 }}>
            <textarea className='post-group-detail-textarea' placeholder="Bạn đang nghĩ gì...?" style={{ width: "100%", padding: "8px", border: "0px", borderRadius: "4px", marginTop: "8px", fontSize: '16px', color: 'black' }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          {uploadedUrls.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "4px" }} />
          ))}
          {uploadingFiles.map((file, index) => (
            <div key={index} style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
              <Skeleton height="100%" width="100%" />
            </div>
          ))}
          <div style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ddd", borderRadius: "4px", cursor: "pointer" }} onClick={() => document.getElementById('iconFileInput').click()}>+</div>
        </div>
        <input type="file" id="iconFileInput" style={{ display: 'none' }} onChange={handleFileSelect} multiple />
        <div className='d-flex justify-content-end align-items-center'>
          <button style={{ marginTop: "16px", padding: "8px 16px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Đăng bài</button>
        </div>
      </div>
      <hr style={{ border: '1px solid #7F7F7F' }} />
      <div style={{ padding: '0px 32px' }} className='group-input'>
        {postDetailsList.map(postDetails => (
          <PostGroupDetail key={postDetails.id} postDetails={postDetails} />
        ))}
      </div>
    </div>
  );
}

export default GroupDetail;
