import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'

function DetailLayout({children}) {
  return (
    <Container fluid className='container-main '>
        <Row>
            <Col xs={12} className='p-0'><Navbar/></Col>
            <Col lg={3} className='p-0'>
                Sidebar
            </Col>
            <Col lg={9} className='p-0'>{children}</Col>
            <Col xs={12} className='p-0'><Footer/></Col>
        </Row>
    </Container>
  )
}

export default DetailLayout