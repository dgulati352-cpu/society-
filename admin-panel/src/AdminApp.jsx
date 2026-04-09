import React, { useState, createContext, useContext } from 'react';
import AdminLayout from './AdminLayout';
import { Building2, KeyRound } from 'lucide-react';

export const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

function AdminLogin({ onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentCode = localStorage.getItem('adminAppCode') || 'ADMIN123';
    if (code === currentCode) onLogin();
    else { setError(true); setCode(''); }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Building2 size={48} color="var(--warning)" />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Portal</h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>Enter master password</p>
        
        <form onSubmit={handleSubmit} className="form-group" style={{ textAlign: 'left' }}>
          <label>Master Password</label>
          <div style={{ position: 'relative' }}>
            <KeyRound size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              autoFocus type="password" placeholder="••••••••" 
              style={{ width: '100%', paddingLeft: '3rem' }} 
              value={code} 
              onChange={e => { setCode(e.target.value); setError(false); }}
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Invalid code.</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', background: 'var(--warning)' }}>
            Login to Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('adminAuth') === 'true');

  const handleLogin = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAuth(true);
  };
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuth(false);
  };

  if (!isAuth) return <AdminLogin onLogin={handleLogin} />;

  return (
    <AdminContext.Provider value={{ handleLogout }}>
      <div className="app-container">
        <AdminLayout />
      </div>
    </AdminContext.Provider>
  );
}
