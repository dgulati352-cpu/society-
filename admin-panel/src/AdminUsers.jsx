import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Users, Plus, Trash2, X } from 'lucide-react';

export default function AdminUsers() {
  const users = useLiveQuery(() => db.users.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', flatNumber: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.users.add({ ...formData, status: 'Active' });
    setFormData({ name: '', email: '', flatNumber: '' });
    setIsModalOpen(false);
  };

  const removeUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this resident? They will lose access immediately.")) {
      await db.users.delete(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Residents</h1>
          <p className="page-subtitle">Add or remove authorized members for standard and Google login.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Resident
        </button>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Users size={20} /> Resident Directory</h2>
        <div style={{ marginTop: '1rem' }}>
          {users?.length === 0 && <p className="item-desc">No registered residents found.</p>}
          {users?.map(u => (
            <div key={u.id} className="list-item" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="item-title">{u.name} <span style={{ fontSize:'0.875rem', color:'var(--text-muted)' }}>- Flat {u.flatNumber}</span></div>
                <div className="item-desc">{u.email}</div>
                <div className="item-meta">
                  <span className="badge badge-success">{u.status}</span>
                </div>
              </div>
              <button 
                onClick={() => removeUser(u.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                title="Remove Resident"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Resident</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <label>Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g., John Doe" />
              
              <label>Registered Email (for Google Login)</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="E.g., resident@gmail.com" />

              <label>Flat / Unit Number</label>
              <input required value={formData.flatNumber} onChange={e => setFormData({...formData, flatNumber: e.target.value})} placeholder="E.g., C-302" />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Register Resident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
