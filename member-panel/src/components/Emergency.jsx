import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { PhoneOutgoing, Ambulance, ShieldAlert, Phone, Shield } from 'lucide-react';

export default function Emergency() {
  const contacts = useLiveQuery(() => db.emergency.toArray());

  // Initialize data if migrating without clearing DB
  useEffect(() => {
    async function initData() {
      const count = await db.emergency.count();
      if (count === 0) {
        await db.emergency.bulkAdd([
          { title: "Police Control Room", number: "100", iconName: "Shield", color: "var(--accent)" },
          { title: "Ambulance / Medical", number: "108", iconName: "Ambulance", color: "var(--danger)" },
          { title: "Fire Brigade", number: "101", iconName: "ShieldAlert", color: "var(--warning)" },
          { title: "Society Chairman (Mr. Rajesh)", number: "+91 98765 43210", iconName: "Phone", color: "var(--success)" }
        ]);
      }
    }
    initData();
  }, []);

  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'Shield': return <Shield size={24} />;
      case 'Ambulance': return <Ambulance size={24} />;
      case 'ShieldAlert': return <ShieldAlert size={24} />;
      case 'Phone': default: return <Phone size={24} />;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ color: 'var(--danger)' }}>Emergency Contacts</h1>
          <p className="page-subtitle">Immediate assistance and critical society numbers.</p>
        </div>
      </div>

      <div className="grid-2">
        {contacts?.map((c) => (
          <div key={c.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderLeft: `4px solid ${c.color}` }}>
            <div style={{ background: `rgba(255,255,255,0.05)`, padding: '1rem', borderRadius: '50%', color: c.color }}>
              {renderIcon(c.iconName)}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{c.title}</h3>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '1px' }}>{c.number}</p>
            </div>
            <a 
              href={`tel:${c.number.replace(/\s/g, '')}`} 
              className="btn" 
              style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}
            >
              <PhoneOutgoing size={20} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
