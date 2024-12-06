import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerirySignature({ publickey }) {
    const [uploadedSignatureImage, setUploadedSignatureImage] = useState("");
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedSignatureImage(e.target.result);
                verifySignature(e.target.result); 
            };
            reader.readAsDataURL(file);
        }
        toast.success("Xác thực chữ kí thành công");
    };

    const verifySignature = async (imageData) => {
        const signatureImage = imageData || uploadedSignatureImage;
        if (!signatureImage) {
            toast.error("Vui lòng tải lên ảnh chữ ký.");
            return;
        }

        const base64Data = signatureImage.split(",")[1];
        const binaryData = atob(base64Data);
        const uploadedImageData = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            uploadedImageData[i] = binaryData.charCodeAt(i);
        }

        const hashBuffer = await window.crypto.subtle.digest("SHA-256", uploadedImageData);

        const publicKey = await window.crypto.subtle.importKey(
            "jwk",
            publickey,
            {
                name: "RSA-PSS",
                hash: "SHA-256",
            },
            false,
            ["verify"]
        );

        const signatureArray = new Uint8Array(
            atob(publickey.signature)
                .split("")
                .map((char) => char.charCodeAt(0))
        );

        const valid = await window.crypto.subtle.verify(
            {
                name: "RSA-PSS",
                saltLength: 32,
            },
            publicKey,
            signatureArray,
            hashBuffer
        );

        if (!valid) {
            toast.success("Xác thực thành công! Chữ ký hợp lệ.");
        setVerificationSuccess(true);
        }
    };

    return (
        <div>
            <Button 
                variant={verificationSuccess ? 'success' : 'outline-dark'} 
                onClick={() => document.getElementById('upload_file_contract_signature').click()}
            >
                {verificationSuccess ? 'Xác nhận chữ kí thành công' : 'Xác thực chữ kí'}
            </Button>
            <input type="file" className='d-none' id='upload_file_contract_signature' onChange={handleFileUpload} />
        </div>
    );
}

export default VerirySignature;