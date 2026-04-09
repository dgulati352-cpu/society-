import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, MessageSquareWarning, BookOpen, Building2, LogOut, PhoneCall, Wallet, Calendar } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Building2 size={28} color="var(--accent)" />
        Society Hub
      </div>
      
      <nav className="nav-links">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/notices" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Megaphone size={20} />
          Notices & Events
        </NavLink>
        <NavLink to="/complaints" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <MessageSquareWarning size={20} />
          Complaints
        </NavLink>
        <NavLink to="/rules" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          Rule Book
        </NavLink>
        <NavLink to="/events" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          Event Requests
        </NavLink>
        <NavLink to="/maintenance" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Wallet size={20} />
          Maintenance
        </NavLink>
        <NavLink to="/emergency" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <PhoneCall size={20} />
          Emergency
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          className="btn" 
          onClick={onLogout}
          style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
