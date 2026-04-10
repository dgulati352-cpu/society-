import React, { useState } from 'react';
import { Building2, KeyRound, Mail, Chrome, ArrowLeft } from 'lucide-react';
import { db } from '../../../shared/db';
import { auth, googleProvider, signInWithPopup, signOut } from '../../../shared/firebase';

export default function Login({ onLogin }) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const currentSocietyCode = localStorage.getItem('societyAppCode') || 'SOCIETY2026';

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === currentSocietyCode.toUpperCase()) {
      setStep(2);
      setError('');
    } else {
      setError('Invalid access code. Please try again.');
      setCode('');
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    try {
      if (!auth) throw new Error("Firebase is not fully initialized.");
      
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
      
      const registeredUser = await db.users.where('email').equalsIgnoreCase(userEmail.trim()).first();
      
      if (registeredUser) {
        onLogin({ type: 'user', user: registeredUser });
      } else {
        await signOut(auth);
        setError('This email is not registered in the Admin Directory. Access denied.');
      }
    } catch (err) {
      if (err.code === 'auth/invalid-api-key' || err.message.includes('initialize')) {
        setError('Firebase not configured. Please add your credentials in the .env.local file to use Real Google Login.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center', position: 'relative' }}>
        
        {step === 2 && (
          <button 
            type="button" 
            onClick={() => { setStep(1); setError(''); setEmail(''); }}
            style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
          <Building2 size={48} color="var(--accent)" />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Society Hub</h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
          {step === 1 ? 'Step 1: Security Code' : 'Step 2: Authenticate Identity'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="form-group" style={{ textAlign: 'left' }}>
            <label>Society Access Code</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                autoFocus
                type="text" 
                placeholder={`e.g. ${currentSocietyCode}`} 
                style={{ width: '100%', paddingLeft: '3rem' }} 
                value={code} 
                onChange={e => { setCode(e.target.value); setError(''); }}
              />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', background: 'var(--accent)' }}>
              Verify Code
            </button>
          </form>
        ) : (
          <div className="form-group" style={{ textAlign: 'left' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Your society has upgraded to secure Single Sign-On (SSO). Please authenticate using the same Google account registered with your society administration.
            </p>

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error}</p>}
            
            <button type="button" onClick={handleStep2Submit} className="btn" style={{ width: '100%', justifyContent: 'center', background: 'white', color: '#000', padding: '0.75rem' }}>
              <Chrome size={20} /> Open Google Login
            </button>
          </div>
        )}
        
        {step === 1 && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '0.5rem' }}>Demo Access Code:</p>
            <strong style={{ color: 'white', letterSpacing: '2px', fontSize: '1rem' }}>{currentSocietyCode}</strong>
          </div>
        )}
        
        {step === 2 && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '0.5rem' }}>Registered Demo Account:</p>
            <strong style={{ color: 'white', fontSize: '1rem' }}>demo@google.com</strong>
          </div>
        )}
      </div>
    </div>
  );
}
