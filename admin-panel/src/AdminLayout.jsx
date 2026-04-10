import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { Bell, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminNotices from './AdminNotices';
import AdminComplaints from './AdminComplaints';
import AdminRuleBook from './AdminRuleBook';
import AdminSettings from './AdminSettings';
import AdminUsers from './AdminUsers';
import AdminEmergency from './AdminEmergency';
import AdminEventRequests from './AdminEventRequests';
import AdminMaintenance from './AdminMaintenance';
import AdminFines from './AdminFines';

export default function AdminLayout() {
  const [notification, setNotification] = useState(null);
  const isInitialLoad = useRef(true);

  // Watch for the latest complaint and event request
  const latestComplaint = useLiveQuery(() => db.complaints.orderBy('createdAt').last());
  const latestEventRequest = useLiveQuery(() => db.eventRequests.orderBy('createdAt').last());

  useEffect(() => {
    if (isInitialLoad.current) {
      // Skip the first run so we don't notify about old items
      if (latestComplaint !== undefined && latestEventRequest !== undefined) {
        isInitialLoad.current = false;
      }
      return;
    }

    if (latestComplaint) {
      const timeDiff = Date.now() - latestComplaint.createdAt;
      if (timeDiff < 5000) { // Only notify if created in the last 5 seconds
        showNotification(`New Complaint: ${latestComplaint.title}`);
      }
    }
  }, [latestComplaint]);

  useEffect(() => {
    if (isInitialLoad.current) return;

    if (latestEventRequest) {
      const timeDiff = Date.now() - latestEventRequest.createdAt;
      if (timeDiff < 5000) {
        showNotification(`New Event Request: ${latestEventRequest.title}`);
      }
    }
  }, [latestEventRequest]);

  const showNotification = (message) => {
    setNotification(message);
    // Auto hide after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <>
      <AdminSidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/notices" element={<AdminNotices />} />
          <Route path="/complaints" element={<AdminComplaints />} />
          <Route path="/rules" element={<AdminRuleBook />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/emergency" element={<AdminEmergency />} />
          <Route path="/events" element={<AdminEventRequests />} />
          <Route path="/maintenance" element={<AdminMaintenance />} />
          <Route path="/fines" element={<AdminFines />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>

        {/* Real-time Notification Toast */}
        {notification && (
          <div className="notification-toast">
            <div className="toast-content">
              <Bell size={20} color="var(--accent)" />
              <span>{notification}</span>
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
          bottom: 2rem;
          right: 2rem;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid var(--accent);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px var(--accent-glow);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }
        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
          transition: color 0.2s;
        }
        .toast-close:hover {
          color: white;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
