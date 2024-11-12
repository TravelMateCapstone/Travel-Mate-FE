import React from 'react'
import Navbar from '../components/Shared/Navbar'
import { Container } from 'react-bootstrap'

function NavBarLayout({ children }) {
  return (
    <Container fluid className='container-main '>
      <Navbar />
      <div className='mt-5'>{children}</div>
    </Container>
  )
}

export default NavBarLayout