import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';

function TextInputQuestion({ question, onUpdate, onDelete }) {
  const [text, setText] = useState(question.text || '');
  useEffect(() => {
    onUpdate({ ...question, text });
  }, [text]);
  return (
    <Form style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '20px', position: 'relative', width: '100%' }}>
      <FormGroup>
        <div style={{ color: 'green' }} className='mb-1 d-flex justify-content-between align-items-center'>
          <h6 className='m-0'>Câu hỏi văn bản</h6>
          <Button variant='' className='p-1 d-flex justify-content-center align-items-center' onClick={() => onDelete(question.id)}>
            <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
          </Button>
        </div>
        <FormControl type="text" placeholder='Nhập câu hỏi..?' value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%' }} />
      </FormGroup>
    </Form>
  );
}
export default TextInputQuestion;
