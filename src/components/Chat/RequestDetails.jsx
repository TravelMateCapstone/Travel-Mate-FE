import React, { memo } from 'react';
import '../../assets/css/Chat/RequestDetails.css';

function RequestDetails({ request }) {
  return (
    <div className="request-details">
      <h6 className='text-uppercase fw-bold'>Yêu cầu kết nối</h6>
      <div className='p-2 bg-white rounded-4'>
        <div className="request-header">
          <img src={request.avatar} alt={`${request.name}'s avatar`} className="request-avatar" />
          <div>
            <h5 className='p-0 m-0'>{request.name}</h5>
            <p className='p-0 m-0'>{request.location}</p>
          </div>
        </div>
        <div className="request-body">
          <p><strong>Job:</strong> {request.job}</p>
          <p><strong>Bio:</strong> {request.bio}</p>
          <p><strong>Hobbies:</strong> {request.hobbies.join(', ')}</p>
          <p><strong>Request Date:</strong> {request.timestamp}</p>
        </div>
      </div>
      <div className="request-actions d-flex justify-content-center">
          <button className="accept-btn">ACCEPT</button>
          <button className="reject-btn">REJECT</button>
        </div>
    </div>
  );
}

export default memo(RequestDetails);
