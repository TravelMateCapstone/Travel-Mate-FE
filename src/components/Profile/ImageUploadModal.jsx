// src/ImageUploadModal.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "../../assets/css/Profile/ImageUploadModal.css"; // Sử dụng lại style từ trước

const ImageUploadModal = ({ isOpen, onClose, onDone }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleDone = () => {
    if (file || url) {
      onDone({ file, url });
      onClose();
    } else {
      alert("Please select a file or enter a URL.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>Upload Image</h2>

        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {file ? (
            <p>Selected file: {file.name}</p>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>

        <div className="input-group">
          <label>Or enter image URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="modal-actions">
          <button className="" onClick={onClose}>
            Cancel
          </button>
          <button className="" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
