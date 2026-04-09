import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { MessageSquareWarning } from 'lucide-react';

export default function AdminComplaints() {
  const complaints = useLiveQuery(() => db.complaints.orderBy('createdAt').reverse().toArray());

  const resolveComplaint = async (id) => {
    await db.complaints.update(id, { status: 'Resolved' });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints Ledger</h1>
          <p className="page-subtitle">Manage and resolve tickets submitted by residents.</p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><MessageSquareWarning size={20} /> All Complaints</h2>
        {complaints?.length === 0 && <p className="item-desc">No complaints found. All good!</p>}
        {complaints?.map((c) => (
          <div key={c.id} className="list-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="item-title">
                {c.title} 
                {(c.name || c.flatNumber) && (
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--accent)', marginLeft: '0.5rem' }}>
                    [Flat {c.flatNumber || 'N/A'} - {c.name || 'Anonymous'}]
                  </span>
                )}
              </div>
              <div className="item-desc" style={{ marginTop: '0.25rem' }}>{c.description}</div>
              <div className="item-meta">
                <span className={`badge badge-${c.status === 'Open' ? 'danger' : c.status === 'In Progress' ? 'warning' : 'success'}`}>
                  {c.status}
                </span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
                <span>Category: {c.category}</span>
              </div>
            </div>
            {c.status !== 'Resolved' && (
              <button
                className="btn"
                style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}
                onClick={() => resolveComplaint(c.id)}
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
