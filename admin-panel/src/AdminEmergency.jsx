import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { PhoneCall, Plus, Trash2, X, Edit } from 'lucide-react';

export default function AdminEmergency() {
  const contacts = useLiveQuery(() => db.emergency.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', number: '', iconName: 'Phone', color: 'var(--success)' });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await db.emergency.update(editId, formData);
    } else {
      await db.emergency.add(formData);
    }
    closeModal();
  };

  const openEditMode = (contact) => {
    setFormData({ title: contact.title, number: contact.number, iconName: contact.iconName, color: contact.color });
    setEditId(contact.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ title: '', number: '', iconName: 'Phone', color: 'var(--success)' });
  };

  const removeContact = async (id) => {
    if (window.confirm("Are you sure you want to remove this emergency contact?")) {
      await db.emergency.delete(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Emergency Contacts</h1>
          <p className="page-subtitle">Add or edit vital society contacts visible to all residents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Contact
        </button>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><PhoneCall size={20} /> Active Contacts</h2>
        <div style={{ marginTop: '1rem' }}>
          {contacts?.length === 0 && <p className="item-desc">No emergency contacts configured.</p>}
          {contacts?.map(c => (
            <div key={c.id} className="list-item" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="item-title">{c.title}</div>
                <div className="item-desc" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{c.number}</div>
                <div className="item-meta">
                  <span>Icon: {c.iconName}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => openEditMode(c)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.5rem' }}
                  title="Edit Contact"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => removeContact(c.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                  title="Remove Contact"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Contact' : 'Add New Contact'}</h3>
              <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <label>Contact Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g., Night Guard Gate 2" />
              
              <label>Phone Number</label>
              <input required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} placeholder="E.g., 9876543210" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Display Icon</label>
                  <select value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})}>
                    <option value="Phone">Phone</option>
                    <option value="Shield">Police / Shield</option>
                    <option value="Ambulance">Ambulance</option>
                    <option value="ShieldAlert">Fire / Alert</option>
                  </select>
                </div>
                <div>
                  <label>Card Color</label>
                  <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                    <option value="var(--success)">Green (Safe)</option>
                    <option value="var(--danger)">Red (Urgent)</option>
                    <option value="var(--accent)">Blue (Police)</option>
                    <option value="var(--warning)">Yellow (Fire)</option>
                    <option value="white">White (Neutral)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
