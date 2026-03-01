import React, { useState, useEffect } from 'react';
import '../styles/components/Header.css';

const Header = ({ title = 'Water Refilling POS' }) => {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setDateTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
      <p className="header__datetime">{dateTime}</p>
    </header>
  );
};

export default Header;
