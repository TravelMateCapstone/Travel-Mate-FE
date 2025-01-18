import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Dropdown, DropdownButton, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../assets/css/Profile/ProfileCard.css";
import { Link, useLocation } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import { updateUserAvatar } from "../../redux/actions/authActions";
import { toast } from "react-toastify";
import FormModal from '../../components/Shared/FormModal'
import TextareaAutosize from 'react-textarea-autosize';
import checkProfileCompletion from '../../utils/Profile/checkProfileCompletion';
import { checkProfileCompletionAzure } from "../../apis/profileApi";
import { viewProfile } from "../../redux/actions/profileActions";

function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [isShowFormRequest, setIsShowFormRequest] = useState(false);
  const [isLoadingFormData, setIsLoadingFormData] = useState(true);

  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [services, setServices] = useState([]);

  const profileViewId = useSelector((state) => state.profile.profile?.userId);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportImage, setReportImage] = useState(null);
  const [reportType, setReportType] = useState("User");

  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const data = await checkProfileCompletionAzure();
        setCompletionPercentage(data.totalPercentage);
      } catch (error) {
        console.error("Lỗi khi kiểm tra hoàn thành hồ sơ:", error);
      }
    };

    fetchProfileCompletion();
    
  }, [token]);

  useEffect(() => {
    setIsLoadingFormData(true);
    axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=${profileViewId}`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        setFormData(response.data);
        setServices(response.data.services.$values);
      })
      .catch(error => {
        setFormData(null);
        console.error('Error fetching form data:', error);
      })
      .finally(() => {
        setIsLoadingFormData(false);
      });
  }, [profileViewId]);

  useEffect(() => {
    axios.get(`https://travelmateapp.azurewebsites.net/api/Profile/checkComplete/${profileViewId}`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        setProfileCompletion(response.data.value.totalPercentage);
      })
      .catch(error => {
        console.error('Error fetching profile completion:', error);
      });
  }, [profileViewId]);

  const handleChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };

  const handleServiceChange = (serviceId, checked) => {
    setServices(prevServices => prevServices.map(service =>
      service.id === serviceId ? { ...service, total: checked ? 1 : 0 } : service
    ));
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.keys(answers).map(questionId => ({
      questionId,
      answer: Array.isArray(answers[questionId]) ? answers[questionId] : [answers[questionId]]
    }));

    const answeredServices = services
      .filter(service => service.total > 0)
      .map(service => ({
        serviceId: service.id,
        total: service.total
      }));

    const payload = {
      startDate,
      endDate,
      answeredQuestions,
      answeredServices,
    };
    console.log('Submitting form data:', payload);
    axios.put(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=${profileViewId}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        toast.success('Gửi yêu cầu thành công.');
        console.log('Form data saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Error saving form data:', error);
      });
  };


  const handelShowFormRequest = () => {
    setIsShowFormRequest(true);
  }
  const handelCloseFormRequest = () => {
    setIsShowFormRequest(false);
  }

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportSubmit = async () => {
    try {
      let imageReportUrl = "";
      if (reportImage) {
        const storageRef = ref(storage, `report-images/${reportImage.name}`);
        await uploadBytes(storageRef, reportImage);
        imageReportUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        detail: reportReason,
        imageReport: imageReportUrl,
        reportType: reportType,
        status: 'Created',
      };

      const response = await axios.post(
        `${url}/api/UserReport/Send-Report`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Báo cáo đã được gửi thành công!");
        handleCloseReportModal();
      }
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      toast.error("Lỗi khi gửi báo cáo. Vui lòng thử lại sau.");
    }
  };

  const dispatch = useDispatch();
  const dataProfile = useSelector(state => state.profile);

  // Kiểm tra trạng thái kết bạn
  useEffect(() => {
    if (dataProfile && dataProfile.profile && dataProfile.profile.userId) {
      setFriendshipStatus();
      checkFriendshipStatus(dataProfile.profile.userId);
    }
  }, [dataProfile.profile]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);

      try {
        const storageRef = ref(storage, `profile-images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await axios.put(
          `${url}/api/Profile/current-user/update-image`,
          downloadURL,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setProfile((prevProfile) => ({
          ...prevProfile,
          imageUser: downloadURL,
        }));
        toast.success("Cập nhật ảnh đại diện thành công!");
        dispatch(updateUserAvatar(downloadURL));
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const registrationDate = dataProfile?.profile?.user?.registrationTime
    ? new Date(dataProfile.profile.user.registrationTime).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : "Không rõ";

  const handleSendFriendRequest = async () => {
    try {
      const userId = dataProfile.profile.userId;
      const response = await axios.post(
        `${url}/api/Friendship/send?toUserId=${userId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Bạn đã gửi yêu cầu kết bạn thành công!");
        setFriendshipStatus(3);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
      toast.error("Lỗi khi gửi yêu cầu kết bạn. Vui lòng thử lại sau.");
    }
  };

  const checkFriendshipStatus = async (userId) => {
    try {
      if (!userId) return;
      const response = await axios.get(`${url}/api/Friendship/check-friendship-status?otherUserId=${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setFriendshipStatus(response.data);
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái kết bạn:", error);
    }
  };

  const handleAcceptFriendRequest = async (senderId) => {
    try {
      const response = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Friendship/accept?fromUserId=${senderId}`,
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      if (response.status === 200) {
        dispatch(viewProfile(senderId, token));
        toast.success("Chấp nhận kết bạn thành công!");
        setFriendshipStatus(1);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Lỗi khi chấp nhận kết bạn!");
    }
  };

  const handleRejectFriendRequest = async (userIdRequest) => {
    console.log("id ", userIdRequest);
    try {
      const response = await axios.delete(
        `${url}/api/Friendship/remove?friendUserId=${userIdRequest}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Từ chối kết bạn thành công!");
        setFriendshipStatus(2);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Lỗi khi từ chối kết bạn!");
    }
  };

  const renderFriendshipActions = () => {
    switch (friendshipStatus) {
      case 1:
        return (
          <Dropdown.Item onClick={() => handleRejectFriendRequest(dataProfile.profile.userId)}>
            <span className="icon-option">
              <ion-icon name="person-remove-outline"></ion-icon>
            </span>
            Xóa bạn bè
          </Dropdown.Item>
        );
      case 2:
        return (
          <Dropdown.Item onClick={handleSendFriendRequest}>
            <span className="icon-option">
              <ion-icon name="person-add-outline"></ion-icon>
            </span>
            Kết bạn
          </Dropdown.Item>
        );
      case 3:
        return (
          <Dropdown.Item onClick={() => handleRejectFriendRequest(dataProfile.profile.userId)}>
            <span className="icon-option">
              <ion-icon name="arrow-undo-outline"></ion-icon>
            </span>
            Thu hồi lời mời
          </Dropdown.Item>
        );
      case 4:
        return (
          <>
            <Dropdown.Item onClick={() => handleAcceptFriendRequest(dataProfile.profile.userId)}>
              <span className="icon-option">
                <ion-icon name="checkmark-outline"></ion-icon>
              </span>
              Chấp nhận
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleRejectFriendRequest(dataProfile.profile.userId)}>
              <span className="icon-option">
                <ion-icon name="close-outline"></ion-icon>
              </span>
              Từ chối
            </Dropdown.Item>
          </>
        );
      default:
        return (
          <>
            <Dropdown.Item onClick={handleSendFriendRequest}>
              <span className="icon-option">
                <ion-icon name="person-add-outline"></ion-icon>
              </span>
              Kết bạn
            </Dropdown.Item>
            <Dropdown.Item onClick={handleOpenReportModal}>
              <span className="icon-option">
                <ion-icon name="warning-outline"></ion-icon>
              </span>
              Báo cáo
            </Dropdown.Item>
          </>
        );
    }
  };

  // Render phần thông tin profile
  if (!dataProfile || !dataProfile.languages || !dataProfile.education) {
    return (
      <div className="d-flex justify-content-center profile-card">
        <div className="profile-card-container">
          <div className="d-flex justify-content-center profile-image-wrapper">
            <Skeleton circle={true} width={192} height={192} />
          </div>
          <div className="profile-info">
            <Skeleton width={120} height={20} />
            <Skeleton width={100} height={20} />
            <Skeleton width={150} height={20} />
            <Skeleton width={100} height={40} style={{ marginRight: "10px" }} />
            <Skeleton width={100} height={40} />
            <Skeleton width={200} height={20} />
            <Skeleton width={180} height={20} />
            <Skeleton width={150} height={20} />
            <Skeleton width={160} height={20} />
            <Skeleton width={140} height={20} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center profile-card position-relative">
      <img
        className="rounded-circle object-fit-cover position-absolute profile_image"
        src={dataProfile.profile.imageUser || "default-image-url"}
        alt="User profile"
        width={192}
        height={192}
        style={{
          border: "2px solid #d9d9d9",
        }}
      />
      <div className="profile-card-container">
        <div className="d-flex justify-content-center">
          {/* Chỉ hiển thị phần upload ảnh nếu ở RoutePath.PROFILE */}
          {location.pathname === RoutePath.PROFILE && (
            <>
              <label htmlFor="upload-image" className="upload-icon text-white">
                <ion-icon name="camera-outline"></ion-icon>
              </label>
              <input
                type="file"
                id="upload-image"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>
        <div className="profile-info">
          <p className="text-center fw-medium profile-name">
            {dataProfile.profile.user.fullName || "Chưa cập nhập"}
          </p>

          <p className="fw-medium text-center" style={{ fontSize: "20px", color: "#007931" }}>
            {dataProfile.profile.hostingAvailability}
          </p>

          <div className="profile-buttons" style={{ marginTop: "24px", marginBottom: "24px" }}>
            {location.pathname === `${RoutePath.PROFILE}` || location.pathname === `${RoutePath.PROFILE_EDIT}` || location.pathname === `${RoutePath.PROFILE_EDIT_MY_HOME}` ? (
              <>
                {location.pathname === `${RoutePath.PROFILE_EDIT}` || location.pathname === `${RoutePath.PROFILE_EDIT_MY_HOME}` ? (
                  <Button as={Link} to={RoutePath.PROFILE} variant="success" className="profile-button profile-button-success">
                    Hồ sơ
                  </Button>
                ) : (
                  <Button as={Link} to={RoutePath.PROFILE_EDIT} variant="success" className="profile-button profile-button-success">
                    Chỉnh sửa
                  </Button>
                )}
                <Button as={Link} to={RoutePath.SETTING} variant="secondary" className="profile-button profile-button-secondary">
                  Cài đặt
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => handelShowFormRequest(true)} variant="success" className="profile-button profile-button-success">
                  <span className="send-request">Nhắn tin</span>
                </Button>
                <DropdownButton
                  id="dropdown-options"
                  variant="custom"
                  className="profile-button-options"
                  title={
                    <span style={{ color: "white" }}>
                      Tùy chọn <ion-icon name="chevron-down-outline" style={{ color: "white" }}></ion-icon>
                    </span>
                  }
                >
                  {renderFriendshipActions()}
                </DropdownButton>
              </>
            )}
          </div>

          <hr className="border-line" />

          <div
            className="d-flex flex-column justify-content-between"
            style={{
              gap: "20px",
            }}
          >
            <div className="profile-location">
              <ion-icon name="location-outline"></ion-icon>
              <span className="m-0">{dataProfile.profile.address || "Chưa cập nhập"}</span>
            </div>

            <div className="profile-education">
              <ion-icon name="book-outline"></ion-icon>
              <span className="m-0">
                {dataProfile.education && dataProfile.education.$values && dataProfile.education.$values.length > 0
                  ? dataProfile.education.$values[0].university.universityName
                  : "Chưa cập nhập"}
              </span>
            </div>

            <div className="profile-language">
              <ion-icon name="language-outline"></ion-icon>
              <span className="m-0">
                {dataProfile.languages && dataProfile.languages.$values && dataProfile.languages.$values.length > 0
                  ? dataProfile.languages.$values.map((lang) => lang.languages.languagesName).join(", ")
                  : "Chưa cập nhập"}
              </span>
            </div>

            <div className="profile-joined">
              <ion-icon name="person-add-outline"></ion-icon>
              <span className="m-0">Thành viên tham gia từ {registrationDate}</span>
            </div>

            <div className="profile-completion">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              <span className="m-0">{completionPercentage}% hoàn thành hồ sơ</span>
            </div>
          </div>
        </div>
      </div>
      <FormModal show={isShowFormRequest} saveButtonText={'Lưu thay đổi'} title={'Nhập thông tin'} handleClose={handelCloseFormRequest} handleSave={handleSubmit}>
        {isLoadingFormData ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : !formData ? (
          <p>Người dùng chưa tạo form.</p>
        ) : (
          <>
            <Container>
              <Form>
                <Form.Group>
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>ngày kết thúc</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Label>Dịch vụ</Form.Label>
                <div className="d-flex justify-content-between">
                  <p className="text">Tên dịch vụ</p>
                  <p>Giá</p>
                </div>
                {services.map(service => (
                  <Form.Group key={service.id} className="d-flex justify-content-between">
                    <Form.Check
                      type="checkbox"
                      label={service.serviceName}
                      checked={service.total > 0}
                      onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                    />
                    <p>{service.amount}</p>
                  </Form.Group>
                ))}
                <h6>Câu hỏi</h6>
                {formData.questions.$values.map(question => (
                  <Form.Group key={question.id}>
                    <Form.Label>{question.text}</Form.Label>
                    {question.type === 'multiple-choice' && (
                      <div>
                        {question.options.$values.map(option => (
                          <Form.Check
                            type="radio"
                            name={question.id}
                            value={option}
                            label={option}
                            onChange={() => handleChange(question.id, option)}
                            key={option}
                          />
                        ))}
                      </div>
                    )}
                    {question.type === 'yesno' && (
                      <div>
                        <Form.Check
                          type="radio"
                          name={question.id}
                          value="yes"
                          label="Yes"
                          onChange={() => handleChange(question.id, 'yes')}
                        />
                        <Form.Check
                          type="radio"
                          name={question.id}
                          value="no"
                          label="No"
                          onChange={() => handleChange(question.id, 'no')}
                        />
                      </div>
                    )}
                    {question.type === 'multiple' && (
                      <div>
                        {question.options.$values.map(option => (
                          <Form.Check
                            type="checkbox"
                            value={option}
                            label={option}
                            onChange={(e) => {
                              const newAnswers = answers[question.id] || [];
                              if (e.target.checked) {
                                newAnswers.push(option);
                              } else {
                                const index = newAnswers.indexOf(option);
                                if (index > -1) {
                                  newAnswers.splice(index, 1);
                                }
                              }
                              handleChange(question.id, newAnswers);
                            }}
                            key={option}
                          />
                        ))}
                      </div>
                    )}
                    {question.type === 'text' && (
                      <Form.Control
                        type="text"
                        name={question.id}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                      />
                    )}
                    {question.type === 'single' && (
                      <div>
                        {question.options.$values.map(option => (
                          <Form.Check
                            type="radio"
                            name={question.id}
                            value={option}
                            label={option}
                            onChange={() => handleChange(question.id, option)}
                            key={option}
                          />
                        ))}
                      </div>
                    )}
                  </Form.Group>
                ))}
              </Form>
            </Container>
          </>
        )}
      </FormModal>
      <FormModal show={isReportModalOpen} saveButtonText={'Gửi báo cáo'} title={'Báo cáo người dùng'} handleClose={handleCloseReportModal} handleSave={handleReportSubmit}>
        <Container>
          <Form.Group>
            <Form.Label>Chi tiết</Form.Label>
            <TextareaAutosize className="form-control" minRows={5} value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ảnh báo cáo</Form.Label>
            <Form.Control type="file" onChange={(e) => setReportImage(e.target.files[0])} />
            {reportImage && (
              <div className="mt-2">
                <img src={URL.createObjectURL(reportImage)} alt="Report" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Loại báo cáo</Form.Label>
            <Form.Control as="select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="User">Khiêu dâm</option>
              <option value="Content">Đả kích</option>
              <option value="Content">Lời nói xúc phạm</option>
              <option value="Content">Gian dối</option>
              <option value="Other">Khác</option>
            </Form.Control>
          </Form.Group>
        </Container>
      </FormModal>
    </div>
  );
}

export default ProfileCard;
