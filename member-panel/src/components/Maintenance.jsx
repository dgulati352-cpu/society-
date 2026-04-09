import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../shared/db';
import { Wallet, CheckCircle, AlertCircle, CreditCard, ShieldCheck, X } from 'lucide-react';

export default function Maintenance() {
  const notices = useLiveQuery(() => db.maintenance.orderBy('createdAt').reverse().toArray());
  const [activeBill, setActiveBill] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await db.maintenance.update(activeBill.id, { status: 'Paid', paidAt: Date.now() });
    
    setIsProcessing(false);
    setActiveBill(null);
    alert(`Success! Payment of ₹${activeBill.amount} for ${activeBill.month} has been received.`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Dues</h1>
          <p className="page-subtitle">Track and pay your society maintenance bills securely online.</p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title"><Wallet size={20} /> Latest Maintenance Invoices</h2>
        {notices?.length === 0 && <p className="item-desc">No maintenance bills have been published yet.</p>}
        {notices?.map(bill => (
          <div key={bill.id} className="list-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderLeft: bill.status === 'Paid' ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
            <div>
              <div className="item-title" style={{ fontSize: '1.25rem', color: bill.status === 'Paid' ? 'var(--success)' : 'var(--accent)' }}>
                {bill.month} Maintenance 
                {bill.status === 'Paid' && <CheckCircle size={16} style={{ marginLeft: '0.5rem', display: 'inline' }} />}
              </div>
              <div className="item-meta" style={{ marginTop: '0.5rem' }}>
                <span style={{ color: bill.status === 'Paid' ? 'var(--text-muted)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={16} /> {bill.status === 'Paid' ? 'Payment Completed' : `Due Date: ${bill.dueDate}`}
                </span>
                <span>Published: {new Date(bill.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
               <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{bill.amount}</div>
               {bill.status === 'Paid' ? (
                 <span className="badge badge-success">PAID</span>
               ) : (
                 <button className="btn btn-primary" onClick={() => setActiveBill(bill)}>
                   <CreditCard size={18} /> Pay Online
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {activeBill && (
        <div className="modal-overlay" onClick={() => !isProcessing && setActiveBill(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '8px' }}>
                  <Wallet size={24} color="white" />
                </div>
                <h3>Secure Payment</h3>
              </div>
              {!isProcessing && <button className="icon-btn" onClick={() => setActiveBill(null)}><X size={20} /></button>}
            </div>

            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Amount to Pay</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{activeBill.amount}.00</div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{activeBill.month} Maintenance Charges</div>
              </div>

              {isProcessing ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Processing Payment...</h4>
                  <p className="item-desc">Please do not refresh or close the browser.</p>
                </div>
              ) : (
                <div className="form-group">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>CHOOSE PAYMENT METHOD</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button 
                        className="btn" 
                        onClick={() => {
                          // Standard UPI Intent URL for India
                          const upiUrl = `upi://pay?pa=society@upi&pn=SocietyHub&am=${activeBill.amount}&cu=INR`;
                          window.location.href = upiUrl;
                          // After redirection, we simulate success for demo purposes
                          setTimeout(handlePayment, 3000);
                        }}
                        style={{ background: 'rgba(255,255,255,0.05)', justifyContent: 'center', padding: '1rem' }}
                      >
                         GPay / BHIM
                      </button>
                      <button 
                        className="btn" 
                        onClick={() => {
                          const upiUrl = `upi://pay?pa=society@upi&pn=SocietyHub&am=${activeBill.amount}&cu=INR`;
                          window.location.href = upiUrl;
                          setTimeout(handlePayment, 3000);
                        }}
                        style={{ background: 'rgba(255,255,255,0.05)', justifyContent: 'center', padding: '1rem' }}
                      >
                         PhonePe / Paytm
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', padding: '0.5rem 0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <span style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></span>
                    <span style={{ fontSize: '0.7rem' }}>OR USE CARD</span>
                    <span style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></span>
                  </div>

                  <label>Card Number</label>
                  <input type="text" placeholder="**** **** **** 1234" defaultValue="4242 4242 424 As" />
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" defaultValue="12/28" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>CVV</label>
                      <input type="password" placeholder="***" defaultValue="123" />
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }} onClick={handlePayment}>
                    Pay via Card
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid var(--accent);
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
