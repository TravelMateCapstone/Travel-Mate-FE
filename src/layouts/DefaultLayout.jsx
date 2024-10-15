import React from 'react'

function DefaultLayout({ children }) {
    return (
        <>
            <Navbar />
            <div>{children}</div>
            <Footer />
        </>
    )
}

export default DefaultLayout