import React from 'react'
import axios from 'axios';

function Setting() {
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('https://api.fpt.ai/vision/idr/vnm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-key': '8JIYV5d32XHGakgucP899sGDv0QBej5R' // Replace with your actual API key
        }
      });
      console.log(response.data.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <div>
      <h1>Setting</h1>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default Setting