import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminSettings() {
  const [newCode, setNewCode] = useState(localStorage.getItem('societyAppCode') || 'SOCIETY2026');
  const [adminCode, setAdminCode] = useState(localStorage.getItem('adminAppCode') || 'ADMIN123');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('societyAppCode', newCode);
    localStorage.setItem('adminAppCode', adminCode);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Society Settings</h1>
          <p className="page-subtitle">Configure global app settings for residents.</p>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <h2 className="section-title"><ShieldCheck size={20} /> Access Control</h2>
        <p className="item-desc" style={{ marginBottom: '1.5rem' }}>
          Change the shared passcode that residents use to access the application. If you change this, you must inform the residents of the new passcode.
        </p>

        <form onSubmit={handleSave} className="form-group">
          <label>Resident Society Access Code</label>
          <input 
            type="text" 
            required 
            value={newCode} 
            onChange={(e) => { setNewCode(e.target.value.toUpperCase()); setSaved(false); }} 
            placeholder="e.g. BLOCKA-2026"
            style={{ textTransform: 'uppercase', marginBottom: '1rem' }}
          />

          <label>Admin Master Password</label>
          <input 
            type="text" 
            required 
            value={adminCode} 
            onChange={(e) => { setAdminCode(e.target.value); setSaved(false); }} 
            placeholder="ADMIN123"
          />

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            {saved && <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Updated successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
