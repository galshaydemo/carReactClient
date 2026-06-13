import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { MdLogout } from 'react-icons/md';

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [reporting, setReporting] = useState(null);
  const { user, logout } = useAuth();

  async function load() {
    try {
      setCars(await api.getCars());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function reportParking(carId) {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device/browser.');
      return;
    }
    setReporting(carId);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.reportParking(carId, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          await load();
        } catch (err) {
          setError(err.message);
        } finally {
          setReporting(null);
        }
      },
      (err) => {
        setError(`Could not get location: ${err.message}`);
        setReporting(null);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Family Car Manager</h1>
        <div>
          <span>Hi, {user?.name}</span>
          
        </div>
      </header>
      <div className="routing">
        <Link to="/carslist" className='link-btn'>
        מכוניות
        </Link>
        <Link to="/driverslist" className='link-btn'>
        נהגים
                </Link>
        <Link to="/change-password" className="link-btn">
            שינוי סיסמא
          </Link>
          <button onClick={logout} className="link-btn">
            Log out
            <MdLogout/>
          </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="car-grid">
        {cars.map((car) => (
          <div key={car.id} className="card">
            <h2>{car.name}</h2>
            <p className="plate">{car.plate}</p>
            <p>Odometer: {car.current_km.toLocaleString()} km</p>
            <p>
              Since last service: {car.km_since_service.toLocaleString()} km
              {car.service_due ? (
                <span className="badge badge-due"> SERVICE DUE</span>
              ) : (
                <span className="badge"> {car.km_remaining.toLocaleString()} km left</span>
              )}
            </p>
            {car.last_parking ? (
              <p className="muted">
                Last parked: {new Date(car.last_parking.created_at + 'Z').toLocaleString()}
              </p>
            ) : (
              <p className="muted">No parking location reported yet</p>
            )}
            <div className="actions">
              <button onClick={() => reportParking(car.id)} disabled={reporting === car.id}>
                {reporting === car.id ? 'Getting location...' : 'Report parking location'}
              </button>
              <Link to={`/cars/${car.id}`}>
                <button className="secondary">Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
