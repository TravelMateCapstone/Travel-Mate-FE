import React from 'react'
import Footer from '../components/Shared/Footer'
import Navbar from '../components/Shared/Navbar'
import { Container } from 'react-bootstrap'

function HomeFeedLayout({ children }) {
    return (
        <Container fluid className='container-main '>
            <Navbar />
            <div>{children}</div>
        </Container>
    )
}

export default HomeFeedLayout