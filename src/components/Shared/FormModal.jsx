import React, { useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import '../../assets/css/Shared/FormModal.css';

function FormModal({ show, handleClose, children, title, saveButtonText, handleSave, isSubmitting, isSubmitted }) {
  useEffect(() => {
    if (isSubmitted) {
      handleClose();
    }
  }, [isSubmitted, handleClose]);

  return (
    <Modal show={show} centered onHide={handleClose} dialogClassName='form_modal_custom'>
      <Modal.Body className="custom-modal-body" style={{ overflowY: 'auto' }}>
        <button type="button" className="close custom-close-button" aria-label="Close" onClick={handleClose}>
          <ion-icon name="close-outline"></ion-icon>
        </button>
        <h5 className="custom-modal-title">{title}</h5>
        <Form className='w-100'>
          <div className="form-modal-content">
            {children}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button variant='secondary' className="rounded-5" onClick={handleClose}>
          Close
        </Button>
        <Button variant='success' className="rounded-5" type="button" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? <><Spinner size='sm'/></> : saveButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FormModal;