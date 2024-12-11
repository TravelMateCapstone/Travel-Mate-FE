import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import '../assets/css/Shared/Signature.css';

const Signature = () => {
    const [signatures, setSignatures] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [uploadedSignatureImage, setUploadedSignatureImage] = useState("");
    const [verificationResult, setVerificationResult] = useState("");
    const canvasRef = useRef(null);
    const nameInputRef = useRef(null);

    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        loadSignatures();
    }, []);

    const getContext = (canvas) => canvas.getContext("2d");

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = getContext(canvas);
        const offsetX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const offsetY = (e.clientY - rect.top) * (canvas.height / rect.height);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = getContext(canvas);
        const offsetX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const offsetY = (e.clientY - rect.top) * (canvas.height / rect.height);
        ctx.lineTo(offsetX, offsetY);
        ctx.strokeStyle = "#4a4a8f";
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = getContext(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setVerificationResult("");
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "signature.png";
        link.click();
    };

    const saveSignature = async () => {
        const canvas = canvasRef.current;
        const name = nameInputRef.current.value.trim();
        if (!name) {
            alert("Vui lòng nhập tên cho chữ ký.");
            return;
        }

        const imageDataURL = canvas.toDataURL("image/png");
        const encoder = new TextEncoder();
        const imageData = encoder.encode(imageDataURL);

        try {
            // Generate RSA Keypair
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-PSS",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["sign", "verify"]
            );

            const privateKey = keyPair.privateKey;
            const publicKey = keyPair.publicKey;

            // Create signature
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", imageData);
            const signature = await window.crypto.subtle.sign(
                {
                    name: "RSA-PSS",
                    saltLength: 32,
                },
                privateKey,
                hashBuffer
            );

            // Export public key
            const exportedPublicKey = await window.crypto.subtle.exportKey("jwk", publicKey);

            const signatureData = {
                name,
                image: imageDataURL,
                signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
                publicKey: exportedPublicKey,
            };

            // Send publicKey to API with Bearer Token
            console.log("public key", publicKey);
            const response = await fetch(
                "https://travelmateapp.azurewebsites.net/api/CCCD/add-publicKey",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ publicSignature: JSON.stringify(exportedPublicKey) }),
                }
            );

            if (!response.ok) {
                alert("Lỗi khi gửi publicKey tới API");
                return;
            }

            alert("Public key đã được gửi thành công!");

            // Update signatures
            const updatedSignatures = [...signatures];
            const existingIndex = updatedSignatures.findIndex((sig) => sig.name === name);

            if (existingIndex !== -1) {
                updatedSignatures[existingIndex] = signatureData;
            } else {
                updatedSignatures.push(signatureData);
            }

            setSignatures(updatedSignatures);
            localStorage.setItem("signatures", JSON.stringify(updatedSignatures));
            clearCanvas();
            nameInputRef.current.value = "";
        } catch (error) {
            console.error("Lỗi khi tạo chữ ký:", error);
            alert("Đã xảy ra lỗi trong quá trình tạo chữ ký.");
        }
    };

    const verifySignature = async () => {
        if (!uploadedSignatureImage) {
            alert("Vui lòng tải lên ảnh chữ ký.");
            return;
        }

        try {
            // Tách dữ liệu base64 của ảnh
            const base64Data = uploadedSignatureImage.split(",")[1];
            const binaryData = atob(base64Data);
            const uploadedImageData = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                uploadedImageData[i] = binaryData.charCodeAt(i);
            }

            // Tính hash SHA-256 của dữ liệu ảnh tải lên
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", uploadedImageData);

            let isValid = false;
            let matchedName = "";

            for (const sig of signatures) {
                try {
                    // Nhập khóa công khai
                    const publicKey = await window.crypto.subtle.importKey(
                        "jwk",
                        sig.publicKey,
                        {
                            name: "RSA-PSS",
                            hash: "SHA-256",
                        },
                        false,
                        ["verify"]
                    );

                    // Chuyển đổi chữ ký từ base64 thành Uint8Array
                    const signatureArray = new Uint8Array(
                        atob(sig.signature)
                            .split("")
                            .map((char) => char.charCodeAt(0))
                    );

                    // Xác thực chữ ký
                    const valid = await window.crypto.subtle.verify(
                        {
                            name: "RSA-PSS",
                            saltLength: 32,
                        },
                        publicKey,
                        signatureArray,
                        hashBuffer
                    );

                    if (valid) {
                        isValid = true;
                        matchedName = sig.name;
                        break;
                    }
                } catch (error) {
                    console.error("Lỗi xác thực:", error);
                }
            }

            if (isValid) {
                setVerificationResult(`Xác thực thành công! Chữ ký thuộc về: ${matchedName}`);
            } else {
                setVerificationResult("Xác thực thất bại! Chữ ký không hợp lệ.");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình xác thực:", error);
            setVerificationResult("Xác thực thất bại! Đã xảy ra lỗi trong quá trình xác thực.");
        }
    };


    const loadSignatures = () => {
        const storedSignatures = JSON.parse(localStorage.getItem("signatures")) || [];
        setSignatures(storedSignatures);
    };

    const deleteSignature = (index) => {
        const updatedSignatures = [...signatures];
        updatedSignatures.splice(index, 1);
        setSignatures(updatedSignatures);
        localStorage.setItem("signatures", JSON.stringify(updatedSignatures));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.onload = () => {
                    const canvas = canvasRef.current;
                    const ctx = getContext(canvas);

                    // Xóa canvas trước khi vẽ ảnh mới
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Vẽ ảnh lên canvas, tự động căn chỉnh kích thước
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                };
                image.src = e.target.result; // Đặt src cho ảnh để kích hoạt onload
                setUploadedSignatureImage(e.target.result); // Lưu chữ ký đã tải lên
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="signature-container">
            <h2>Quản Lý Chữ Ký Số với Canvas và RSA</h2>
            <canvas
                ref={canvasRef}
                width="500"
                height="250"
                className="signature-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
            ></canvas>
            <br />
            <input ref={nameInputRef} placeholder="Tên chữ ký" className="name-input" />
            <div className="actions">
                <button onClick={saveSignature}>Lưu Chữ Ký</button>
                <button onClick={clearCanvas}>Xóa Canvas</button>
                <button onClick={downloadCanvas}>Tải Xuống</button>
            </div>
            <div className="upload-section">
                <input type="file" onChange={handleFileUpload} />
                <button onClick={verifySignature}>Xác Thực Chữ Ký</button>
            </div>
            <div>
                <h3>Danh Sách Chữ Ký</h3>
                {signatures.map((signature, index) => (
                    <div key={index} className="signature-item">
                        <img src={signature.image} alt={signature.name} />
                        <p>{signature.name}</p>
                        <button onClick={() => deleteSignature(index)}>Xóa</button>
                    </div>
                ))}
            </div>
            {verificationResult && <p className="verification-result">{verificationResult}</p>}
        </div>
    );
};

export default Signature;
