import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Megaphone, Calendar, Clock, Plus, X, Trash2 } from 'lucide-react';

export default function AdminNotices() {
  const notices = useLiveQuery(() => db.notices.orderBy('createdAt').reverse().toArray());
  const events = useLiveQuery(() => db.events.toArray());

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [noticeForm, setNoticeForm] = useState({ title: '', description: '', type: 'Announcement' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '' });

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    await db.notices.add({ ...noticeForm, createdAt: Date.now() });
    setNoticeForm({ title: '', description: '', type: 'Announcement' });
    setIsNoticeModalOpen(false);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    await db.events.add({ ...eventForm });
    setEventForm({ title: '', description: '', date: '', time: '' });
    setIsEventModalOpen(false);
  };

  const deleteNotice = async (id) => { await db.notices.delete(id); };
  const deleteEvent = async (id) => { await db.events.delete(id); };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Notices & Events</h1>
          <p className="page-subtitle">Publish critical announcements to residents.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setIsEventModalOpen(true)}>
            <Plus size={18} /> Add Event
          </button>
          <button className="btn btn-primary" onClick={() => setIsNoticeModalOpen(true)}>
            <Plus size={18} /> Publish Notice
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h2 className="section-title"><Megaphone size={20} /> Bulletin Board</h2>
          {notices?.length === 0 && <p className="item-desc">No notices found.</p>}
          {notices?.map(n => (
            <div key={n.id} className="list-item" style={{ position: 'relative' }}>
              <button
                onClick={() => deleteNotice(n.id)}
                style={{ position: 'absolute', right: 0, top: '1rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
              <div className="item-title" style={{ paddingRight: '2rem' }}>{n.title}</div>
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
            <div key={e.id} className="list-item" style={{ position: 'relative' }}>
              <button
                onClick={() => deleteEvent(e.id)}
                style={{ position: 'absolute', right: 0, top: '1rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
              <div className="item-title" style={{ paddingRight: '2rem' }}>{e.title}</div>
              <div className="item-desc">{e.description}</div>
              <div className="item-meta">
                <span><Calendar size={14} /> {e.date}</span>
                <span><Clock size={14} /> {e.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isNoticeModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNoticeModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post Notice</h3>
              <button className="icon-btn" onClick={() => setIsNoticeModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleNoticeSubmit} className="form-group">
              <label>Notice Title</label>
              <input required value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} />

              <label>Type</label>
              <select value={noticeForm.type} onChange={e => setNoticeForm({ ...noticeForm, type: e.target.value })}>
                <option>Announcement</option>
                <option>Important</option>
                <option>Finance</option>
                <option>Maintenance</option>
              </select>

              <label>Description</label>
              <textarea required value={noticeForm.description} onChange={e => setNoticeForm({ ...noticeForm, description: e.target.value })} rows="4" />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEventModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEventModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Event</h3>
              <button className="icon-btn" onClick={() => setIsEventModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEventSubmit} className="form-group">
              <label>Event Name</label>
              <input required value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Date</label>
                  <input type="date" required value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                </div>
                <div>
                  <label>Time</label>
                  <input type="time" required value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} />
                </div>
              </div>

              <label>Details</label>
              <textarea required value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} rows="3" />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Schedule Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
