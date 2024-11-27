import React from 'react'
import { Button, Col } from 'react-bootstrap'

function DestinationCard() {
    return (
        <Col lg={3} className='mb-4'>
            <div className='p-3 d-flex border-1 rounded-4 gap-3 justify-content-between'>
                <div className='d-flex gap-3'>
                    <img className='rounded-circle object-fit-cover' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRiWF6CBGjG8QKH94YY1heXH3X-XrzTUEqohZZDJdHP0xhZOwdcRt8b2zu4HLyPH-Pk00HuYMk589GqzYQzx6OkCA" alt="" height={100} width={100} />
                    <div className='d-flex flex-column justify-content-center gap-3'>
                        <label className='fw-semibold m-0'>Hà Nội</label>
                        <small className='m-0 text-muted'><ion-icon name="flag"></ion-icon> 35 tours</small>
                    </div>
                </div>
                <div className='d-flex align-items-end'>
                    <Button variant='outline-dark' className='rounded-circle p-0 m-0 justify-content-center d-flex align-items-center' style={{
                        width: '30px',
                        height: '30px',
                    }}><ion-icon name="chevron-forward-outline"></ion-icon></Button>
                </div>
            </div>
        </Col>
    )
}

export default DestinationCard