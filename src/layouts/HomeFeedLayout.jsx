import React from 'react'
import Footer from '../components/Shared/Footer'
import Navbar from '../components/Shared/Navbar'

function HomeFeedLayout({ children }) {
    return (
        <>
            <Navbar />
            <div>{children}</div>
        </>
    )
}

export default HomeFeedLayout