import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { MessageSquareWarning, Search, Filter, X, Plus } from 'lucide-react';

export default function Complaints() {
  const complaints = useLiveQuery(() => db.complaints.orderBy('createdAt').reverse().toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const savedUserStr = localStorage.getItem('societyUser');
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  const [formData, setFormData] = useState({ 
    title: '', description: '', category: 'Maintenance', 
    name: user?.name || '', flatNumber: user?.flatNumber || '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.complaints.add({
      ...formData,
      status: 'Open',
      createdAt: Date.now()
    });
    setFormData({ title: '', description: '', category: 'Maintenance', name: '', flatNumber: '' });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">Track and manage your society issues</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          File New Complaint
        </button>
      </div>

      <div className="glass-card">
        <h2 className="section-title">Complaints Record</h2>
        {complaints?.length === 0 && <p className="item-desc">No complaints found. All good!</p>}
        {complaints?.map((c) => (
          <div key={c.id} className="list-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="item-title">{c.title}</div>
              <div className="item-desc" style={{ marginTop: '0.25rem' }}>{c.description}</div>
              <div className="item-meta">
                <span className={`badge badge-${c.status === 'Open' ? 'danger' : c.status === 'In Progress' ? 'warning' : 'success'}`}>
                  {c.status}
                </span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
                <span>Category: {c.category}</span>
                {c.flatNumber && <span>Flat: {c.flatNumber}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>File Complaint</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Your Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g. John Doe" />
                </div>
                <div>
                  <label>Flat Number</label>
                  <input required value={formData.flatNumber} onChange={e => setFormData({...formData, flatNumber: e.target.value})} placeholder="E.g. B-402" />
                </div>
              </div>

              <label>Issue Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g. Plumbing issue in kitchen" />
              
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Maintenance</option>
                <option>Disturbance</option>
                <option>Security</option>
                <option>Other</option>
              </select>

              <label>Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" placeholder="Detail the issue..." />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
