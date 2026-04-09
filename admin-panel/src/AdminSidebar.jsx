import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { LayoutDashboard, Megaphone, MessageSquareWarning, BookOpen, Building2, LogOut, Settings, Users, PhoneCall, Wallet, Calendar } from 'lucide-react';
import { useAdmin } from './AdminApp';

export default function AdminSidebar() {
  const { handleLogout } = useAdmin();

  const pendingComplaints = useLiveQuery(() => 
    db.complaints.where('status').anyOf(['Pending', 'In Progress', 'Maintenance']).count()
  );

  const pendingEvents = useLiveQuery(() => 
    db.eventRequests.where('status').equals('Pending').count()
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ color: 'var(--warning)' }}>
        <Building2 size={28} color="var(--warning)" />
        Admin Portal
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/notices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Megaphone size={20} />
          Manage Notices
        </NavLink>
        <NavLink to="/complaints" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
          <MessageSquareWarning size={20} />
          All Complaints
          {pendingComplaints > 0 && <span className="nav-badge">{pendingComplaints}</span>}
        </NavLink>
        <NavLink to="/rules" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          Manage Rules
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
          <Calendar size={20} />
          Event Requests
          {pendingEvents > 0 && <span className="nav-badge">{pendingEvents}</span>}
        </NavLink>
        <NavLink to="/maintenance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Wallet size={20} />
          Broadcast Dues
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          Resident Directory
        </NavLink>
        <NavLink to="/emergency" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PhoneCall size={20} />
          Emergency Config
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          Society Settings
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          className="btn"
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          Sign Out Admin
        </button>
      </div>

      <style>{`
        .nav-badge {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--danger);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 20px;
          min-width: 18px;
          text-align: center;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </aside>
  );
}
