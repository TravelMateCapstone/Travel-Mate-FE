import React, { memo } from 'react'
import GroupCard from './GroupCard'
function ProposeGroup() {
    const cardData = [
        {
            id: 1,
            img: 'https://danangfantasticity.com/wp-content/uploads/2024/03/chuong-trinh-kich-cau-va-thu-hut-khach-du-lich-den-da-nang-nam-2024-enjoy-danang-2024.jpg',
            title: 'Câu lạc bộ Lướt sóng',
            location: 'Đà Nẵng',
            members: '35 thành viên',
            text: 'Hướng dẫn viên chuyên nghiệp và cộng đồng vui vẻ sẽ giúp bạn cải thiện kỹ năng lướt sóng và tận hưởng đại dương.',
        },
        {
            id: 2,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS95DegtOM6_WVdoeH-RAidSP_ceOkXcLlOPQ&s',
            title: 'Leo núi',
            location: 'Sapa',
            members: '25 thành viên',
            text: 'Tham gia cùng chúng tôi trong cuộc phiêu lưu trên núi và nâng cao trải nghiệm leo núi của bạn!',
        },
    ];
    return (
        <div className='d-flex flex-column gap-4' style={{
            padding: '0 85px',
        }}>
            <h3>Nhóm đề xuất</h3>
            {cardData.map((card) => (
                <GroupCard
                    img={card.img}
                    title={card.title}
                    location={card.location}
                    members={card.members}
                    text={card.text}
                />
            ))}
        </div>
    )
}

export default memo(ProposeGroup);