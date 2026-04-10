import Dexie from 'dexie';

export const db = new Dexie('SocietyAppDB');

db.version(4).stores({
  complaints: '++id, title, description, category, status, createdAt',
  notices: '++id, title, description, type, createdAt',
  rules: '++id, section, title, description',
  events: '++id, title, description, date, time',
  users: '++id, email, name, flatNumber, status',
  emergency: '++id, title, number, iconName, color',
  eventRequests: '++id, userId, userName, flatNumber, title, date, endDate, startTime, endTime, lateNight, status, createdAt, notified',
  maintenance: '++id, month, amount, dueDate, status, createdAt',
  societySettings: 'id, name, address, contact, logo, currency',
  maintenanceReports: '++id, month, totalCollected, totalPending, generatedAt',
  fines: '++id, userId, userName, flatNumber, reason, amount, status, createdAt',
  maintenanceRecords: '++id, billId, userId, userName, flatNumber, month, amount, dueDate, status, paidAt, createdAt'
});

// Add some initial mock data if empty
db.on('populate', () => {
  db.users.bulkAdd([
    { email: 'demo@google.com', name: 'Demo Google User', flatNumber: 'A-101', status: 'Active' },
    { email: 'john@google.com', name: 'John Doe', flatNumber: 'B-205', status: 'Active' }
  ]);

  db.emergency.bulkAdd([
    { title: "Police Control Room", number: "100", iconName: "Shield", color: "var(--accent)" },
    { title: "Ambulance / Medical", number: "108", iconName: "Ambulance", color: "var(--danger)" },
    { title: "Fire Brigade", number: "101", iconName: "ShieldAlert", color: "var(--warning)" },
    { title: "Society Chairman (Mr. Rajesh)", number: "+91 98765 43210", iconName: "Phone", color: "var(--success)" },
    { title: "Society Secretary (Mr. Amit)", number: "+91 98765 43211", iconName: "Phone", color: "var(--success)" },
    { title: "Head Security Guard (Gate 1)", number: "+91 98765 43212", iconName: "Shield", color: "white" },
  ]);

  db.complaints.bulkAdd([
    { title: 'Elevator not working in Block A', description: 'The left elevator is stuck on the 4th floor.', category: 'Maintenance', status: 'In Progress', createdAt: Date.now() - 7200000 },
    { title: 'Loud music late night from Flat 402', description: 'Noise disturbance past midnight.', category: 'Disturbance', status: 'Resolved', createdAt: Date.now() - 86400000 }
  ]);
  
  db.notices.bulkAdd([
    { title: 'Water Supply Maintenance', description: 'Water supply will be affected on block B from 2PM to 5PM tomorrow.', type: 'Important', createdAt: Date.now() },
    { title: 'Monthly Maintenance Fee Reminder', description: 'Please pay your monthly fee by the 5th.', type: 'Finance', createdAt: Date.now() - 172800000 }
  ]);

  db.events.bulkAdd([
    { title: 'Summer Pool Party', description: 'Join us for the annual summer pool party.', date: new Date(Date.now() + 864000000).toISOString().split('T')[0], time: '16:00' },
    { title: 'Yoga Workshop', description: 'Morning yoga session led by instructor Sarah.', date: new Date(Date.now() + 964000000).toISOString().split('T')[0], time: '07:00' }
  ]);

  db.rules.bulkAdd([
    { section: 'General Rules', title: 'Quiet Hours', description: 'Residents must maintain low noise levels between 10:00 PM and 7:00 AM daily.' },
    { section: 'General Rules', title: 'Waste Disposal', description: 'Garbage must be segregated into wet and dry waste.' },
    { section: 'Amenities Usage', title: 'Clubhouse', description: 'Open from 6:00 AM to 11:00 PM.' }
  ]);
});
