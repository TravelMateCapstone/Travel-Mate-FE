import React from 'react';
import '../../assets/css/Shared/NotifyItem.css';

function NotifyItem({ isRequest, avatar, content, name }) {
    return (
        <>
            {isRequest ? (
                <div className='d-flex align-items-start message-container'>
                    <img
                        src={avatar}
                        alt='avatar'
                        className='rounded-circle img-notify'
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div className='d-flex align-items-center'>
                        <div className='mess-inf'>
                            <p className='mb-0 text-wrap' style={{ fontSize: '12px' }}>
                                {name && <strong>{name} </strong>} {/* Display name if it exists */}
                                {content}
                            </p>
                            <div className='d-flex justify-content-center align-items-center gap-2'>
                                <button className='btn btn-outline-success btn-accept'>Chấp nhận</button>
                                <button className='btn btn-outline-danger btn-decline'>Từ chối</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='d-flex message-container'>
                    <img
                        src={avatar}
                        alt='avatar'
                        className='rounded-circle img-notify'
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div className='d-flex align-items-center'>
                        <div className='mess-inf'>
                            <p className='mb-0 text-wrap' style={{ fontSize: '12px' }}>
                                {name && <strong>{name} </strong>} {/* Display name if it exists */}
                                {content}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NotifyItem;