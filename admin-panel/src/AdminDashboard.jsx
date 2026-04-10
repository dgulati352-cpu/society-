import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { MessageSquareWarning, Megaphone, Calendar, Clock, Share2, Copy, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const complaints = useLiveQuery(() => db.complaints.toArray());
  const notices = useLiveQuery(() => db.notices.orderBy('createdAt').reverse().toArray());
  const events = useLiveQuery(() => db.events.toArray());
  const maintenance = useLiveQuery(() => db.maintenance.toArray());
  const settings = useLiveQuery(() => db.societySettings.get(1));

  const activeComplaints = complaints?.filter(c => c.status !== 'Resolved').length || 0;
  const totalEvents = events?.length || 0;
  
  // Financial Analytics
  const totalPaid = maintenance?.filter(m => m.status === 'Paid')?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const totalPending = maintenance?.filter(m => m.status === 'Unpaid')?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const totalBills = maintenance?.length || 0;
  const paidCount = maintenance?.filter(m => m.status === 'Paid')?.length || 0;
  const collectionRate = totalBills > 0 ? Math.round((paidCount / totalBills) * 100) : 0;

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">{settings?.name || 'Society Admin'} Executive Summary</h1>
          <p className="page-subtitle">Market-Ready Management Portal | Version 2.0</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
             <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>SYSTEM LIVE</span>
           </div>
        </div>
      </div>

      {/* Financial Pulse Row */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card premium-card">
          <div className="card-label">Revenue Collected</div>
          <div className="card-value" style={{ color: 'var(--success)' }}>₹{totalPaid.toLocaleString()}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${collectionRate}%`, background: 'var(--success)' }}></div>
          </div>
          <div className="card-foot">Collection Rate: {collectionRate}%</div>
        </div>

        <div className="glass-card premium-card">
          <div className="card-label">Pending Dues</div>
          <div className="card-value" style={{ color: 'var(--warning)' }}>₹{totalPending.toLocaleString()}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${100-collectionRate}%`, background: 'var(--warning)' }}></div>
          </div>
          <div className="card-foot">Follow-up Required</div>
        </div>

        <div className="glass-card premium-card">
          <div className="card-label">Resolution Time</div>
          <div className="card-value" style={{ color: 'var(--accent)' }}>24.2 Hours</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `85%`, background: 'var(--accent)' }}></div>
          </div>
          <div className="card-foot">Target: 24 Hours</div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card stat-card" style={{ borderTop: '4px solid var(--warning)' }}>
          <div className="stat-header">Complaints <MessageSquareWarning size={16} /></div>
          <div className="stat-value">{activeComplaints} Active</div>
        </div>
        <div className="glass-card stat-card" style={{ borderTop: '4px solid var(--accent)' }}>
          <div className="stat-header">Events <Calendar size={16} /></div>
          <div className="stat-value">{totalEvents} Planned</div>
        </div>
        <div className="glass-card stat-card" style={{ borderTop: '4px solid var(--danger)' }}>
          <div className="stat-header">Broadcasts <Megaphone size={16} /></div>
          <div className="stat-value">{notices?.length || 0} Sent</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h2 className="section-title"><Clock size={20} /> Operational Feed</h2>
          <div className="item-desc" style={{ marginBottom: '1rem' }}>Latest society interactions.</div>
          {notices?.slice(0, 4).map(n => (
            <div key={n.id} className="list-item" style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500' }}>{n.title}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Broadcasted to all residents</div>
            </div>
          ))}
        </div>

        <div className="glass-card">
           <h2 className="section-title"><Smartphone size={20} /> Resident Onboarding</h2>
           <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ background: 'white', padding: '0.4rem', borderRadius: '8px' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin)}`} alt="QR" style={{ width: '100px', display: 'block' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="item-desc"><b>Product Link:</b></p>
                <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', margin: '0.5rem 0' }}>{window.location.origin}</div>
                <button className="btn" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => navigator.clipboard.writeText(window.location.origin)}>Copy White-Label Link</button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .premium-card { padding: 1.5rem; }
        .card-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
        .card-value { font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem; }
        .progress-container { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 0.5rem; overflow: hidden; }
        .progress-bar { height: 100%; border-radius: 10px; transition: width 1s ease-in-out; }
        .card-foot { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
