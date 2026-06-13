import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Settings() {
 
  

  
  

  
  return (
    <div className="page">
      <header className="topbar">
        <h1>Settings</h1>
        <Link to="/">
          <button className="secondary">Back</button>
        </Link>
        <Link to="/carslist">
          <button className="secondary">מכוניות</button>
        </Link>
        <Link to="/driverslist">
          <button className="secondary">נהגים</button>
        </Link>
      </header>
      </div>
  );
}
