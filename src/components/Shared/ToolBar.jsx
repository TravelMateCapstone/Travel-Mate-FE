import React from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../../assets/css/Shared/ToolBar.css';

function ToolBar() {
    const renderTooltip = (props, text) => (
        <Tooltip id="button-tooltip" {...props}>
            {text}
        </Tooltip>
    );

    return (
        <div className="toolbar shadow rounded-5 d-flex justify-content-around align-items-center" style={{ padding: '10px' }}>
            <OverlayTrigger placement="top" overlay={renderTooltip(null, 'Tạo nhóm')}>
                <Link to="/add" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <ion-icon name="add-circle"></ion-icon>
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={renderTooltip(null, 'Quản lí nhóm')}>
                <Link to="/people" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <ion-icon name="people"></ion-icon>
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={renderTooltip(null, 'Lên lịch')}>
                <Link to="/calendar" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <ion-icon name="calendar"></ion-icon>
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={renderTooltip(null, 'Chuyến đi')}>
                <Link to="/car" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <ion-icon name="car"></ion-icon>
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={renderTooltip(null, 'Ví của bạn')}>
                <Link to="/wallet" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <ion-icon name="wallet"></ion-icon>
                </Link>
            </OverlayTrigger>
        </div>
    );
}

export default ToolBar;
