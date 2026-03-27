import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import CustomerPage from './pages/CustomerPage';

const App: React.FC = () => {
  return (
    <>
      <CustomerPage />
      <Analytics />
    </>
  );
};

export default App;