import React from 'react'
import { Container } from 'react-bootstrap'

function DefaultLayout({ children }) {
    return (
        <Container fluid className='container-main '>
            <Navbar />
            <div>{children}</div>
            <Footer />
        </Container>
    )
}

export default DefaultLayout