import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

function ProvinceSelector({ onSelect }) {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/')
      .then(response => response.json())
      .then(data => setProvinces(data.map(province => ({
        ...province,
        name: province.name.replace(/Tỉnh|Thành phố/g, '').trim()
      })))) 
      .catch(error => console.error('Error fetching provinces:', error));
  }, []);

  return (
    <Form.Group controlId="provinceSelector" className='select_location_component'>
      <Form.Label>Địa điểm</Form.Label>
      <Form.Control as="select" onChange={(e) => onSelect(e.target.value)}>
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