import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

function ProvinceSelector({ onSelect, initialValue }) {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(initialValue || '');

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/')
      .then(response => response.json())
      .then(data => setProvinces(data.map(province => ({
        ...province,
        name: province.name.replace(/Tỉnh|Thành phố/g, '').trim()
      })))) 
      .catch(error => console.error('Error fetching provinces:', error));
  }, []);

  useEffect(() => {
    setSelectedProvince(initialValue || '');
  }, [initialValue]);

  const handleChange = (e) => {
    setSelectedProvince(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <Form.Group controlId="provinceSelector" className='select_location_component'>
      <Form.Label>Địa điểm</Form.Label>
      <Form.Control as="select" value={selectedProvince} onChange={handleChange}>
        <option value="">Chọn tỉnh/thành phố</option>
        {provinces.map(province => (
          <option key={province.code} value={province.name}>
            {province.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

export default ProvinceSelector;