import React, { useState } from 'react'
function GroupManagement() {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div style={{ paddingTop: '20px', width: '100vw', backgroundColor: '#f8f9fa' }}>
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Shadow effect for floating look
                    overflow: 'hidden',
                    width: '100%', // Full width of the screen
                    maxWidth: '100%',
                    margin: '0 auto', // Centering
                }}
            >
                <div>
                    <img
                        src={'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj'}
                        alt="Group banner"
                        style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                        }}
                    />
                </div>
                <div style={{ padding: '20px', textAlign: 'left' }}>
                    <h2 style={{ margin: '0' }}>Hội An và những chuyến đi</h2>
                    <p style={{ color: '#888', fontSize: '14px' }}>Công khai · 10 thành viên</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            onClick={() => setActiveTab('posts')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'posts' ? '#4CAF50' : '#ddd',
                                color: activeTab === 'posts' ? '#fff' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Bài viết
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'members' ? '#4CAF50' : '#ddd',
                                color: activeTab === 'members' ? '#fff' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Thành viên
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', padding: '0px', width: '100%', maxWidth: '100%', margin: '20px auto 0', gap: '20px' }}>
                {activeTab === 'members' && (
                    <div style={{ flex: '2', backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}>
                        <div>
                        <h3>Quản trị viên nhóm</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {[...Array(6)].map((_, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e0e0e0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #4CAF50',
                                        }}
                                    >
                                        <img
                                            src={'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj'}
                                            alt="Avatar"
                                            style={{ borderRadius: '50%', width: '100%', height: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px' }}>Trần Nhơn</p>
                                        <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>Đang ở Điện Bàn, Quảng Nam</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                        <div>
                        <h3 style={{paddingTop: '30px'}}>Thành viên nhóm</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {[...Array(6)].map((_, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e0e0e0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #4CAF50',
                                        }}
                                    >
                                        <img
                                            src={'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj'}
                                            alt="Avatar"
                                            style={{ borderRadius: '50%', width: '100%', height: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px' }}>Trần Nhơn</p>
                                        <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>Đang ở Điện Bàn, Quảng Nam</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                )}
                {activeTab === 'posts' && (
                    <div style={{ flex: '2', backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}>
                        <h3>CHUYẾN ĐI</h3>
                        {[...Array(2)].map((_, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <p style={{ fontWeight: 'bold' }}>Duy Nhơn - Đà Nẵng, Việt Nam</p>
                                <p>Xin chào mọi người, Hôm nay chúng tôi đã chia sẻ điểm mới tại Đà Nẵng 2 ngày 1 đêm của chúng tôi.</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[...Array(3)].map((_, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj'}
                                            alt="Trip"
                                            style={{ width: '100%', maxWidth: '150px', borderRadius: '10px' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ flex: '1', backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}>
                    <h3>Tùy chọn</h3>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        <li>Mời mọi người</li>
                        <li>Tạo bài viết</li>
                        <li>Duyệt bài viết</li>
                        <li>Cài đặt</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GroupManagement
