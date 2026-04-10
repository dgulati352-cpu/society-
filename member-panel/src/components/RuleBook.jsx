import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function RuleBook() {
  const rules = useLiveQuery(() => db.rules.toArray());
  const [openSections, setOpenSections] = useState({});

  const groupedRules = rules?.reduce((acc, rule) => {
    if (!acc[rule.section]) acc[rule.section] = [];
    acc[rule.section].push(rule);
    return acc;
  }, {}) || {};

  const toggleSection = (section) => {
    setOpenSections(prev => {
      // If undefined, it means it's currently open by default, so we close it (false)
      const isCurrentlyOpen = prev[section] === undefined ? true : prev[section];
      return { ...prev, [section]: !isCurrentlyOpen };
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ color: 'var(--accent)' }}>Society Rule Book</h1>
          <p className="page-subtitle">Understand our community guidelines and by-laws.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '850px', margin: '0 auto' }}>
        {Object.entries(groupedRules).map(([section, sectionRules]) => {
          // Default to true (open) if the user hasn't explicitly toggled it yet
          const isOpen = openSections[section] === undefined ? true : openSections[section];
          
          return (
            <div key={section} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              
              {/* Accordion Header */}
              <button 
                onClick={() => toggleSection(section)}
                style={{ 
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '1.5rem', background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent', 
                  border: 'none', color: 'var(--text-main)', 
                  cursor: 'pointer', textAlign: 'left', outline: 'none',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--accent)' }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    {section}
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '0.25rem' }}>
                      {sectionRules.length} Official {sectionRules.length === 1 ? 'Rule' : 'Rules'}
                    </div>
                  </div>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </button>
              
              {/* Accordion Body */}
              {isOpen && (
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--card-border)' }}>
                  {sectionRules.map((rule, idx) => (
                    <div key={rule.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', borderBottom: idx === sectionRules.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ color: 'var(--success)', marginTop: '0.25rem', flexShrink: 0 }}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{rule.title}</h4>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
