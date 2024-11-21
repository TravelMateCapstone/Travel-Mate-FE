import React, { memo } from 'react';
import '../../assets/css/Chat/RequestDetails.css';
import ViewFormRequest from '../Profile/FormBuilder/ViewFormRequest';

function RequestDetails({ request }) {
  return (
    <div className='overflow-y-auto d-flex'>
      <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg" alt="" width={60} height={60} className="object-fit-cover rounded-circle" />
      <RequestDetails/>
    </div>
  );
}

export default memo(RequestDetails);
