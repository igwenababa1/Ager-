
import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const WarningBanner: React.FC = () => (
  <div className="bg-brand-warning text-black p-2 text-center text-sm font-bold">
    <p>
      <span className="font-extrabold">LEGAL & ETHICAL WARNING:</span> This tool is intended for authorized penetration testing and red team operations ONLY.
      Unauthorized use is illegal. Ensure you have explicit, written permission before deploying or using this framework on any system.
    </p>
  </div>
);


function App() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <WarningBanner />
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
