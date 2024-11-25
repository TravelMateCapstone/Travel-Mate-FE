import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import '../../assets/css/ProfileManagement/MyProfile.css'
function MyProfile() {
    const [key, setKey] = useState('introduce');
    const [showModalForm, setShowModalForm] = useState(false);
    const handleShowModalForm = () => setShowModalForm(true);
    const handleCloseModalForm = () => setShowModalForm(false);
    return (
        <Container>
            <div className='info_section'>
                <div className='info_user_profile'>
                    <img src="https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj" alt="" width={150} height={150} className='rounded-circle' />
                    <div className='info_user_profile_content'>
                        <h4>Trần Hải Đăng</h4>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon> Đà Nẵng, Việt Nam</p>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="person-add-outline"></ion-icon> Thành viên tham gia từ năm 2024</p>
                        <p className='text-success fw-medium  d-flex align-items-center gap-2'><ion-icon name="shield-checkmark-outline"></ion-icon> 65% hoàn thành hồ sơ</p>
                    </div>
                </div>
                <Button variant='success' className='rounded-5' onClick={handleShowModalForm}>Tạo mẫu thông tin</Button>
            </div>

            <div className='edit_section'>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 no-border-radius"
                >
                    <Tab eventKey="introduce" title="GIỚI THIỆU">
                        <div className='d-flex gap-2 align-items-center'>
                            <h5 className='text-nowrap'>Tình trạng đón khách</h5>
                            <Form.Select aria-label="Default select example" className='select_status_traveller'>
                                <option>Tình trạng đón khách</option>
                                <option value="1">Đang bận</option>
                                <option value="2">Chào đón khách</option>
                                <option value="3">Không nhận khách</option>
                            </Form.Select>
                        </div>
                        <hr className='my-5' />
                        <Row className='basic_info'>
                            <Col lg={6}>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Giới thiệu</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Địa chỉ cư trú</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Giáo dục</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Ngôn ngữ đã biết</Form.Label>
                                    <Form.Select aria-label="Default select example" className=''>
                                        <option>Tiếng anh</option>
                                        <option value="1">Đang bận</option>
                                        <option value="2">Chào đón khách</option>
                                        <option value="3">Không nhận khách</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Ngôn ngữ đang học</Form.Label>
                                    <Form.Select aria-label="Default select example" className=''>
                                        <option>Tiếng Nhật</option>
                                        <option value="1">Đang bận</option>
                                        <option value="2">Chào đón khách</option>
                                        <option value="3">Không nhận khách</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <hr className='my-5' />
                        <div className='mb-4'>
                            <h5>Giới thiệu</h5>
                            <Form.Group className="mb-3">
                                <Form.Control as="textarea" rows={3} />
                            </Form.Group>
                        </div>
                        <div className='mb-4'>
                            <h5>Tại sao tôi sử dụng Travel Mate</h5>
                            <Form.Group className="mb-3">
                                <Form.Control as="textarea" rows={3} />
                            </Form.Group>
                        </div>
                        <div className='mb-4'>
                            <h5>Sở thích</h5>
                            <div className='d-flex flex-wrap gap-1 hobbies_container'>
                                <div className='item_hobbies d-flex align-items-center gap-2'>
                                    <p className='m-0'>Item</p>
                                    <ion-icon name="close-outline"></ion-icon>
                                </div>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>Âm nhạc, phim ảnh & sách</h5>
                            <Form.Group className="mb-3">
                                <Form.Control as="textarea" rows={3} />
                            </Form.Group>
                        </div>
                        <Button variant='success' className='rounded-5'>Lưu thay đổi</Button>
                    </Tab>
                    <Tab eventKey="myHome" title="NHÀ CỦA TÔI">
                        Tab content for Profile
                    </Tab>
                    <Tab eventKey="trip" title="CHUYẾN ĐI">
                        Tab content for Contact
                    </Tab>
                    <Tab eventKey="friend" title="BẠN BÈ">
                        Tab content for Contact
                    </Tab>
                    <Tab eventKey="destination" title="ĐỊA ĐIỂM">
                        Tab content for Contact
                    </Tab>
                </Tabs>
            </div>
            <Modal show={showModalForm} onHide={handleCloseModalForm} className="modal_extraDetailForm">
                <Modal.Body>
                    <div className='modal-title'>
                        <h4>Mẫu khảo sát thông tin</h4>
                    </div>
                    <h5>Dịch vụ</h5>
                    <h5>Câu hỏi</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalForm}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleCloseModalForm}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default MyProfile