// SaveSignature.js
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { generateKeys, encrypt } from "../../utils/implementRSA";

const SaveSignature = () => {
    const [signatures, setSignatures] = useState([]);
    const canvasRef = useRef(null);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const [isDrawing, setIsDrawing] = useState(false);
    const { publicKey } = generateKeys();

    const getContext = (canvas) => canvas.getContext("2d");

    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = getContext(canvas);
        const offsetX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const offsetY = (e.clientY - rect.top) * (canvas.height / rect.height);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
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

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = getContext(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            alert("Canvas not found.");
            return;
        }
    
        const name = user.username;
        if (!name) {
            alert("Please provide a name for the signature.");
            return;
        }
    
        try {
            const image = canvas.toDataURL("image/png");
    
            // Lưu ảnh gốc trước khi mã hóa
            const link = document.createElement("a");
            link.href = image;
            link.download = `${name}_signature.png`;
            link.click();
    
            // Tiếp tục mã hóa ảnh
            const encryptedImage = encrypt(image, publicKey).join(',');
            const signatureData = { name, image: encryptedImage };
            setSignatures([signatureData]);

            // Save encrypted image to localStorage
            localStorage.setItem('encryptedSignature', encryptedImage);
    
            clearCanvas();
            alert("Signature saved successfully!");
    
            // Gửi chữ ký đã mã hóa lên backend
            console.log(encryptedImage);
            
            await axios.put(
                "https://travelmateapp.azurewebsites.net/api/CCCD/add-publicKey",
                { publicSignature: encryptedImage },
                { headers: { Authorization: `${token}` } }
            );
        } catch (error) {
            console.error("Error saving signature:", error);
            alert("An error occurred while saving the signature.");
        }
    };
    
    const downloadSavedSignature = () => {
        if (signatures.length === 0) {
            alert("No saved signature to download.");
            return;
        }

        const link = document.createElement("a");
        link.href = signatures[0].image;
        link.download = "saved_signature.png";
        link.click();
    };

    return (
        <Container className="signature-container">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h2 className="text-center my-4">Create and Save Signature</h2>
                    <canvas
                        ref={canvasRef}
                        width="500"
                        height="250"
                        className="signature-canvas border"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    ></canvas>
                    <div className="actions text-center my-3">
                        <Button variant="primary" onClick={saveSignature} className="mx-2">Save Signature</Button>
                        <Button variant="secondary" onClick={clearCanvas} className="mx-2">Clear Canvas</Button>
                    </div>
                 
                </Col>
            </Row>
        </Container>
    );
};

export default SaveSignature;
