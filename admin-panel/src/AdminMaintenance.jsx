import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Wallet, Plus, Trash2, X, CheckCircle, Users, Receipt } from 'lucide-react';

export default function AdminMaintenance() {
  const users = useLiveQuery(() => db.users.toArray());
  const records = useLiveQuery(() => db.maintenanceRecords.orderBy('createdAt').reverse().toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('broadcast'); // 'broadcast' or 'ledger'
  const [formData, setFormData] = useState({ month: '', amount: '', dueDate: '', targetFlat: 'ALL' });

  const handleBroadcast = async (e) => {
    e.preventDefault();
    
    // 1. Create the master billing entry
    const billId = await db.maintenance.add({
      month: formData.month,
      amount: formData.amount,
      dueDate: formData.dueDate,
      createdAt: Date.now()
    });

    // 2. Create individual records
    const targetUsers = formData.targetFlat === 'ALL' 
      ? users 
      : users.filter(u => u.flatNumber === formData.targetFlat);

    if (targetUsers?.length === 0) {
      alert("No matching residents found for this target.");
      return;
    }

    const newRecords = targetUsers.map(u => ({
      billId,
      userId: u.id,
      userName: u.name,
      flatNumber: u.flatNumber,
      month: formData.month,
      amount: formData.amount,
      dueDate: formData.dueDate,
      status: 'Unpaid',
      createdAt: Date.now()
    }));

    await db.maintenanceRecords.bulkAdd(newRecords);
    
    alert(`Bill generated for ${targetUsers.length} residents.`);
    setFormData({ month: '', amount: '', dueDate: '', targetFlat: 'ALL' });
    setIsModalOpen(false);
  };

  const markAsPaid = async (recordId) => {
    await db.maintenanceRecords.update(recordId, {
      status: 'Paid',
      paidAt: Date.now()
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Records</h1>
          <p className="page-subtitle">Manage maintenance billing and track resident payments.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${activeTab === 'broadcast' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('broadcast')}>
            <Receipt size={18} /> Billing History
          </button>
          <button className={`btn ${activeTab === 'ledger' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('ledger')}>
            <Users size={18} /> Payment Ledger
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginLeft: '1rem' }}>
            <Plus size={18} /> New Bill
          </button>
        </div>
      </div>

      {activeTab === 'broadcast' ? (
        <div className="glass-card">
          <h2 className="section-title"><Wallet size={20} /> Issued Billing Cycles</h2>
          {records?.length === 0 && <p className="item-desc">No billing cycles recorded yet.</p>}
          <div className="list-container">
            {[...new Set(records?.map(r => r.month))].map(month => {
              const monthRecords = records.filter(r => r.month === month);
              const paidCount = monthRecords.filter(r => r.status === 'Paid').length;
              return (
                <div key={month} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="item-title">{month} Maintenance Cycle</div>
                    <div className="item-meta">
                      <span>Status: {paidCount} / {monthRecords.length} Residents Paid</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {Math.round((paidCount / monthRecords.length) * 100)}% Collected
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card">
          <h2 className="section-title"><CheckCircle size={20} /> Individual Payment Status</h2>
          <div className="list-container">
            {records?.map(r => (
              <div key={r.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="item-title">{r.userName} (Flat {r.flatNumber})</div>
                  <div className="item-desc">{r.month} maintenance bill - ₹{r.amount}</div>
                </div>
                <div>
                  {r.status === 'Paid' ? (
                    <span className="badge badge-success">PAID on {new Date(r.paidAt).toLocaleDateString()}</span>
                  ) : (
                    <button className="btn" style={{ fontSize: '0.8rem' }} onClick={() => markAsPaid(r.id)}>Mark as Paid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Maintenance Bill</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleBroadcast} className="form-group">
              <label>Target Flat Number (Type 'ALL' for everyone)</label>
              <input required value={formData.targetFlat} onChange={e => setFormData({...formData, targetFlat: e.target.value.toUpperCase()})} placeholder="E.g. 101 or ALL" />

              <label>Bill for Month</label>
              <input required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} placeholder="E.g. May 2026" />
              
              <label>Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="2500" />
              
              <label>Due Date</label>
              <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Generate & Notify Residents</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
