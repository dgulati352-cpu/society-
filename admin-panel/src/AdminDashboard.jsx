import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { MessageSquareWarning, Megaphone, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const complaints = useLiveQuery(() => db.complaints.toArray());
  const notices = useLiveQuery(() => db.notices.orderBy('createdAt').reverse().limit(3).toArray());
  const events = useLiveQuery(() => db.events.limit(3).toArray());

  const activeComplaints = complaints?.filter(c => c.status !== 'Resolved').length || 0;
  const totalEvents = events?.length || 0;
  const recentNotices = notices?.length || 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of society operations and pending issues.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card stat-card" style={{ borderTop: '4px solid var(--warning)' }}>
          <div className="stat-header">
            Pending Complaints
            <div className="stat-icon"><MessageSquareWarning size={20} color="var(--warning)" /></div>
          </div>
          <div className="stat-value">{activeComplaints}</div>
        </div>
        <div className="glass-card stat-card" style={{ borderTop: '4px solid var(--accent)' }}>
          <div className="stat-header">
            Upcoming Events
            <div className="stat-icon"><Calendar size={20} color="var(--accent)" /></div>
          </div>
          <div className="stat-value">{totalEvents}</div>
        </div>
        <div className="glass-card stat-card" style={{ borderTop: '4px solid var(--danger)' }}>
          <div className="stat-header">
            Active Notices
            <div className="stat-icon"><Megaphone size={20} color="var(--danger)" /></div>
          </div>
          <div className="stat-value">{recentNotices}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h2 className="section-title">
            <Megaphone size={20} />
            Recent Notices
          </h2>
          {notices?.length === 0 && <p className="item-desc">No recent notices.</p>}
          {notices?.map(n => (
            <div key={n.id} className="list-item">
              <div className="item-title">{n.title}</div>
              <div className="item-desc">{n.description}</div>
              <div className="item-meta">
                <span className={`badge ${n.type === 'Important' ? 'badge-warning' : 'badge-info'}`}>{n.type}</span>
                <span><Clock size={14} /> {new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card">
          <h2 className="section-title">
            <Calendar size={20} />
            Upcoming Events
          </h2>
          {events?.length === 0 && <p className="item-desc">No upcoming events.</p>}
          {events?.map(e => (
            <div key={e.id} className="list-item">
              <div className="item-title">{e.title}</div>
              <div className="item-desc">{e.description}</div>
              <div className="item-meta">
                <span><Calendar size={14} /> {e.date}</span>
                <span><Clock size={14} /> {e.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
