import React, { useState } from 'react';
import UserCard from '../../components/Search/UserCard';

function SearchListTraveller() {

  const [id, setId] = useState(1); // ID là số hoặc chuỗi
  const [img, setImg] = useState('https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg'); // Đường dẫn URL hình ảnh
  const [name, setName] = useState('User Name'); // Tên người dùng
  const [address, setAddress] = useState('Quảng Nam, Việt Nam');
  const [numberOfConnect, setNumberOfConnect] = useState(10); // Số lượng kết nối
  const [descriptions, setDescriptions] = useState('This is a sample description.'); // Mô tả
  return (
    <div>
      <h2>SearchListTraveller</h2>
      {/* Truyền các state xuống UserCard qua props */}
      <UserCard
        id={id}
        img={img}
        name={name}
        address={address}
        numberOfConnect={numberOfConnect}
        descriptions={descriptions}
      />
    </div>

  )
}

export default SearchListTraveller