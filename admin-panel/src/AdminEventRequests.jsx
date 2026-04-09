import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function AdminEventRequests() {
  const requests = useLiveQuery(() => db.eventRequests.orderBy('createdAt').reverse().toArray());

  const respondToRequest = async (id, status) => {
    await db.eventRequests.update(id, { status });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Review Event Requests</h1>
          <p className="page-subtitle">Approve or deny member requests to host private events.</p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Calendar size={20} /> Pending Requests</h2>
        {requests?.filter(r => r.status === 'Pending').length === 0 && <p className="item-desc">No pending requests right now.</p>}
        
        {requests?.filter(r => r.status === 'Pending').map(req => (
          <div key={req.id} className="list-item" style={{ borderLeft: '4px solid var(--warning)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                  <div className="item-title">{req.title}</div>
                  <div className="item-desc" style={{ color: 'white' }}>Requested by: {req.userName} (Flat {req.flatNumber})</div>
                  <div className="item-desc" style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>"{req.description}"</div>
                  <div className="item-meta" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--accent)' }}>Event Period: {req.date} {req.endDate && req.endDate !== req.date ? `to ${req.endDate}` : ''}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Time: {req.startTime} to {req.endTime}</span>
                    {req.lateNight && (
                      <span className="badge badge-warning" style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}>
                        Late Night Permission Requested
                      </span>
                    )}
                  </div>
               </div>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button className="btn" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }} onClick={() => respondToRequest(req.id, 'Approved')}>
                   <CheckCircle size={18} /> Approve
                 </button>
                 <button className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }} onClick={() => respondToRequest(req.id, 'Denied')}>
                   <XCircle size={18} /> Deny
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Past Requests</h2>
        {requests?.filter(r => r.status !== 'Pending').map(req => (
          <div key={req.id} className="list-item" style={{ opacity: 0.7 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="item-title">{req.title}</div>
                  <div className="item-meta">By {req.userName} | Date: {req.date}</div>
                </div>
                <div>
                   <span className={`badge badge-${req.status === 'Approved' ? 'success' : 'danger'}`}>{req.status}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
