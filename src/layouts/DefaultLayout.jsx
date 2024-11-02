import React from 'react'
import { Container } from 'react-bootstrap'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'

function DefaultLayout({ children }) {
    return (
        <Container fluid className='container-main '>
            <Navbar/>
            <div>{children}</div>
            <Footer/>

        </Container>
    )
}

export default DefaultLayout