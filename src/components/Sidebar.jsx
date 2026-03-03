import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ navigation, open, setOpen, news }) => {
  const unreadCount = news.filter((_, i) => i < 3).length;

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📰</span>
          {open && <span className="logo-text">Historica</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
            end={item.href === '/'}
          >
            <item.icon className="nav-icon" />
            {open && (
              <>
                <span className="nav-label">{item.name}</span>
                {item.name === 'News Feed' && unreadCount > 0 && (
                  <span className="nav-badge">{unreadCount}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {open && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <span className="user-name">Analyst</span>
              <span className="user-role">Premium Access</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;