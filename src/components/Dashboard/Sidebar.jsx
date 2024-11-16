import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = React.memo(({ items }) => {
  const renderedItems = React.useMemo(() => {
    return items.map((item, index) => (
      <li className="nav-item" key={index}>
        <Link className="nav-link d-flex align-items-center gap-1" to={item.route}>
          <ion-icon name={item.icon}></ion-icon>
          <span>{item.title}</span>
        </Link>
      </li>
    ));
  }, [items]);

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link to="/" className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink" />
        </div>
        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
      </Link>
      <hr className="sidebar-divider my-0" />
      {renderedItems}
      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  );
});

export default Sidebar;
