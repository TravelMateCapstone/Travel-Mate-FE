import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import '../../assets/css/Groups/MyGroupDetail.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import TextareaAutosize from 'react-textarea-autosize';
import ProvinceSelector from '../../components/Shared/ProvinceSelector';
import ImageSelector from '../../components/Shared/ImageSelector';

const FormSubmit = React.lazy(() => import('../../components/Shared/FormSubmit'));

const GroupManagement = () => {
    const navigate = useNavigate();
    const groupDataRedux = useSelector((state) => state.group.selectedGroup);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [groupData, setGroupData] = useState();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState(groupDataRedux?.description || groupDataRedux?.text || '');
    const [location, setLocation] = useState(groupDataRedux?.location || '');
    const [bannerImage, setBannerImage] = useState(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
    const [groupName, setGroupName] = useState(groupDataRedux?.title || groupDataRedux.groupName || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [key, setKey] = useState('joinRequests');
    const [selectedProvince, setSelectedProvince] = useState(groupDataRedux?.location || '');
    const [selectedBannerImage, setSelectedBannerImage] = useState(null);

    const queryClient = useQueryClient();

    const { data: joinRequests, refetch: refetchJoinRequests } = useQuery(
        ['joinRequests', groupDataRedux.groupId || groupDataRedux.id],
        async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/ListJoinGroupRequest/${groupDataRedux.groupId || groupDataRedux.id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            return response.data.$values;
        }
    );

    const { data: locationsData } = useQuery('locations', async () => {
        const response = await axios.get('https://provinces.open-api.vn/api/');
        return response.data.map((location) => ({
            ...location,
            name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
        }));
    });

    const { data: members, refetch: refetchMembers } = useQuery(
        ['members', groupDataRedux.groupId || groupDataRedux.id],
        async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/${groupDataRedux.groupId || groupDataRedux.id}/Members`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            return response.data.$values;
        },
        { enabled: key === 'manageMembers' }
    );

    useEffect(() => {
        setGroupData(groupDataRedux);
        setDescription(groupDataRedux?.description || groupDataRedux?.text || '');
        setLocation(groupDataRedux?.location || '');
        setBannerImage(groupDataRedux?.img || groupDataRedux.groupImageUrl || '');
        setGroupName(groupDataRedux?.title || groupDataRedux.groupName || '');
    }, [groupDataRedux]);

    useEffect(() => {
        if (key === 'manageMembers') {
            refetchMembers();
        }
    }, [key, refetchMembers]);

    const approveRequestMutation = useMutation(
        async (userId) => {
            await axios.post(
                `${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups/${groupDataRedux.groupId || groupDataRedux.id}/AcceptJoin?requesterId=${userId}`,
                { userId },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
        },
        {
            onSuccess: () => {
                refetchJoinRequests();
            },
        }
    );

    const rejectRequestMutation = useMutation(
        async (userId) => {
            await axios.post(
                `${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups/${groupDataRedux.groupId || groupDataRedux.id}/RejectJoinGroup?requesterId=${userId}`,
                { userId },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
        },
        {
            onSuccess: () => {
                refetchJoinRequests();
            },
        }
    );

    const updateGroupMutation = useMutation(
        async (updatedGroup) => {
            await axios.put(`https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}`, updatedGroup, {
                headers: {
                    Authorization: `${token}`,
                },
            });
        },
        {
            onSuccess: () => {
                console.log('Nhóm đã được cập nhật thành công');
                queryClient.invalidateQueries(['groupData', groupDataRedux.groupId || groupDataRedux.id]);
            },
        }
    );

    const deleteGroupMutation = useMutation(
        async () => {
            await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux.id || groupDataRedux.groupId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
        },
        {
            onSuccess: () => {
                console.log('Nhóm đã được xóa thành công');
                navigate('/group');
            },
        }
    );

    const handleApproveRequest = useCallback((userId) => {
        approveRequestMutation.mutate(userId, {
            onSuccess: () => {
                toast.success('Phê duyệt thành công!');
            },
            onError: () => {
                toast.error('Phê duyệt thất bại!');
            },
        });
    }, [approveRequestMutation, toast]);

    const handleRejectRequest = useCallback((userId) => {
        rejectRequestMutation.mutate(userId, {
            onSuccess: () => {
                toast.success('Từ chối thành công!');
            },
            onError: () => {
                toast.error('Từ chối thất bại!');
            },
        });
    }, [rejectRequestMutation, toast]);

    const handleBannerSelect = (selectedFiles) => {
        setSelectedBannerImage(selectedFiles[0]);
    };

    const handleRemoveBannerImage = () => {
        setSelectedBannerImage(null);
    };

    const uploadBannerImage = async (file) => {
        const storageRef = ref(storage, `groupBanners/${groupDataRedux?.groupId}/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const updateGroup = useCallback(async () => {
        const groupImageUrl = selectedBannerImage ? await uploadBannerImage(selectedBannerImage) : bannerImage;

        const updatedGroup = {
            groupName: groupName,
            location: selectedProvince,
            description: description,
            groupImageUrl: groupImageUrl,
        };
        updateGroupMutation.mutate(updatedGroup);
    }, [groupName, selectedProvince, description, selectedBannerImage, updateGroupMutation]);

    const deleteGroup = useCallback(() => {
        deleteGroupMutation.mutate();
    }, [deleteGroupMutation]);

    const handleFileChange = useCallback((event) => {
        setSelectedFiles([...event.target.files]);
    }, []);

    const handleModalFileChange = useCallback((event) => {
        const files = [...event.target.files];
        setSelectedFiles(files);
    }, []);

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
    }, [selectedFiles, storage]);

    const handleDeleteImage = useCallback((index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
    }, [selectedFiles]);

    const autoResize = useCallback((e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }, []);

    const getTimeDifference = useCallback((requestAt) => {
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
    }, []);

    const fileInputRef = useRef(null);

    const handleFileInputClick = () => {
        fileInputRef.current.click();
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
                            fontSize: '24px',
                        }}></ion-icon>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{
                        border: 'none',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                    }}>
                        <Dropdown.Item className='form_edit_group' onClick={handleFileInputClick}>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'} onButtonClick={updateGroup}>
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
                                    <TextareaAutosize
                                        placeholder='Nhập miêu tả'
                                        className='mb-3 border-1 rounded-4 p-3 w-100 description_group'
                                        value={description}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <h4>Địa điểm</h4>
                                    <ProvinceSelector onSelect={setSelectedProvince} />
                                    <h4>Ảnh bìa nhóm</h4>
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
                                        <img src={bannerImage} alt="Group Image" className='rounded-2 w-100' />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </FormSubmit>
                            </React.Suspense>
                        </Dropdown.Item>
                        <Dropdown.Item>Quản lý thành viên</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Xóa nhóm</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <p className='fw-medium d-flex align-items-center gap-2 my-1'><ion-icon name="people-outline" style={{
                fontSize: '20px',
            }}></ion-icon> {groupDataRedux.members || groupDataRedux.numberOfParticipants} thành viên</p>
            <p className='m-0'>{groupDataRedux.text || groupDataRedux.description}</p>
            <hr className='mt-2 mb-5' />
            <Tabs
                id="group-management-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3 border-0"
            >
                <Tab className='border-0' eventKey="joinRequests" title="Xem yêu cầu tham gia nhóm">
                    <div className="join-requests">
                        <p className='fw-medium text-success rounded-5' style={{
                            padding: '5px 10px',
                            backgroundColor: '#F2F7FF',
                            width: 'fit-content',
                        }}>{joinRequests?.length} yêu cầu tham gia</p>
                        {joinRequests?.map((request) => (
                            <div key={request.userId} className="join-request-item d-flex justify-content-between align-items-center">
                                <div className='d-flex gap-3 mb-4'>
                                    <img src={request.memberAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" width={50} height={50} className="avatar rounded-circle" />
                                    <div className='d-flex flex-column'>
                                        <p className='mb-1 fw-medium'>{request.memberName}</p>
                                        <sub className='m-0 fw-medium'>{getTimeDifference(request.requestAt)}</sub>
                                    </div>
                                </div>
                                <div className='d-flex gap-4'>
                                    <Button variant="outline-success" className='rounded-5 fw-medium' onClick={() => handleApproveRequest(request.userId)}>
                                        Phê duyệt
                                    </Button>
                                    <Button variant="outline-danger" className='rounded-5 fw-medium' onClick={() => handleRejectRequest(request.userId)}>
                                        Từ chối
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab eventKey="manageMembers" title="Quản lý thành viên">
                    <div className="member-list">
                        {members?.length > 0 ? (
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

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="custom-modal_deletGroup">
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa nhóm</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => {
                        deleteGroup();
                        setShowDeleteModal(false);
                    }}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default React.memo(GroupManagement);
