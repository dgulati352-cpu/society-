import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { Gavel, AlertCircle, CheckCircle } from 'lucide-react';

export default function Fines() {
  const loggedInUserStr = localStorage.getItem('societyUser');
  const user = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
  
  const fines = useLiveQuery(() => 
    user ? db.fines.where('userId').equals(user.id).reverse().toArray() : []
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Disciplinary Fines</h1>
          <p className="page-subtitle">View and track any fines issued by the society board.</p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Gavel size={20} /> My Fines</h2>
        {fines?.length === 0 && <p className="item-desc">No fines have been issued to your account.</p>}
        {fines?.map(fine => (
          <div key={fine.id} className="list-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="item-title" style={{ color: fine.status === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
                {fine.reason}
              </div>
              <div className="item-meta">
                <span>Issued: {new Date(fine.createdAt).toLocaleDateString()}</span>
                {fine.status === 'Paid' ? (
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={14}/> Paid
                  </span>
                ) : (
                  <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={14}/> Unpaid
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{fine.amount}</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To be paid to Office</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--warning)' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Important Note</h3>
        <p className="item-desc">Fines must be settled at the society office within 7 days of issuance to avoid further disciplinary action or late fees.</p>
      </div>
    </div>
  );
}
