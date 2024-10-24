import React from 'react'
import '../../assets/css/Shared/MessengerItem.css'

function MessengerItem({ avatar, name, message, time }) {
    return (
        <div className='d-flex message-container'>
            <img src={avatar} alt
                ='avatar' className='rounded-circle img-notify' style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
            <div className=' d-flex align-items-center'>
                <div className='mess-inf'>
                    <p className='mb-0 text-wrap' style={{
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>{name}</p>
                    <p className='mb-0 text-nowrap' style={{
                        fontSize: '12px',
                        fontWeight: '400'
                    }}>{message}</p>
                </div>
                <p className='mb-0 text-nowrap' style={{
                    fontSize: '12px',
                    fontWeight: '500',
                }}>{time}</p>
            </div>
        </div>

    )
}

export default MessengerItem