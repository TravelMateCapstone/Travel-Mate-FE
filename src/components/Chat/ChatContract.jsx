import React, { memo } from 'react'
import { Col, Button } from 'react-bootstrap'
import createContractLogo from '../../assets/images/createContractLogo.png'

const ChatContract = () => {
  return (
    <Col lg={2}>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h5>Hợp đồng</h5>
        <img src={createContractLogo} alt="" width={180} />
        <strong>Chưa có hợp đồng nào</strong>
        <small>Hãy tạo hợp đồng để bắt đầu chuyến đi</small>
        <Button variant='success' className='rounded-5'>Tạo hợp đồng</Button>
      </div>
    </Col>
  )
}

export default memo(ChatContract)