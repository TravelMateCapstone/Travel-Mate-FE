import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../../assets/css/Tour/TourDetail.css";
import { Button } from "react-bootstrap";
function TourDetail() {
    const [key, setKey] = useState("home");
    return (
        <div>
            <main className="__className_843922">
                <div>
                    <div className="py-0 container">
                        <section className="flex flex-col py-4">
                            <h1 className="text-purple fw-semibold">
                                Tour du lịch tình nguyện Lô Lô Chải – Hà Giang
                            </h1>
                        </section>
                        <div className="row">
                            <div className="col-md-8">
                                <img
                                    alt="thumbnail"
                                    loading="lazy"
                                    width={793}
                                    height={415}
                                    decoding="async"
                                    data-nimg={1}
                                    className="tour-detail_mainImg___iF_K"
                                    style={{ color: "transparent" }}
                                    src="https://archive.veo.com.vn/tour/phat-trien-du-lich-cong-dong-tai-lo-lo-chai/du-lich-cong-dong-tai-ha-giang-1/"
                                />
                            </div>
                            <div className="hidden lg:block col-md-4">
                                <div className="border-1 p-3 rounded-4">
                                    <div className="flex flex-col tour-form_gap__N_UmA ">
                                        <h5>Thông tin người địa phương</h5>
                                        <div className="d-flex gap-2 align-items-center"><ion-icon name="call-outline"></ion-icon> 
                                            <p className="m-0">0123456789</p>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center"><ion-icon name="logo-facebook"></ion-icon> 
                                            <p className="m-0">
                                                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Trang cá nhân người địa phương</a>
                                            </p>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center"><ion-icon name="mail-outline"></ion-icon>
                                            <p className="m-0">admin@gmail.com</p>
                                        </div>

                                        <h5>Thông tin cơ bản chuyến đi</h5>
                                        <div>
                                            <span className="fw-semibold">Khởi hành từ: </span>
                                            Hà Nội
                                        </div>
                                        <div>
                                            <span className="fw-semibold">Thời gian: </span>2 ngày 3
                                            đêm
                                        </div>
                                        <div>
                                            <span className="fw-semibold">Chọn ngày khởi hành: </span>
                                        </div>
                                        <div className="flex flex-wrap gap-[10px]" />
                                    </div>
                                    <div>
                                        <span>2.980.000&nbsp;₫</span>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <Button variant="success">🔥 Đặt chỗ ngay!</Button>
                                        <Button variant="outline-dark">📞 Liên hệ tư vấn</Button>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="my-3 no-border-radius"
                        >
                            <Tab eventKey="home" title="Lịch trình">
                                <div>
                                    <h4>Ngày 1</h4>
                                    <p>8:00 AM - Khởi hành từ Hà Nội</p>
                                    <p>12:00 PM - Ăn trưa tại nhà hàng địa phương</p>
                                    <p>2:00 PM - Tham quan làng Lô Lô Chải</p>
                                    <img src="https://vcdn1-dulich.vnecdn.net/2023/10/21/Lolo-1697862290.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=Opa6JQdzUR0Jjj5HF3WBTA" alt="" />
                                    <ul>
                                        <li>Nhóm dạy học: Tổ chức lớp học tiếng Anh và kỹ năng sống cho trẻ em vùng cao </li>
                                        <li>Nhóm cơ sở: Triển khai hoạt động tu sửa cơ sở vật chất, cải tạo cảnh quan tại địa phương</li>
                                        <li>Nhóm marketing: Thu thập tư liệu và quảng bá về mô hình du lịch cộng đồng tại Bản Giốc – Cao Bằng và văn hóa truyền thống dân tộc Tày</li>
                                        <li>Nhóm chương trình: Chuẩn bị chương trình Gala Night giao lưu giữa tình nguyện viên và các em nhỏ, người dân địa phương</li>
                                    </ul>
                                    <p>6:00 PM - Ăn tối và nghỉ ngơi tại homestay</p>
                                </div>
                                <div>
                                    <h4>Ngày 2</h4>
                                    <p>7:00 AM - Ăn sáng</p>
                                    <p>8:00 AM - Tham gia hoạt động tình nguyện</p>
                                    <p>12:00 PM - Ăn trưa</p>
                                    <p>2:00 PM - Khởi hành về Hà Nội</p>
                                    <p>6:00 PM - Về đến Hà Nội, kết thúc chuyến đi</p>
                                </div>
                            </Tab>
                            <Tab eventKey="profile" title="Chi phí">
                                <h4>Lưu ý</h4>
                                <ul>
                                    <li>Trẻ em từ 5 – dưới 10 tuổi được giảm 25% chi phí tiêu chuẩn (yêu cầu người lớn đi cùng)</li>
                                    <li>Phụ thu 10% chi phí đối với tình nguyện viên quốc tế</li>
                                </ul>
                                <h4>Chi phí bao gồm</h4>
                                <ul>
                                    <li>Xe đưa đón toàn bộ hành trình</li>
                                    <li>Nơi ở trong toàn bộ hành trình
                                        Bữa ăn: 4 bữa chính, 2 bữa phụ</li>
                                    <li>Bữa ăn: 4 bữa chính, 2 bữa phụ</li>
                                    <li>Chi phí cho hoạt động tình nguyện và trải nghiệm văn hóa</li>
                                </ul>
                                <h4>Chi phí không bao gồm</h4>
                                <ul>
                                    <li>Chi tiêu cá nhân</li>
                                    <li>Đồ ăn, uống tự gọi ngoài chương trình</li>
                                    <li>Hóa đơn VAT</li>
                                </ul>
                            </Tab>
                            <Tab eventKey="contact" title="Quy định">

                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TourDetail;
