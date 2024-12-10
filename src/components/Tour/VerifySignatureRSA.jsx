import React, { useState } from 'react';
import { generateKeys, encrypt } from '../../utils/implementRSA';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { saveSignature } from '../../redux/actions/signatureAction';

function VerifySignatureRSA() {
    const [image, setImage] = useState(null);
    const [encryptedImage, setEncryptedImage] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const { publicKey } = generateKeys();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [responeSignature, setResponeSignature] = useState(null);
    const [isValidSignature, setIsValidSignature] = useState(false);
    const dispatch = useDispatch();

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            setImage(reader.result);
            const encrypted = encrypt(reader.result, publicKey);
            setEncryptedImage(encrypted);
            
            try {
                const response = await axios.post('https://travelmateapp.azurewebsites.net/api/CCCD/verify-signature', {
                    userId: user.id,
                    publicKey: encrypted.join(','),
                }, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setResponeSignature(response.data);
                if (response.data.success) {
                    dispatch(saveSignature(encrypted.join(',')));
                    toast.success('Chữ kí hợp lệ');
                    setVerificationResult('Chữ kí hợp lệ');
                    setIsValidSignature(true);
                }
            } catch (error) {
                console.error('Error:', error);
                if(error.response.status === 400) {
                    toast.error('Chữ kí không hợp lệ');
                    setVerificationResult('Chữ kí không hợp lệ');
                    setIsValidSignature(false);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <input type="file" id='signature_upload' accept="image/*" onChange={handleImageUpload} className='d-none' />
            {/* {image && <img src={image} alt="Uploaded" width={30} height={30}/>} */}
            {/* {verificationResult && <div>{verificationResult}</div>} */}
            <Button 
                variant={isValidSignature ? 'success' : 'outline-danger'} 
                onClick={() => document.getElementById('signature_upload').click()}
            >
                {isValidSignature ? 'Đã kí' : 'Vui lòng tải chữ kí'}
            </Button>
        </div>
    );
}

export default VerifySignatureRSA;