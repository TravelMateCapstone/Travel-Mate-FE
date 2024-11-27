import React from 'react'
import Footer from '../components/Shared/Footer'
import Navbar from '../components/Shared/Navbar'
import { Container } from 'react-bootstrap'

function HomeFeedLayout({ children }) {
    return (
        <Container fluid className='container-main m-0 p-0'>
            <Navbar />
            <div>{children}</div>
            <Footer />
        </Container>
    )
}

export default HomeFeedLayout