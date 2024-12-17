import React from 'react'
import { useLocation } from 'react-router-dom'
import TimeLine from '../components/Contracts/TimeLine';
import { Button } from 'react-bootstrap';
import Navbar from '../components/Shared/Navbar';
import RoutePath from '../routes/RoutePath';
import contract_glass from '../assets/images/contact_glass.png'

function ContractLayout({ children }) {
    const location = useLocation();
    
    return (
        <div>
            <Navbar />
            <div className='container' style={{
                paddingTop: '130px',
                marginBottom: '50px'
            }}>{children}</div>
        </div>
    )
}

export default ContractLayout