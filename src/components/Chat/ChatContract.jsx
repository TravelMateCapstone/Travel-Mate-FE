import React, { memo } from 'react'
import { Col, Button } from 'react-bootstrap'
import createContractLogo from '../../assets/images/createContractLogo.png'
import { useNavigate } from 'react-router-dom'
import RoutePath from '../../routes/RoutePath'
const ChatContract = () => {
  const navigate = useNavigate()
  return (
    <Col lg={2}>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h5>Hợp đồng</h5>
        <img src={createContractLogo} alt="" width={180} />
        <strong>Chưa có hợp đồng nào</strong>
        <small>Hãy tạo hợp đồng để bắt đầu chuyến đi</small>
        <Button variant='success' className='rounded-5' onClick={() => navigate(RoutePath.CREATE_CONTRACT)}>Tạo hợp đồng</Button>
      </div>
    </Col>
  )
}

export default memo(ChatContract)