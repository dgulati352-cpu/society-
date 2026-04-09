import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../shared/db';
import { BookOpen, Plus, X, Trash2 } from 'lucide-react';

export default function AdminRuleBook() {
  const rules = useLiveQuery(() => db.rules.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ section: 'General Rules', title: '', description: '' });

  const groupedRules = rules?.reduce((acc, rule) => {
    if (!acc[rule.section]) acc[rule.section] = [];
    acc[rule.section].push(rule);
    return acc;
  }, {}) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.rules.add({ ...formData });
    setFormData({ section: 'General Rules', title: '', description: '' });
    setIsModalOpen(false);
  };

  const deleteRule = async (id) => { await db.rules.delete(id); };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Rules</h1>
          <p className="page-subtitle">Add or remove society guidelines and by-laws.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Rule
        </button>
      </div>

      <div className="grid-2">
        {Object.entries(groupedRules).map(([section, sectionRules]) => (
          <div key={section} className="glass-card">
            <h2 className="section-title"><BookOpen size={20} /> {section}</h2>
            {sectionRules.map((rule, idx) => (
              <div key={rule.id} className="list-item" style={{ position: 'relative' }}>
                <button
                  onClick={() => deleteRule(rule.id)}
                  style={{ position: 'absolute', right: 0, top: '1rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
                <div className="item-title" style={{ paddingRight: '2rem' }}>{idx + 1}. {rule.title}</div>
                <div className="item-desc">{rule.description}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Rule</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-group">
              <label>Section</label>
              <input required value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} placeholder="e.g., General Rules, Amenities..." />

              <label>Rule Title</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

              <label>Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
