import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import '../../assets/css/Groups/MyGroupDetail.css';
import { useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormSubmit from '../../components/Shared/FormSubmit';
import Form from 'react-bootstrap/Form';
import RoutePath from '../../routes/RoutePath';

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
