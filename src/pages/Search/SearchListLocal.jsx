import React, { useState } from 'react';
import UserCard from '../../components/Search/UserCard';

function SearchListLocal() {
  const [id, setId] = useState(27);
  const [img, setImg] = useState('https://tiki.vn/blog/wp-content/uploads/2023/10/lf3fjFd24AXYeYu6KfWwVgh-xVek2LdWY_xA3X6vL-E6-ZpqB9_X6PVpxt0l_chpvl4gD3aU1S1yt1EoBJnPovFRQ_yHSYUDDuKLQdELwdV09iuPbuBbdFzIV-8jhO_XiUm-SHtwRgTTaqUO-Zope1Y.png'); // Đường dẫn URL hình ảnh
  const [name, setName] = useState('Trần Đăng Lên');
  const [address, setAddress] = useState('Quảng Nam, Việt Nam');
  const [numberOfConnect, setNumberOfConnect] = useState("10 Kết nối");
  const [descriptions, setDescriptions] = useState('Lên mô tả');

  return (
    <div>
      <h2>Search List Local</h2>
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
  );
}

export default SearchListLocal;
