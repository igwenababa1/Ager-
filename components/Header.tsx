
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100">
        <span className="text-brand-primary">Aegis-Core</span> C2 Dashboard
      </h1>
      <p className="text-sm text-brand-secondary mt-1">
        Modular Surveillance Framework for Red Team Operations
      </p>
    </header>
  );
};

export default Header;
