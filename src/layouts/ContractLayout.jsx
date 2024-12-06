import React from 'react'
import { useLocation } from 'react-router-dom'
import TimeLine from '../components/Contracts/TimeLine';
import { Button } from 'react-bootstrap';
import Navbar from '../components/Shared/Navbar';
import RoutePath from '../routes/RoutePath';
import contract_glass from '../assets/images/contact_glass.png'

function ContractLayout({ children }) {
    const location = useLocation();

    let rightContent;
    if (location.pathname === RoutePath.CONTRACT) {
        rightContent = <img src={contract_glass} alt="Contract glass" />;
    } else if (location.pathname === RoutePath.CREATE_CONTRACT) {
        rightContent = (
            <Button
                style={{ height: '44px' }}
                className='rounded-5 d-flex justify-content-center align-items-center gap-2 fw-medium'
                variant='outline-danger'
            >
                Hủy hợp đồng
                <ion-icon name="close-outline" style={{ fontSize: '20px' }}></ion-icon>
            </Button>
        );
    } else if (location.pathname === RoutePath.ONGOING_CONTRACT) {
        rightContent = <></>
    } else if (location.pathname === RoutePath.PAYMENT_FAILED_CONTRACT) {
        rightContent = <></>
    }
    else {
        rightContent = <img src={contract_glass} alt='icon search' />
    }
    let timeLineStep;
    if (location.pathname === RoutePath.CONTRACT) {
        timeLineStep = <></>
    } else if (location.pathname === RoutePath.CREATE_CONTRACT) {
        timeLineStep = <TimeLine activeStep={1} />
    } else if (location.pathname === RoutePath.PAYMENT_CONTRACT) {
        timeLineStep = <TimeLine activeStep={2} />
    } else if (location.pathname === RoutePath.ONGOING_CONTRACT) {
        timeLineStep = <TimeLine activeStep={3} />
    }

    return (
        <div>
            <Navbar />
            {location.pathname !== RoutePath.DONE_CONTRACT && (
                <div className='header_payment'>
                    <div className='container d-flex justify-content-between' style={{
                        paddingTop: '100px',
                    }}>
                        <div>
                            <div className='d-flex gap-2'>
                                <ion-icon name="document-outline" style={{
                                    fontSize: '50px',
                                }}></ion-icon>
                                <p style={{
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                }}>Hợp đồng</p>
                            </div>
                            {/* <p>Hiện tại không có hợp đồng nào được tạo cho chuyến đi.  Hãy tìm và kết nối với người bạn thích hợp để trải nghiệm</p> */}
                        </div>
                        {rightContent}
                    </div>
                </div>
            )}
            <div className=''>
                {timeLineStep}
            </div>
            <div className='container' style={{
                paddingTop: '130px',
            }}>{children}</div>
        </div>
    )
}

export default ContractLayout