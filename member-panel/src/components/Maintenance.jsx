import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { Wallet, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Maintenance() {
  const loggedInUserStr = localStorage.getItem('societyUser');
  const user = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

  const records = useLiveQuery(() => 
    user ? db.maintenanceRecords.where('userId').equals(user.id).reverse().toArray() : []
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Maintenance Dues</h1>
          <p className="page-subtitle">Track your individual flat maintenance billing and status.</p>
        </div>
      </div>

      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
            <Info color="var(--accent)" size={24} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>How to Pay</h3>
            <p className="item-desc">Maintenance for Flat {user?.flatNumber} can be paid at the Society Office. Please show your app screen to the accountant for verification.</p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title"><Wallet size={20} /> My Billing Records</h2>
        {records?.length === 0 && <p className="item-desc">No personal maintenance bills have been issued to your flat yet.</p>}
        {records?.map(bill => (
          <div key={bill.id} className="list-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
            <div>
              <div className="item-title" style={{ fontSize: '1.25rem', color: bill.status === 'Paid' ? 'var(--success)' : 'var(--accent)' }}>
                {bill.month} Maintenance
              </div>
              <div className="item-meta" style={{ marginTop: '0.5rem' }}>
                {bill.status === 'Paid' ? (
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
                    <CheckCircle size={16} /> Paid on {new Date(bill.paidAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={16} /> Due Date: {bill.dueDate}
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>₹{bill.amount}</div>
               {bill.status === 'Paid' ? (
                 <span className="badge badge-success">COMPLETED</span>
               ) : (
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px', display: 'inline-block', marginTop: '0.5rem' }}>UNPAID</div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
