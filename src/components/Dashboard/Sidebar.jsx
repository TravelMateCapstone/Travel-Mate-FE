import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = React.memo(({ items }) => {
  const location = useLocation();
  const renderedItems = React.useMemo(() => {
    return items.map((item, index) => (
      <li className="nav-item" key={index}>
        <Link className="nav-link d-flex align-items-center gap-2 mb-2 fw-bolder" to={item.route}>
          <ion-icon name={item.icon}></ion-icon>
          <span>{item.title}</span>
        </Link>
      </li>
    ));
  }, [items]);

  const sidebarClass = location.pathname.includes('admin') ? 'bg-gradient-primary' : 'bg-gradient-success';

  return (
    <ul className={`navbar-nav ${sidebarClass} sidebar sidebar-dark accordion`} id="accordionSidebar">
      <Link to="/" className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-text mx-3">{location.pathname.includes('admin') ? (
          <>Admin Dashboard</>
        ) : (
          <>User Dashboard</>
        )}</div>
      </Link>
      <hr className="sidebar-divider my-0" />
      {renderedItems}
      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  );
});

export default Sidebar;
