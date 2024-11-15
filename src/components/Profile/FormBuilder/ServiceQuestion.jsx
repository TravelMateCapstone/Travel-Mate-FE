import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

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
    <Form style={{ width: '100%' }} className='mb-2'>
      <Row className="align-items-center">
        <Col xs={12} md={5}>
          <Form.Group controlId="serviceName">
            <Form.Control
              type="text"
              placeholder="Tên dịch vụ"
              value={serviceName}
              onChange={handleServiceNameChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={5}>
          <Form.Group controlId="amount">
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Số tiền"
                value={amount}
                onChange={handleAmountChange}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} md={2} className="d-flex justify-content-end">
          <Button variant="danger" onClick={() => onDelete(question.id)}>
            Xóa
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ServiceQuestion;