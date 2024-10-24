import React from 'react'
import Navbar from '../components/Shared/Navbar'
import { Container } from 'react-bootstrap'

function NavBarLayout({ children }) {
  return (
    <Container fluid className='container-main '>
      <Navbar />
      {children}
    </Container>
  )
}

export default NavBarLayout