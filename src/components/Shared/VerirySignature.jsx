// VerifySignature.js
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const VerifySignature = () => {
    const [uploadedSignatureImage, setUploadedSignatureImage] = useState("");
    const [verificationResult, setVerificationResult] = useState("");
    const [buttonVariant, setButtonVariant] = useState("outline-danger");
    const [buttonText, setButtonText] = useState("Tải lên chữ ký");
    const signatures = JSON.parse(localStorage.getItem("signatures")) || [];

    const handleFileUploadAndVerify = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedSignatureImage(e.target.result);
                const matchedSignature = signatures.find(
                    (sig) => sig.image === e.target.result
                );

                if (matchedSignature) {
                    setVerificationResult(`Chữ ký đã được xác minh! Thuộc về: ${matchedSignature.name}`);
                    toast.success(`Chữ ký đã được xác minh! Thuộc về: ${matchedSignature.name}`);
                    setButtonVariant("success");
                    setButtonText("Đã ký");
                } else {
                    setVerificationResult("Xác minh chữ ký thất bại! Chữ ký không hợp lệ.");
                    toast.error("Xác minh chữ ký thất bại! Chữ ký không hợp lệ.");
                    setButtonVariant("outline-danger");
                    setButtonText("Tải lên chữ ký");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        document.getElementById("fileInput").click();
    };

    return (
        <div className="verification-container">
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileUploadAndVerify}
            />
            <Button variant={buttonVariant} onClick={handleButtonClick}>{buttonText}</Button>
          
        </div>
    );
};

export default VerifySignature;