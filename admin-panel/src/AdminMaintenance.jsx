import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Wallet, Plus, Trash2, X } from 'lucide-react';

export default function AdminMaintenance() {
  const bills = useLiveQuery(() => db.maintenance.orderBy('createdAt').reverse().toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ month: '', amount: '', dueDate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.maintenance.add({
      ...formData,
      status: 'Unpaid',
      createdAt: Date.now()
    });
    setFormData({ month: '', amount: '', dueDate: '' });
    setIsModalOpen(false);
  };

  const removeBill = async (id) => {
    if (window.confirm("Delete this maintenance record from public view?")) {
      await db.maintenance.delete(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Broadcast Maintenance</h1>
          <p className="page-subtitle">Publish new maintenance cycles to all residents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Publish New Bill
        </button>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Wallet size={20} /> Issued Maintenance Bills</h2>
        {bills?.length === 0 && <p className="item-desc">No bills issued yet.</p>}
        {bills?.map(bill => (
          <div key={bill.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="item-title">{bill.month} Maintenance</div>
              <div className="item-meta">Amount: ₹{bill.amount} | Due: {bill.dueDate}</div>
            </div>
            <button 
              onClick={() => removeBill(bill.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Publish Maintenance Invoice</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <label>Bill Name / Month</label>
              <input required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} placeholder="E.g. April 2026" />
              
              <label>Total Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="E.g. 5000" />
              
              <label>Final Due Date</label>
              <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Broadcast to All Residents</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
