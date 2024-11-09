import React, { useEffect, useState } from 'react';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useSelector } from 'react-redux';


const GroupView = () => {
  const groupDataRedux = useSelector((state) => state.group.selectedGroup);

  return (
    <div className='my_group_detail_container'>
      <img src={groupDataRedux.img || groupDataRedux.groupImageUrl} alt="" className='banner_group' />
      <div className='d-flex justify-content-between'>
        <div className='d-flex gap-2'>
          <h2 className='fw-bold m-0'>{groupDataRedux?.title || groupDataRedux.groupName || ''}</h2>
          <h5 className='m-0 fw-medium'>{groupDataRedux.location}</h5>
        </div>
      </div>
      <p className='fw-semibold'>{groupDataRedux.members || groupDataRedux.numberOfParticipants} thành viên</p>
      <p className='fw-light'>{groupDataRedux.text || groupDataRedux.description}</p>
      <hr className='my-5' />
    </div>
  );
};

export default GroupView;
