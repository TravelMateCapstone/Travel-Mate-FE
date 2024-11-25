import React, { useState } from 'react';
import ToolBar from '../components/Shared/ToolBar';
import AnswerQuestion from '../components/Profile/FormBuilder/AnswerQuestion';
import CarouselComponent from '../components/Home/CarouselComponent';
import LocalCarousel from '../components/Home/LocalCarousel';
import ThreeDCarousel from '../components/Home/ThreeDCarousel';
import ViewFormRequest from '../components/Profile/FormBuilder/ViewFormRequest'
import { useDispatch, useSelector } from 'react-redux';
import { viewProfile } from '../redux/actions/profileActions';

function Home() {
  const images = [
    'https://cdn.tcdulichtphcm.vn/upload/2-2021/images/2021-06-03/1622716610-thumbnail-width1200height628-watermark.jpg',
    'https://baobariavungtau.com.vn/dataimages/202312/original/images1909456_Ch_o_thuy_n_kayak_l__ho_t___ng__a_th_ch_c_a_du_kh_ch_khi___n_V_nh_H__Long..jpg',
    'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg'
  ];

  const dispatch = useDispatch();

  React.useEffect(() => {
    // dispatch(viewProfile(9));
  }, [dispatch]); // Add dispatch to the dependency array to ensure it runs only once

  const data = useSelector(state => state.profile);

  return (
    <div className='mt-4'>
      <ToolBar />
      <CarouselComponent images={images} />
      <ThreeDCarousel />
      <LocalCarousel />
      <AnswerQuestion />
      <ViewFormRequest />


      <div className='text-custom'>Hello</div>
    </div>
  );
}

export default Home;
