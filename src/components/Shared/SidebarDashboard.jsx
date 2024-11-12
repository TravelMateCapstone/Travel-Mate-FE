import React from 'react';

function SidebarDashboard() {
    return (
        <ul className="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div className="sidebar-brand-icon">
                    <img src="img/logo/logo2.png" alt="Logo" />
                </div>
                <div className="sidebar-brand-text mx-3">RuangAdmin</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <li className="nav-item active">
                <a className="nav-link" href="index.html">
                    <i className="fas fa-fw fa-tachometer-alt" />
                    <span>Dashboard</span>
                </a>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Features</div>
            <li className="nav-item">
                <a className="nav-link collapsed" data-toggle="collapse" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                    <i className="far fa-fw fa-window-maximize" />
                    <span>Bootstrap UI</span>
                </a>
                <div id="collapseBootstrap" className="collapse" aria-labelledby="headingBootstrap" data-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <h6 className="collapse-header">Bootstrap UI</h6>
                        <a className="collapse-item" href="alerts.html">Alerts</a>
                        <a className="collapse-item" href="buttons.html">Buttons</a>
                        <a className="collapse-item" href="dropdowns.html">Dropdowns</a>
                        <a className="collapse-item" href="modals.html">Modals</a>
                        <a className="collapse-item" href="popovers.html">Popovers</a>
                        <a className="collapse-item" href="progress-bar.html">Progress Bars</a>
                    </div>
                </div>
            </li>
            {/* Các phần tử khác của sidebar... */}
        </ul>
    );
}

export default SidebarDashboard;
