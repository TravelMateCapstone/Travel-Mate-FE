import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import '../../assets/css/Shared/ImageSelector.css';

function ImageSelector({ multiple = false, onSelect }) {
  const [selectedFileName, setSelectedFileName] = useState('Chưa có ảnh nào được chọn');

  const handleClick = () => {
    document.getElementById('upload-image').click();
  };

  const handleChange = (event) => {
    const files = event.target.files;
    const fileName = multiple ? `${files.length} ảnh đã được chọn` : files[0].name;
    setSelectedFileName(fileName);
    onSelect(multiple ? Array.from(files) : files[0]);
  };

  return (
    <Form.Group>

      <div className='d-flex w-100 image-selector' onClick={handleClick}>
        <Button variant='outline-dark' className='rounded-0 rounded-start-5 text-nowrap btn-sm'>
          <small>Chọn ảnh</small>
        </Button>
        <div className='border-1 border-start-0 rounded-end-5 w-100 d-flex align-items-center ps-2 text-muted'>
          <small className='m-0 p-0'>{selectedFileName}</small>
        </div>
      </div>
      <Form.Control className='d-none' type="file" id='upload-image' multiple={multiple} onChange={handleChange} />
    </Form.Group>
  );
}

export default ImageSelector;