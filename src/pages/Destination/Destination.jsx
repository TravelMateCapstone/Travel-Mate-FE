import React from 'react';
import '../../assets/css/Destination/Destination.css';

const Destination = () => {
    return (
        <div className="destination-container">
            {/* Banner */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Đà Nẵng</h1>
                    <p>Hà Giang là điểm đến lý tưởng cho những ai yêu thích thiên nhiên hoang sơ và khám phá văn hóa dân tộc.</p>
                </div>
            </div>

            {/* Main content */}
            <div className="main-content">
                {/* Suggested Locations */}
                <div className="suggested-locations">
                    <h2>Địa điểm được đề xuất</h2>
                    <div className="location-list">
                        {/* Sample location item */}
                        <div className="location-item">
                            <img
                                src="https://tourism.danang.vn/wp-content/uploads/2023/02/bai-bien-my-khe-da-nang.jpg"
                                alt="Địa điểm"
                            />
                            <div className="location-info">
                                <h3>Bãi Biển Mỹ Khê</h3>
                                <p>Đà Nẵng, Việt Nam</p>
                                <div className="avatar-list">
                                    <img
                                        src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                        alt="User Avatar"
                                    />
                                    <img
                                        src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                        alt="User Avatar"
                                    />
                                    <img
                                        src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                        alt="User Avatar"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorites - Google Map */}
                <div className="favorites">
                    <h2>Ưa thích</h2>
                    <div className="map-container">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15094.874356346337!2d108.211!3d16.0601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1618294659077!5m2!1sen!2s"
                            width="100%"
                            height="400"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
                {/* Local People */}
                <div className="local-people">
                    <h2>Danh sách người địa phương</h2>
                    <div className="people-list">
                        <div className="user-item">
                            <img
                                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                alt="Avatar"
                            />
                            <div>
                                <h3>Nguyễn Văn A</h3>
                                <p>Đà Nẵng, Việt Nam</p>
                            </div>
                        </div>
                        <div className="user-item">
                            <img
                                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                alt="Avatar"
                            />
                            <div>
                                <h3>Nguyễn Văn A</h3>
                                <p>Đà Nẵng, Việt Nam</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="recent-users">
                    <h2>Danh sách người dùng gần đây</h2>
                    <div className="people-list">
                        <div className="user-item">
                            <img
                                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                alt="Avatar"
                            />
                            <div>
                                <h3>Trần Thị B</h3>
                                <p>Hà Nội, Việt Nam</p>
                            </div>
                        </div>
                        <div className="user-item">
                            <img
                                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                                alt="Avatar"
                            />
                            <div>
                                <h3>Trần Thị B</h3>
                                <p>Hà Nội, Việt Nam</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Banner */}
                <div className="event-banner">
                    <h2>Banner sự kiện nổi bật</h2>
                    <div className="event-carousel">
                        <div className="event-item">
                            <img
                                src="https://sukienachau.com/wp-content/uploads/2023/02/z4090655399281_6eaf38c5d0d69efa5e3cd2dd28b88d9c-scaled.jpg"
                                alt="Event"
                            />
                            <div>
                                <h3>Sự kiện âm nhạc</h3>
                                <p>Trải nghiệm buổi biểu diễn âm nhạc ngoài trời tại Đà Nẵng.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="faqs">
                    <h2>Những câu hỏi thường gặp</h2>
                    <ul>
                        <li>Làm sao để đến Đà Nẵng?</li>
                        <li>Nên tham quan những địa điểm nào tại Đà Nẵng?</li>
                        <li>Các món ăn đặc sản của Đà Nẵng là gì?</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Destination;
