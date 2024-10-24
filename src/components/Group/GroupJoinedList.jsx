import React from 'react';
import '../../assets/css/Groups/GroupJoinedList.css'
function GroupJoinedList() {
    // Dữ liệu giả lập cho các nhóm
    const groups = [
        {
            id: 1,
            name: 'Đội bóng trẻ',
            location: 'Đà Nẵng',
            image: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg',
        },
        {
            id: 2,
            name: 'Nhóm văn học với tên rất dài để kiểm tra xem nó có vượt quá không',
            location: 'Hà Nội',
            image: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg',
        },
        {
            id: 3,
            name: 'Câu lạc bộ âm nhạc',
            location: 'TP. Hồ Chí Minh',
            image: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg',
        },
        {
            id: 4,
            name: 'Nhóm thể thao',
            location: 'Nha Trang',
            image: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg',
        },
        {
            id: 5,
            name: 'Câu lạc bộ du lịch',
            location: 'Huế',
            image: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg',
        },
    ];

    return (
        <div>
            <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '20px 0'
            }}>Nhóm của bạn</div>

            {/* Lặp qua mảng groups để render các card */}
            {groups.map(group => (
                <div key={group.id} className="card mb-3 shadow card-group-container" style={{
                    padding: '18px',
                    height: '92px',
                    borderRadius: '10px'
                }}>
                    <div className="d-flex gap-2">
                        <img src={group.image} className="card-img" alt={group.name} style={{
                            width: '82px',
                            height: '55px',
                            objectFit: 'cover',
                        }} />
                        <div className="card-body m-0 p-0">
                            {/* Thêm các thuộc tính CSS để kiểm soát chiều dài văn bản */}
                            <p className="card-title" style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // Thêm dấu ba chấm nếu văn bản quá dài
                                maxWidth: '160px' // Giới hạn chiều rộng tối đa
                            }}>{group.name}</p>
                            <p className="card-text text-nowrap m-0" style={{
                                fontSize: '12px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // Thêm dấu ba chấm nếu văn bản quá dài
                                maxWidth: '160px' // Giới hạn chiều rộng tối đa
                            }}>{group.location}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GroupJoinedList;
