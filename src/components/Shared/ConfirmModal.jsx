import React from "react";
import { Modal, Button } from "react-bootstrap";
import '../../assets/css/Shared/ConfirmModal.css';

const ConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="confirm-modal">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="success" onClick={onConfirm}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
