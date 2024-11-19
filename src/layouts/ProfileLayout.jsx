import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Navbar from '../components/Shared/Navbar'
import ProfileCard from '../components/Profile/ProfileCard'

function ProfileLayout({ children }) {
  return (
    <Container fluid className='container-main'>
      <Row><Navbar /></Row>
      <div className='mt-5' style={{
        padding: '0 180px'
      }}>
        <Row>
          <Col md={3}>
            <ProfileCard />
          </Col>
          <Col md={9} className='mt-2'>
            {children}
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default ProfileLayout