import React from 'react';
import '../../assets/css/Contracts/TimeLine.css';

const TimeLine = React.memo(({ activeStep = 0 }) => {
    return (
        <div className="container">
            <ul className="timeline">
                <li className={activeStep >= 1 ? "active-tl" : ""}>Tạo hợp đồng</li>
                <li className={activeStep >= 2 ? "active-tl" : ""}>Thanh toán đặt cọc</li>
                <li className={activeStep >= 3 ? "active-tl" : ""}>Chuyến đi</li>
                <li className={activeStep >= 4 ? "active-tl" : ""}>Hoàn thành</li>
            </ul>
        </div>
    );
});

export default TimeLine;
