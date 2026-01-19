import React, { useState } from 'react';
import CustomerPage from './pages/CustomerPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'customer' | 'admin'>('customer');

  return (
    <div className="relative">
      {/* View Switcher (For Demo Purposes) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-1 rounded-b-lg z-50 text-xs flex gap-4 cursor-pointer">
        <span 
            onClick={() => setView('customer')}
            className={view === 'customer' ? 'font-bold text-blue-300 underline' : 'hover:text-gray-300'}
        >
            Customer View
        </span>
        <span className="text-gray-500">|</span>
        <span 
            onClick={() => setView('admin')}
            className={view === 'admin' ? 'font-bold text-blue-300 underline' : 'hover:text-gray-300'}
        >
            Admin Dashboard
        </span>
      </div>

      {view === 'customer' ? <CustomerPage /> : <AdminDashboard />}
    </div>
  );
};

export default App;
