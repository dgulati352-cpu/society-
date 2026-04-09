import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { Megaphone, Calendar, Clock } from 'lucide-react';

export default function Notices() {
  const notices = useLiveQuery(() => db.notices.orderBy('createdAt').reverse().toArray());
  const events = useLiveQuery(() => db.events.toArray());

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notices & Events</h1>
          <p className="page-subtitle">Stay updated with society happenings</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h2 className="section-title"><Megaphone size={20} /> Bulletin Board</h2>
          {notices?.length === 0 && <p className="item-desc">No notices found.</p>}
          {notices?.map(n => (
            <div key={n.id} className="list-item">
              <div className="item-title">{n.title}</div>
              <div className="item-desc">{n.description}</div>
              <div className="item-meta">
                <span className={`badge ${n.type === 'Important' ? 'badge-warning' : n.type === 'Finance' ? 'badge-success' : 'badge-info'}`}>
                  {n.type}
                </span>
                <span><Clock size={14} /> {new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card">
          <h2 className="section-title"><Calendar size={20} /> Upcoming Events</h2>
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
