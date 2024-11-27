import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Image } from 'react-bootstrap'
import { storage } from '../../../firebaseConfig'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

function UploadImageComponent({ onUpload, multiple = true }) {
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleFileButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress,
          }));
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadedUrls((prevUrls) => [...prevUrls, downloadURL]);
            console.log('File available at', downloadURL);
          });
        }
      );
    });

    handleClose();
  };

  useEffect(() => {
    if (uploadedUrls.length > 0) {
      onUpload(uploadedUrls);
    }
  }, [uploadedUrls, onUpload]);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Upload Image
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className='overflow-auto'>
          <Form>
            <Form.Group className='d-flex flex-column'>
              <Button variant="secondary" onClick={handleFileButtonClick} className='d-flex align-items-center gap-2 justify-content-center'>
                Chọn ảnh <ion-icon name="images-outline"></ion-icon>
              </Button>
              <Form.Control
                type="file"
                id="fileInput"
                multiple={multiple}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Form.Group>
            {files.length > 0 && (
              <div className="mt-3">
                {files.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} thumbnail className="w-100 mb-2" />
                ))}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UploadImageComponent