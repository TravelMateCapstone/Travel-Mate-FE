import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

function ServiceQuestion({ question, onUpdate, onAddService, onDelete }) {
  const [serviceName, setServiceName] = useState(question.serviceName || '');
  const [amount, setAmount] = useState(question.amount || '');

  const handleServiceNameChange = (e) => {
    setServiceName(e.target.value);
    onUpdate({ ...question, serviceName: e.target.value });
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    onUpdate({ ...question, amount: e.target.value });
  };

  return (
    <div style={{ width: '100%' }} className='mb-2 p-0'>
      <div className="w-100 d-flex align-items-center gap-2">
        <Form.Group controlId="serviceName" className='w-100'>
          <Form.Control type="text" placeholder="Tên dịch vụ" value={serviceName} onChange={handleServiceNameChange} style={{ height: '47px' }} />
        </Form.Group>
        <Form.Group controlId="amount">
          <InputGroup>
            <Form.Control type="number" placeholder="Số tiền" value={amount} onChange={handleAmountChange} style={{ height: '47px' }} />
          </InputGroup>
        </Form.Group>
        <Button style={{ height: '100%' }} variant="" className='rounded-5 d-flex justify-content-center align-items-center' onClick={() => onDelete(question.id)}>
          <ion-icon name="close-circle-outline" style={{ fontSize: '24px' }}></ion-icon>
        </Button>
      </div>
    </div>
  );
}

export default ServiceQuestion;