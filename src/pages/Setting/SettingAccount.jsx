import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import '../../assets/css/Setting/Setting.css'
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

function SettingAccount() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('https://api.fpt.ai/vision/idr/vnm', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'api-key': '8JIYV5d32XHGakgucP899sGDv0QBej5R' 
                }
            });
            console.log(response.data.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };
    return (
        <div className='border-1 rounded-3 p-3 setting_container'>
            <h5 className='text-uppercase fw-bold'>Chi tiết tài khoản</h5>
            <h6 className='text-uppercase fw-bold' style={{
                color: '#E65C00'
            }}>Thông tin người dùng</h6>
            <Row>
                <Col lg={2}><Form.Label>Tên tài khoản</Form.Label></Col>
                <Col lg={10}><Form.Control type='text' placeholder='Nhập họ và tên' /></Col>
            </Row>
            <Row>
                <Col lg={2}><Form.Label>Họ</Form.Label></Col>
                <Col lg={4}><Form.Control type='text' placeholder='Nhập họ ' /></Col>
                <Col lg={2}><Form.Label>Tên</Form.Label></Col>
                <Col lg={4}><Form.Control type='text' placeholder='Nhập họ và tên' /></Col>
            </Row>
            <Row>
                <Col lg={2}><Form.Label>Giới tính</Form.Label></Col>
                <Col lg={4}><Form.Control type='text' placeholder='Nhập họ và tên' /></Col>
                <Col lg={2}><Form.Label>Ngày sinh</Form.Label></Col>
                <Col lg={4}><Form.Control type='text' placeholder='Nhập họ và tên' /></Col>
            </Row>
            <div className='d-flex gap-3'>
                <img className='rounded-3' onClick={() => { document.getElementById('upload_cccd').click() }} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgMzUwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjM1MCI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzNTAiIGZpbGw9IiNjY2NjY2MiPjwvcmVjdD4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjMzMzMzMzIj5DQ0NEIG3hurd0IHRyxrDhu5tjPC90ZXh0PiAgIAo8L3N2Zz4=" alt="" width={320} height={212} />
                <img className='rounded-3' onClick={() => { document.getElementById('upload_cccd').click() }} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgMzUwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjM1MCI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzNTAiIGZpbGw9IiNjY2NjY2MiPjwvcmVjdD4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjMzMzMzMzIj5DQ0NEIG3hurd0IHNhdTwvdGV4dD4gICAKPC9zdmc+" alt="" width={320} height={212} />
            </div>
            <h6 className='text-uppercase fw-bold' style={{
                color: '#E65C00'
            }}>Thông tin tài khoản</h6>
                <Row>
                    <Col lg={2}><Form.Label>Email</Form.Label></Col>
                    <Col lg={10}><Form.Control type='text' placeholder='Nhập email' autoComplete='email' /></Col>
                </Row>
                <Row>
                    <Col lg={2}><Form.Label>Mật khẩu</Form.Label></Col>
                    <Col lg={10}>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Nhập mật khẩu'
                                autoComplete='current-password'
                            />
                            <button
                                className='position-absolute end-0 top-0 bottom-0 d-flex align-items-center justify-content-center'
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{ border: 'none', background: 'transparent' }}
                            >
                                {showPassword ? <ion-icon name="eye-off-outline"></ion-icon> : <ion-icon name="eye-outline"></ion-icon>}
                            </button>
                        </div>
                    </Col>
                </Row>
            <h6 className='text-uppercase fw-bold' style={{
                color: '#E65C00'
            }}>Thông tin liên lạc</h6>
            <Row>
                <Col lg={2}><Form.Label>Số điện thoại</Form.Label></Col>
                <Col lg={10}><Form.Control type='number' placeholder='Nhập số điện thoại' /></Col>
            </Row>
            <Row>
                <Col lg={2}><Form.Label>Địa chỉ nhà</Form.Label></Col>
                <Col lg={10}><Form.Control type='text' placeholder='Nhập địa chỉ nhà' /></Col>
            </Row>
            <h6 className='text-uppercase fw-bold' style={{
                color: '#E65C00'
            }}>liên hệ khẩn cấp</h6>
            <Row>
                <Col lg={2}><Form.Label>Tên</Form.Label></Col>
                <Col lg={10}><Form.Control type='number' placeholder='Nhập số điện thoại' /></Col>
            </Row>
            <Row>
                <Col lg={2}><Form.Label>Số điện thoại</Form.Label></Col>
                <Col lg={10}><Form.Control type='number' placeholder='Nhập số điện thoại' /></Col>
            </Row>
            <Row>
                <Col lg={2}><Form.Label>Email</Form.Label></Col>
                <Col lg={10}><Form.Control type='text' placeholder='Nhập email' autoComplete='username' /></Col>
            </Row>
            <Row>
                <Col lg={2}><Form.Label>Ghi chú</Form.Label></Col>
                <Col lg={10}>
                    <TextareaAutosize
                        className="form-control"
                        placeholder='Nhập ghi chú'
                        minRows={5}
                    />
                </Col>
            </Row>
            <Button variant='success' className='rounded-5 mt-3 w-25'>Lưu thay đổi</Button>
            <input type="file" onChange={handleFileChange} id='upload_cccd' className='d-none' />
        </div>
    )
}

export default SettingAccount