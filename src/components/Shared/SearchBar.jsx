import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import '../../assets/css/Shared/SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <InputGroup className="rounded-5" style={{ height: '38px' }}>
        <InputGroup.Text className='rounded-start-5' style={{ border: '1px solid #ccc', backgroundColor: 'transparent' }}>
          <ion-icon name="search" style={{ marginRight: '0px', padding: '0px' }}></ion-icon>
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Nhập từ khóa..."
          className='border-start-0 rounded-end-5 fw-medium'
          style={{ border: '1px solid #ccc', outline: 'none', fontSize: '12px' }}
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </InputGroup>
      {searchTerm && (
        <span 
          onClick={handleClear} 
          style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            cursor: 'pointer', 
            color: '#ccc' 
          }}
        >
          <ion-icon name="close"></ion-icon>
        </span>
      )}
    </div>
  );
}

export default SearchBar;
