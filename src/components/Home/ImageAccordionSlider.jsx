import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
function ImageAccordionSlider() {
    return (
        <div>
            <Swiper
                slidesPerView={7}
                spaceBetween={0}
                loop={true}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper my-5"
            >
                <SwiperSlide>
                    <img src="https://media.tapchitaichinh.vn/w1480/images/upload/hoangthuviet/08262022/tr16_qnqs.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://media.vneconomy.vn/w800/images/upload/2022/08/08/8088-lac-minh-vao-tien-canh-trang-an-08111021072019.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/hoi-an-thanh-pho-du-lich-o-viet-nam-thu-hut-nhieu-du-khach.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://ticgroup.vn/uploads/images/images/cat_ba.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://media.thuonghieucongluan.vn/uploads/2022/06/10/du-lich-noi-dia-1590582875432562565334-1654861956.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://caodangquoctesaigon.vn/images/files/caodangquoctesaigon.vn/vai-tro-cua-nganh-du-lich-01.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://images2.thanhnien.vn/528068263637045248/2024/5/23/1000013375-17164364537791681565291.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://www.tugo.com.vn/wp-content/uploads/Du-l%E1%BB%8Bch-Vi%E1%BB%87t-Nam-%C4%91ang-ng%C3%A0y-c%C3%A0ng-ph%C3%A1t-tri%E1%BB%83n.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://trivietagency.com/wp-content/uploads/2024/09/cac-khu-du-lich-viet-nam.jpg" alt="" />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default ImageAccordionSlider