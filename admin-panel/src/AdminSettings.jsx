import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { ShieldCheck, Building, Palette } from 'lucide-react';

export default function AdminSettings() {
  const settings = useLiveQuery(() => db.societySettings.get(1));
  const [newCode, setNewCode] = useState(localStorage.getItem('societyAppCode') || 'SOCIETY2026');
  const [adminCode, setAdminCode] = useState(localStorage.getItem('adminAppCode') || 'ADMIN123');
  const [profile, setProfile] = useState({ name: '', address: '', contact: '', logo: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setProfile(settings);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    localStorage.setItem('societyAppCode', newCode);
    localStorage.setItem('adminAppCode', adminCode);
    
    await db.societySettings.put({
      id: 1,
      ...profile
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Product & Branding Settings</h1>
          <p className="page-subtitle">Configure white-label branding and security controls.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <h2 className="section-title"><Building size={20} /> Society Profile (White-Label)</h2>
          <p className="item-desc" style={{ marginBottom: '1.5rem' }}>
            Customize the app identity for your client's society.
          </p>

          <div className="form-group">
            <label>Society Name</label>
            <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="e.g. Paramount Luxuria" />
            
            <label>Society Address</label>
            <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Full address..." rows="2" />
            
            <label>Branding Logo URL</label>
            <input value={profile.logo} onChange={e => setProfile({...profile, logo: e.target.value})} placeholder="https://logo-url.com/img.png" />
            
            <label>Support Contact</label>
            <input value={profile.contact} onChange={e => setProfile({...profile, contact: e.target.value})} placeholder="+91 99999 88888" />
          </div>
        </div>

        <div className="glass-card">
          <h2 className="section-title"><ShieldCheck size={20} /> Access & Security</h2>
          <p className="item-desc" style={{ marginBottom: '1.5rem' }}>
            Core credential management for the application.
          </p>

          <form onSubmit={handleSave} className="form-group">
            <label>Resident Society Access Code</label>
            <input 
              type="text" 
              required 
              value={newCode} 
              onChange={(e) => { setNewCode(e.target.value.toUpperCase()); setSaved(false); }} 
              style={{ textTransform: 'uppercase', marginBottom: '1rem' }}
            />

            <label>Admin Master Password</label>
            <input 
              type="text" 
              required 
              value={adminCode} 
              onChange={(e) => { setAdminCode(e.target.value); setSaved(false); }} 
            />

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Apply & Deploy Changes
              </button>
            </div>
            {saved && <div style={{ color: 'var(--success)', marginTop: '0.5rem', textAlign: 'center' }}>✓ Settings Deployed Successfully!</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
