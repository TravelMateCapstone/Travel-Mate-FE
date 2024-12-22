import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import '../assets/css/Setting.css';

import { toast } from 'react-toastify';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { viewProfile } from '../redux/actions/profileActions';
import SaveSignature from '../components/Tour/SaveSignature';
import VerifySignatureRSA from '../components/Tour/VerifySignatureRSA';

function Setting() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState(null);
  const [backImageUrl, setBackImageUrl] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [isSignature, setIsSignature] = useState(false);

  const dispatch = useDispatch();

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    city: '',
    birthdate: '',
    address: '',
    phone: '', // Thêm thuộc tính phone nếu cần
  });

  const [phone, setPhone] = useState(profile.phone || '');

  const fetchCCCDInfo = async () => {
    try {
      const response = await axios.get(
        'https://travelmateapp.azurewebsites.net/api/CCCD/Current-User',
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Không thể lấy thông tin CCCD');
      }

      const cccdData = response.data.data;
      setFrontImageUrl(cccdData.imageFront);
      setBackImageUrl(cccdData.imageBack);

      return cccdData;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin CCCD:', error);
      throw error;
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const response = await axios.get(
        'https://travelmateapp.azurewebsites.net/api/Profile/current-profile',
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const profileData = response.data;
      console.log("ddd", profileData);
      setProfile({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        gender: profileData.gender || '',
        city: profileData.city || '',
        birthdate: profileData.birthdate ? profileData.birthdate.split('T')[0] : '',
        address: profileData.address || '',
      });
      setPhone(profileData.phone || '');
      return profileData;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin Profile:", error);
      toast.error('Lỗi khi lấy thông tin Profile.');
      throw error;
    }
  };

  const checkCCCDAndSignature = async () => {
    try {
      const response = await axios.get(
        'https://travelmateapp.azurewebsites.net/api/CCCD/verify-cccd-signature',
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const data = response.data;
      const check = data.verificationDetails.publicSignatureMessage;
      console.log('check sign', check);
      if (check === 'Chữ ký số đã được xác minh.') {
        setIsSignature(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin check Signature:", error);
      throw error;
    }
  };


  useEffect(() => {
    checkCCCDAndSignature();
    fetchCCCDInfo();
    fetchProfileInfo();

  }, [token]);


  const splitFullName = (fullName) => {
    const nameParts = fullName.trim().split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');
    return { firstName, lastName };
  };

  const updateProfileInfo = async (cccdData, profileData) => {
    const { firstName, lastName } = splitFullName(cccdData.name);
    const payload = {
      fullName: cccdData.name,
      firstName,
      lastName,
      address: cccdData.address || profileData.address,
      phone: profileData.phone || '',
      gender: cccdData.sex || profileData.gender,
      birthdate: cccdData.dob,
      city: profileData.city || '',
      description: profileData.description || '',
      hostingAvailability: profileData.hostingAvailability || '',
      whyUseTravelMate: profileData.whyUseTravelMate || '',
      musicMoviesBooks: profileData.musicMoviesBooks || '',
      whatToShare: profileData.whatToShare || '',
      imageUser: profileData.imageUser || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    };

    try {
      // Gọi API update-fullname
      await axios.put(
        'https://travelmateapp.azurewebsites.net/api/ApplicationUsersWOO/update-fullname',
        { fullName: cccdData.name },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("Cập nhật tên đầy đủ thành công.");

      // Gọi API cập nhật thông tin Profile
      const response = await axios.put(
        'https://travelmateapp.azurewebsites.net/api/Profile/edit-by-current-user',
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Cập nhật thông tin thành công.");
      console.log("Kết quả API cập nhật Profile:", response.data);

    } catch (error) {
      console.error("Lỗi khi cập nhật Profile hoặc tên đầy đủ:", error);
      toast.error('Lỗi khi cập nhật thông tin Profile.');
    }
  };


  // liên hệ khẩn cấp
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    email: '',
    noteContact: '',
  });

  // Fetch emergency contact info
  useEffect(() => {
    const fetchEmergencyContact = async () => {
      try {
        const response = await axios.get(
          'https://travelmateapp.azurewebsites.net/api/UserContact/Get-CurrentUser',
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const contactData = response.data?.$values?.[0] || {};
        setEmergencyContact({
          name: contactData.name || '',
          phone: contactData.phone || '',
          email: contactData.email || '',
          noteContact: contactData.noteContact || '',
        });
      } catch (error) {
        console.error('Error fetching emergency contact:', error);
        toast.error('Không thể tải thông tin liên hệ khẩn cấp.');
      }
    };

    fetchEmergencyContact();
  }, [token]);

  // Handle input changes
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveInfo = async () => {
    try {
      const updatedData = {
        firstName: capitalizeWords(profile.firstName || ''),
        lastName: capitalizeWords(profile.lastName || ''),
        address: capitalizeWords(profile.address || ''),
        phone: phone || '',
        gender: profile.gender || '',
        city: capitalizeWords(profile.city || ''),
        description: profile.description || '',
        hostingAvailability: profile.hostingAvailability || '',
        whyUseTravelMate: profile.whyUseTravelMate || '',
        musicMoviesBooks: profile.musicMoviesBooks || '',
        whatToShare: profile.whatToShare || '',
        birthdate: profile.birthdate || '',
        imageUser: user?.avatarUrl || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      };
      console.log('dtad', updatedData);

      // const response = await axios.put(
      //   'https://travelmateapp.azurewebsites.net/api/Profile/edit-by-current-user',
      //   updatedData,
      //   {
      //     headers: {
      //       Authorization: `${token}`,
      //     },
      //   }
      // );

      // if (response.status === 200) {
      //   toast.success("Cập nhật thông tin thành công.");
      // } else {
      //   throw new Error("Cập nhật thất bại.");
      // }

      try {
        const response = await axios.put(
          'https://travelmateapp.azurewebsites.net/api/UserContact/Update-Contact-CurrentUser',
          emergencyContact,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success('Cập nhật thông tin liên hệ khẩn cấp thành công.');
        } else {
          throw new Error('Cập nhật thất bại.');
        }
      } catch (error) {
        console.error('Error saving emergency contact:', error);
        toast.error('Lỗi khi lưu thông tin liên hệ khẩn cấp.');
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      toast.error("Lỗi khi cập nhật thông tin.");
    }
  };


  const handleFrontImageUpload = async (event) => {

    const file = event.target.files[0];
    if (!file) return;
    setFrontImage(file);

    try {
      // Upload image to Firebase
      const storageRef = ref(storage, `cccd/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFrontImageUrl(downloadURL);
      console.log("Ảnh đã tải lên:", downloadURL);

      // Call FPT API for OCR
      const formData = new FormData();
      formData.append('image', file);
      const ocrResponse = await axios.post(
        'https://api.fpt.ai/vision/idr/vnm',
        formData,
        {
          headers: {
            'api-key': 'aHlapDPHrYrQuKWhKa0VsjcrTegwwamr',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { errorCode, data } = ocrResponse.data;
      if (errorCode !== 0 || !data || data.length === 0) {
        toast.error('Không thể lấy được thông tin CCCD.');
        return;
      }

      const cccdData = data[0];

      // Kiểm tra dữ liệu nhận được
      const requiredFields = ['id', 'name', 'dob', 'sex', 'nationality', 'home', 'address', 'doe'];
      for (const field of requiredFields) {
        if (!cccdData[field]) {
          toast.error(`Không lấy được thông tin`);
          setFrontImageUrl('');
          return;
        }
      }

      console.log("Dữ liệu CCCD nhận được:", cccdData);

      // Send image URL to your backend to create imageFront
      const createImageFrontResponse = await axios.post(
        'https://travelmateapp.azurewebsites.net/api/CCCD/create-imageFront',
        downloadURL,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        }
      );

      if (createImageFrontResponse.status === 200) {
        // Gửi yêu cầu cập nhật thông tin CCCD
        const updateResponse = await axios.put(
          'https://travelmateapp.azurewebsites.net/api/CCCD/update-details-front',
          {
            id: cccdData.id,
            name: cccdData.name,
            dob: cccdData.dob.split('/').reverse().join('-'),
            sex: cccdData.sex,
            nationality: cccdData.nationality,
            home: cccdData.home,
            address: cccdData.address,
            doe: cccdData.doe.split('/').reverse().join('-'),
          },
          {
            headers: {
              'Authorization': `${token}`,
            },
          }
        );

        console.log("Kết quả trả về từ API update-details-front:", updateResponse.data);
        toast.success('Xác thực CCCD thành công.');
      } else {
        toast.error('Lỗi khi tạo ảnh CCCD.');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      toast.error('Đã xảy ra lỗi trong quá trình xác thực CCCD.');
    }
  };

  const handleBackImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setBackImage(file);

    try {
      // Upload image to Firebase
      const storageRef = ref(storage, `cccd/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setBackImageUrl(downloadURL);

      console.log("Ảnh mặt sau đã tải lên:", downloadURL);

      // Gửi ảnh tới API OCR
      const formData = new FormData();
      formData.append('image', file);
      const ocrResponse = await axios.post(
        'https://api.fpt.ai/vision/idr/vnm',
        formData,
        {
          headers: {
            'api-key': 'aHlapDPHrYrQuKWhKa0VsjcrTegwwamr',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { errorCode, data } = ocrResponse.data;
      if (errorCode !== 0) {
        toast.error('Không thể lấy được thông tin mặt sau CCCD.');
        return;
      }

      // Gọi API update-imageBack với link ảnh
      await axios.put(
        'https://travelmateapp.azurewebsites.net/api/CCCD/update-imageBack',
        {
          imageBack: downloadURL,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Đã cập nhật hình ảnh mặt sau CCCD thành công.");

      const cccdData = data[0];
      console.log("Dữ liệu CCCD mặt sau nhận được:", cccdData);

      // Gửi yêu cầu cập nhật thông tin CCCD mặt sau
      const updateResponse = await axios.put(
        'https://travelmateapp.azurewebsites.net/api/CCCD/update-details-back',
        {
          issue_date: cccdData.issue_date.split('/').reverse().join('-'),
          issue_loc: cccdData.issue_loc,
          features: cccdData.features,
          mrz: cccdData.mrz,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Kết quả trả về từ API update-details-back:", updateResponse.data);
      toast.success('Xác thực CCCD mặt sau thành công.');

      // Cập nhật trực tiếp profile
      const cccdDataFromApi = await fetchCCCDInfo();
      const profileData = await fetchProfileInfo();
      await updateProfileInfo(cccdDataFromApi, profileData);

      // Cập nhật profile state ngay lập tức
      setProfile((prevProfile) => ({
        ...prevProfile,
        firstName: cccdDataFromApi.name.split(' ')[0],
        lastName: cccdDataFromApi.name.split(' ').slice(1).join(' '),
        address: cccdDataFromApi.address,
        gender: cccdDataFromApi.sex,
        birthdate: cccdDataFromApi.dob.split('/').reverse().join('-'),
      }));

      dispatch(viewProfile(user.id, token));

    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      toast.error('Đã xảy ra lỗi trong quá trình xác thực CCCD mặt sau.');
    }
  };

  return (
    <Container>
      <h2>Cài đặt</h2>
      <Row>
        <Col md={3} className="bg-light p-4 rounded bg-white">
          <Nav className="flex-column setting-menu">
            <Nav.Link className="nav-link-custom-setting">
              Tài Khoản
            </Nav.Link>
            <Nav.Link className="nav-link-custom-setting">
              Thông Báo
            </Nav.Link>
            <Nav.Link className="nav-link-custom-setting">
              Đăng Kí Thành Viên
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} className="p-4 rounded shadow-sm bg-white border">
          <h4>Chi Tiết Tài Khoản</h4>

          <section id="account-info" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Thông Tin Người Dùng</h5>
            <Row>
              <Col md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2" style={{ width: '11.5%' }}>Tên tài khoản</Form.Label>
                  <Form.Control type="text" placeholder="" value={`${user.username}`} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Họ</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.firstName}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.lastName}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.gender}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={profile.birthdate}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <h5 style={{ color: '#E65C00' }}>Định danh tài khoản</h5>
              <Col md={6}>
                <div className="image-upload-wrapper d-flex align-items-center">
                  <p className="me-2" style={{ width: '28%' }}>Ảnh CCCD mặt trước <span style={{ color: 'red' }}>*</span></p>
                  {frontImageUrl ? (
                    <div className="uploaded-image">
                      <img src={frontImageUrl} alt="CCCD Mặt Trước" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  ) : (
                    <div className="image-upload">
                      <label htmlFor="front-image" className="upload-icon">
                        <ion-icon name="camera-outline"></ion-icon>
                      </label>
                      <input
                        type="file"
                        id="front-image"
                        accept="image/*"
                        onChange={handleFrontImageUpload}
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <div className="image-upload-wrapper d-flex align-items-center">
                  <p className="me-2" style={{ width: '28%' }}>Ảnh CCCD mặt sau <span style={{ color: 'red' }}>*</span></p>
                  {backImageUrl ? (
                    <div className="uploaded-image">
                      <img src={backImageUrl} alt="CCCD Mặt Sau" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  ) : (
                    <div className="image-upload">
                      <label htmlFor="back-image" className="upload-icon">
                        <ion-icon name="camera-outline"></ion-icon>
                      </label>
                      <input
                        type="file"
                        id="back-image"
                        accept="image/*"
                        onChange={handleBackImageUpload}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2" style={{ width: '11.5%' }}>Chữ ký số <span style={{ color: 'red' }}>*</span></Form.Label>
                  {isSignature ? (
                    <span className="text-success fw-bold">Chữ ký số đã được tạo</span>
                  ) : (
                    <SaveSignature />
                  )}
                </Form.Group>
                <p style={{ fontStyle: 'italic', color: '#6c757d', marginLeft: '12.5%' }}>Chữ ký số giúp người dùng xác thực tính pháp lý và bảo mật của tài liệu điện tử, đáp ứng yêu cầu của các giao dịch trực tuyến hoặc hợp đồng số.</p>

              </Col>
            </Row>

          </section>

          <section id="account-details" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Thông Tin Tài Khoản</h5>
            <Form.Group className="d-flex align-items-center">
              <Form.Label>Email <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="email" value={`${user.emailaddress}`} readOnly />
            </Form.Group>
            {/* <Form.Group className="d-flex align-items-center mt-3">
                        <Form.Label className="me-2" style={{ width: '12.5%' }}>Mật khẩu</Form.Label>
                        <p className="text-muted">Đổi mật khẩu</p>
                      </Form.Group> */}
          </section>

          <section id="contact-info" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Thông Tin Liên Lạc</h5>
            <Form.Group className="d-flex align-items-center">
              <Form.Label>Số điện thoại <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Địa chỉ nhà</Form.Label>
              <Form.Control
                type="text"
                value={profile.address}
                readOnly
              />
            </Form.Group>
          </section>

          <section id="emergency-contact" className="mb-4">
            <h5 style={{ color: "#E65C00" }}>Liên Hệ Khẩn Cấp</h5>
            <p className="text-muted">
              Bạn cho phép chúng tôi thông báo cho người này nếu chúng tôi cho rằng
              bạn đang gặp tình huống khẩn cấp và chia sẻ thông tin về hoạt động cũng
              như vị trí của bạn với họ nếu có yêu cầu.
            </p>
            <Form.Group className="d-flex align-items-center">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên"
                name="name"
                value={emergencyContact.name}
                onChange={handleEmergencyContactChange}
              />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Số điện thoại"
                name="phone"
                value={emergencyContact.phone}
                onChange={handleEmergencyContactChange}
              />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={emergencyContact.email}
                onChange={handleEmergencyContactChange}
              />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Ghi chú"
                name="noteContact"
                value={emergencyContact.noteContact}
                onChange={handleEmergencyContactChange}
              />
            </Form.Group>
          </section>
          <div className="d-flex justify-content-end">
            <Button variant="success" className="mt-3" onClick={handleSaveInfo}>
              Lưu Thông Tin
            </Button>

          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Setting;
