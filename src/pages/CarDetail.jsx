import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { api } from '../api';
import ParkingMap from '../components/ParkingMap';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [logs, setLogs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ date: today(), km: '', description: '', cost: '', is_service: false });
  const [editingCar, setEditingCar] = useState(false);
  const [carForm, setCarForm] = useState({ name: '', plate: '' });

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  async function load() {
    try {
      const [carData, logData, locData] = await Promise.all([
        api.getCar(id),
        api.getMaintenance(id),
        api.getParking(id),
      ]);
      setCar(carData);
      setLogs(logData);
      setLocations(locData);
      setForm((f) => ({ ...f, km: carData.current_km }));
      setCarForm({ name: carData.name, plate: carData.plate || '' });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.addMaintenance(id, {
        date: form.date,
        km: Number(form.km),
        description: form.description,
        cost: form.cost ? Number(form.cost) : null,
        is_service: form.is_service,
      });
      setForm((f) => ({ ...f, description: '', cost: '', is_service: false }));
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCarSave(e) {
    e.preventDefault();
    setError('');
    try {
      await api.updateCar(id, { name: carForm.name, plate: carForm.plate });
      setEditingCar(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!car) return <div className="page">{error || 'Loading...'}</div>;

  return (
    <div className="page">
      <header className="topbar">
        <h1>{car.name}</h1>
        <Link to="/">
          <button className="secondary">Back</button>
        </Link>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Status</h2>
        {editingCar ? (
          <form onSubmit={handleCarSave} className="form-grid">
            <label>
              Car name
              <input
                value={carForm.name}
                onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                required
              />
            </label>
            <label>
              Car number / plate
              <input
                value={carForm.plate}
                onChange={(e) => setCarForm({ ...carForm, plate: e.target.value })}
                required
              />
            </label>
            <div className="actions">
              <button type="submit">Save</button>
              <button type="button" className="secondary" onClick={() => setEditingCar(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>Plate: {car.plate}</p>
            <p>Odometer: {car.current_km.toLocaleString()} km</p>
            <p>Last service: {car.last_service_km.toLocaleString()} km on {car.last_service_date}</p>
            <p>Service interval: every {car.service_interval_km.toLocaleString()} km</p>
            <button className="secondary" onClick={() => setEditingCar(true)}>
              Edit car details
            </button>
          </>
        )}
      </section>

      <section className="card">
        <h2>Add maintenance / odometer entry</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>
          <label>
            Odometer (km)
            <input
              type="number"
              value={form.km}
              onChange={(e) => setForm({ ...form, km: e.target.value })}
              min={car.last_service_km}
              required
            />
          </label>
          <label className="full">
            Description
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Oil change, tire rotation"
              required
            />
          </label>
          <label>
            Cost (optional)
            <input
              type="number"
              step="0.01"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.is_service}
              onChange={(e) => setForm({ ...form, is_service: e.target.checked })}
            />
            This was a 10,000km service (resets the counter)
          </label>
          <button type="submit">Add entry</button>
        </form>
      </section>

      <section className="card">
        <h2>Parking history</h2>
        <ParkingMap locations={locations} />
        <ul className="list">
          {locations.map((loc) => (
            <li key={loc.id}>
              {new Date(loc.created_at + 'Z').toLocaleString()} - {loc.user_name} ({loc.lat.toFixed(5)},{' '}
              {loc.lng.toFixed(5)})
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Maintenance log</h2>
        <ul className="list">
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.date}</strong> - {log.description} @ {log.km.toLocaleString()} km
              {log.cost ? ` - $${log.cost.toFixed(2)}` : ''} - by {log.user_name}
              {log.is_service ? <span className="badge"> SERVICE</span> : null}
            </li>
          ))}
          {!logs.length && <li className="muted">No maintenance entries yet.</li>}
        </ul>
      </section>
    </div>
  );
}
