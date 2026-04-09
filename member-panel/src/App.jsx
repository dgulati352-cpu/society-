import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Complaints from './components/Complaints';
import Notices from './components/Notices';
import RuleBook from './components/RuleBook';
import Emergency from './components/Emergency';
import EventRequests from './components/EventRequests';
import Maintenance from './components/Maintenance';
import Login from './components/Login';

import { Bell, X, CheckCircle, XCircle } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('societyAuth') === 'true'
  );
  const [notification, setNotification] = useState(null);

  const loggedInUserStr = localStorage.getItem('societyUser');
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

  // Real-time security listener: Watches the exact database row of the logged-in user
  const activeUserRecord = useLiveQuery(
    () => {
      if (!isAuthenticated || !loggedInUser?.email) return Promise.resolve('SKIP');
      return db.users.where('email').equalsIgnoreCase(loggedInUser.email).first();
    },
    [isAuthenticated, loggedInUserStr] // Re-run if auth state changes
  );

  // Real-time Event status listener
  const newStatusUpdate = useLiveQuery(
    () => {
      if (!isAuthenticated || !loggedInUser?.id) return Promise.resolve(null);
      return db.eventRequests
        .where('userId').equals(loggedInUser.id)
        .filter(r => r.status !== 'Pending' && !r.notified)
        .first();
    },
    [isAuthenticated, loggedInUser]
  );

  useEffect(() => {
    // Security Kick-out
    if (activeUserRecord === null) {
      alert("SECURITY ALERT: Your society membership access has been revoked by the Administration. Logging out immediately.");
      handleLogout();
    }
  }, [activeUserRecord]);

  useEffect(() => {
    // Event Status Notification
    if (newStatusUpdate) {
      const type = newStatusUpdate.status === 'Approved' ? 'success' : 'danger';
      const icon = newStatusUpdate.status === 'Approved' ? <CheckCircle size={20} /> : <XCircle size={20} />;
      
      setNotification({
        message: `Your Event Request "${newStatusUpdate.title}" has been ${newStatusUpdate.status}.`,
        type,
        icon
      });

      // Mark as notified in DB so we don't spam
      db.eventRequests.update(newStatusUpdate.id, { notified: true });

      // Auto hide
      setTimeout(() => setNotification(null), 8000);
    }
  }, [newStatusUpdate]);

  const handleLogin = (data) => {
    localStorage.setItem('societyAuth', 'true');
    if (data?.user) {
      localStorage.setItem('societyUser', JSON.stringify(data.user));
    } else {
      localStorage.removeItem('societyUser');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('societyAuth');
    localStorage.removeItem('societyUser');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/rules" element={<RuleBook />} />
          <Route path="/events" element={<EventRequests />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>

        {/* Global Status Notification */}
        {notification && (
          <div className={`notification-toast status-${notification.type}`}>
            <div className="toast-content">
              {notification.icon}
              <span>{notification.message}</span>
            </div>
            <button className="toast-close" onClick={() => setNotification(null)}>
              <X size={16} />
            </button>
          </div>
        )}
      </main>

      <style>{`
        .notification-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          animation: slideInDown 0.4s ease-out;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .status-success { border-left: 4px solid var(--success); }
        .status-danger { border-left: 4px solid var(--danger); }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }
        .status-success svg { color: var(--success); }
        .status-danger svg { color: var(--danger); }

        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
        }

        @keyframes slideInDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
