import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function EventRequests() {
  const loggedInUserStr = localStorage.getItem('societyUser');
  const user = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
  
  const requests = useLiveQuery(() => 
    user ? db.eventRequests.where('userId').equals(user.id).reverse().toArray() : []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', endDate: '', startTime: '', endTime: '', lateNight: false, description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Error: User session not found. Please log out and log back in.");
      return;
    }

    try {
      await db.eventRequests.add({
        userId: user.id || user.email, // Fallback to email if ID is missing
        userName: user.name,
        flatNumber: user.flatNumber,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        endDate: formData.endDate || formData.date, // Default to start date if not selected
        startTime: formData.startTime,
        endTime: formData.endTime,
        lateNight: formData.lateNight,
        status: 'Pending',
        createdAt: Date.now()
      });
      
      alert("Request submitted successfully! The administration will review it soon.");
      setFormData({ title: '', date: '', endDate: '', startTime: '', endTime: '', lateNight: false, description: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit request: " + error.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Permission Requests</h1>
          <p className="page-subtitle">Request official society permission for private events.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Calendar size={20} /> My Requests</h2>
        {requests?.length === 0 && <p className="item-desc">You have not submitted any event requests.</p>}
        {requests?.map(req => (
          <div key={req.id} className="list-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="item-title">{req.title}</div>
              <div className="item-desc">{req.description}</div>
              <div className="item-meta">
                <span>Event Period: {req.date} {req.endDate && req.endDate !== req.date ? `to ${req.endDate}` : ''}</span>
                <span>Time: {req.startTime} to {req.endTime}</span>
                {req.lateNight && <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>Late Night Requested</span>}
                <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              {req.status === 'Pending' && <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={16}/> {req.status}</span>}
              {req.status === 'Approved' && <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={16}/> {req.status}</span>}
              {req.status === 'Denied' && <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><XCircle size={16}/> {req.status}</span>}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Event Request</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <label>Event Name</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Birthday Party in Clubhouse" />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Start Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>End Date (Keep same for single day)</label>
                  <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} min={formData.date} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Start Time</label>
                  <input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>End Time</label>
                  <input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                <input 
                  type="checkbox" 
                  id="lateNight" 
                  checked={formData.lateNight} 
                  onChange={e => setFormData({...formData, lateNight: e.target.checked})} 
                />
                <label htmlFor="lateNight" style={{ margin: 0 }}>Request permission for late night event (after 10 PM)</label>
              </div>
              
              <label>Description & Expected Guests</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Provide details..."></textarea>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Submit Request to Admin</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
