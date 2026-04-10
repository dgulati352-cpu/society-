import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Gavel, Plus, Trash2, X, Search } from 'lucide-react';

export default function AdminFines() {
  const fines = useLiveQuery(() => db.fines.orderBy('createdAt').reverse().toArray());
  const users = useLiveQuery(() => db.users.toArray());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    userId: '', 
    userName: '', 
    flatNumber: '', 
    reason: '', 
    amount: '' 
  });

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.flatNumber.includes(searchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      alert("Please select a resident");
      return;
    }

    await db.fines.add({
      ...formData,
      status: 'Unpaid',
      createdAt: Date.now()
    });

    setFormData({ userId: '', userName: '', flatNumber: '', reason: '', amount: '' });
    setSearchTerm('');
    setIsModalOpen(false);
    alert("Fine issued successfully!");
  };

  const removeFine = async (id) => {
    if (window.confirm("Remove this fine record?")) {
      await db.fines.delete(id);
    }
  };

  const selectUser = (user) => {
    setFormData({
      ...formData,
      userId: user.id,
      userName: user.name,
      flatNumber: user.flatNumber
    });
    setSearchTerm(`${user.name} (${user.flatNumber})`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Management of Fines</h1>
          <p className="page-subtitle">Issue and track disciplinary fines for residents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Issue New Fine
        </button>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Gavel size={20} /> Active Fines</h2>
        {fines?.length === 0 && <p className="item-desc">No fines have been issued yet.</p>}
        {fines?.map(fine => (
          <div key={fine.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="item-title">{fine.userName} - {fine.flatNumber}</div>
              <div className="item-desc">{fine.reason}</div>
              <div className="item-meta">
                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>₹{fine.amount}</span>
                <span>Issued: {new Date(fine.createdAt).toLocaleDateString()}</span>
                <span className={`badge ${fine.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>{fine.status}</span>
              </div>
            </div>
            <button 
              onClick={() => removeFine(fine.id)}
              className="icon-btn"
              style={{ color: 'var(--danger)' }}
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
              <h3>Issue Disciplinary Fine</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <label>Search Resident (Name or Flat)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  required 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Type to search..." 
                />
                {searchTerm && !formData.userId && filteredUsers?.length > 0 && (
                  <div className="glass-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, maxHeight: '150px', overflowY: 'auto', marginTop: '5px', padding: '0.5rem' }}>
                    {filteredUsers.map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => selectUser(u)}
                        style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                        className="hover-bg"
                      >
                        {u.name} ({u.flatNumber})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label>Reason for Fine</label>
              <textarea 
                required 
                value={formData.reason} 
                onChange={e => setFormData({...formData, reason: e.target.value})} 
                placeholder="e.g. Late night noise complaint, improper parking..."
                rows="3"
              />

              <label>Fine Amount (₹)</label>
              <input 
                type="number" 
                required 
                value={formData.amount} 
                onChange={e => setFormData({...formData, amount: e.target.value})} 
                placeholder="e.g. 500" 
              />

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Issue Fine to Resident</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .hover-bg:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
