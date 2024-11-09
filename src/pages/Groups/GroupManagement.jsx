import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button, Tabs, Tab, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormSubmit from '../../components/Shared/FormSubmit';
import Form from 'react-bootstrap/Form';


const GroupManagement = () => {
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
    const [joinRequests, setJoinRequests] = useState([]);
    const [members, setMembers] = useState([]);
    const [key, setKey] = useState('joinRequests');

    useEffect(() => {
        setGroupData(groupDataRedux);
        setDescription(groupDataRedux?.description || groupDataRedux?.text || '');
        setLocation(groupDataRedux?.location || '');
        setBannerImage(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
        setGroupName(groupDataRedux?.title || groupDataRedux.groupName || '');
        fetchJoinRequests();
        if (key === 'manageMembers') {
            fetchMembers(); // Gọi API khi người dùng chọn tab "Quản lí thành viên"
        }
    }, [groupDataRedux, key]);


    const getTimeDifference = (requestAt) => {
        const requestDate = new Date(requestAt);
        const now = new Date();

        const diffInMs = now - requestDate;
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `Đã gửi yêu cầu ${diffInDays} ngày trước`;
        } else if (diffInHours > 0) {
            return `Đã gửi yêu cầu ${diffInHours} giờ trước`;
        } else if (diffInMinutes > 0) {
            return `Đã gửi yêu cầu ${diffInMinutes} phút trước`;
        } else {
            return `Đã gửi yêu cầu ${diffInSeconds} giây trước`;
        }
    };


    const fetchJoinRequests = async () => {
        try {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Groups/ListJoinGroupRequest/${groupDataRedux.groupId || groupDataRedux.id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setJoinRequests(response.data.$values);
        } catch (error) {
            console.error('Error fetching join requests:', error);
        }
    };

    const handleApproveRequest = async (userId) => {
        try {
            await axios.post(
                `https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups/${groupDataRedux.groupId || groupDataRedux.id}/AcceptJoin?requesterId=${userId}`,
                { userId },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            setJoinRequests(joinRequests.filter(request => request.userId !== userId));
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleRejectRequest = async (userId) => {
        try {
            await axios.post(
                `https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups/${groupDataRedux.groupId || groupDataRedux.id}/RejectJoinGroup?requesterId=${userId}`,
                { userId },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            setJoinRequests(joinRequests.filter(request => request.userId !== userId));
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

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


    const handleDeleteImage = (index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
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

    const fetchMembers = async () => {
        setIsLoading(true); // Bật spinner
        try {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Groups/${groupDataRedux.groupId || groupDataRedux.id}/Members`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setMembers(response.data.$values);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setIsLoading(false); // Tắt spinner
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
                        <Dropdown.Item>Quản lí thành viên</Dropdown.Item>
                        <Dropdown.Item onClick={deleteGroup}>Xóa nhóm</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <p className='fw-semibold'>{groupDataRedux.members || groupDataRedux.numberOfParticipants} thành viên</p>
            <p className='fw-light'>{groupDataRedux.text || groupDataRedux.description}</p>
            <hr className='my-3' />


            <Tabs
                id="group-management-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="joinRequests" title="Xem yêu cầu tham gia nhóm">
                    <div className="join-requests">
                        <p className='fw-medium text-success rounded-5' style={{
                            padding: '5px 10px',
                            backgroundColor: '#F2F7FF',
                            width: 'fit-content',
                        }}>{joinRequests.length} yêu cầu tham gia</p>
                        {joinRequests.map((request) => (
                            <div key={request.userId} className="join-request-item d-flex justify-content-between align-items-center">
                                <div className='d-flex gap-3 mb-4'>
                                    <img src={request.memberAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" width={50} height={50} className="avatar rounded-circle" />
                                    <div className='d-flex flex-column'>
                                        <label className='mb-1'>{request.memberName}</label>
                                        <sub className='m-0'>{getTimeDifference(request.requestAt)}</sub>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="success" onClick={() => handleApproveRequest(request.userId)}>
                                        Phê duyệt
                                    </Button>
                                    <Button variant="danger" onClick={() => handleRejectRequest(request.userId)}>
                                        Từ chối
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab eventKey="manageMembers" title="Quản lí thành viên">
                    <div className="member-list">
                        {members.length > 0 ? (
                            members.map((member) => (
                                <div key={member.userId} className="member-item d-flex align-items-center gap-3 mb-4">
                                    <img src={member.memberAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" width={50} height={50} className="avatar rounded-circle" />
                                    <div>
                                        <p className="mb-0">{member.memberName}</p>
                                        <sub className="text-muted">{member.city}</sub>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có thành viên nào trong nhóm.</p>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default GroupManagement;
