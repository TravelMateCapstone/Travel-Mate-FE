import React from "react";
import { Modal, Button } from "react-bootstrap";
import '../../assets/css/Shared/ConfirmModal.css';

const ConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal_deletPostGroup">
            <Modal.Body className="custom-modal-body">
                <div>
                    <ion-icon name="warning-outline" className="icon-large text-danger"></ion-icon>
                </div>
                <p className='mb-0 fw-medium text-black'>{title}</p>
                <p className='m-0 text-muted small'>{message}</p>
            </Modal.Body>
            <Modal.Footer className='d-flex gap-3 justify-content-center'>
                <Button variant="" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="" onClick={onConfirm} className='rounded-5 btn-danger text-white'>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
