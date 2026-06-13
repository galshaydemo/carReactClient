

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { FaBeer } from "react-icons/fa";
import { MdAddCircle, MdCancel, MdDeleteForever,MdEditSquare, MdHome, MdSave  } from "react-icons/md";

type Driver = {
  id: number;
  name: string;
  username:string;
  password:string;
} 
export default function Drivers() {
  const [Drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState('');   
  const [newDriver, setNewDriver] = useState({id:0, name: '', username: '', password: 'password' });
  const [editStatus,setEditStatus]=useState(false)  
  const [newStatus,setNewStatus]=useState(false)  
  
  async function loadDrivers() {
    try {
      const t=await api.getDrivers();
      console.log(t)
      setDrivers(t);
    } catch (err:any) {
      setError(err.message);
    }
  }
  async function handleEditDriver(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.updateDriver(newDriver.id, { name: newDriver.name, username: newDriver.username,password:newDriver.password });
      setEditStatus(false);
      setNewDriver({ id:0,name: '', username: '',password:'password'});
      await loadDrivers();
    } catch (err:any) {
      setError(err.message);
    }
  }
  useEffect(() => {
    loadDrivers();
  }, []);
  async function handleAddDriver(e) {
      e.preventDefault();
      setError('');
      try {
        alert(JSON.stringify(newDriver))
        await api.addDriver(newDriver);
        setNewDriver({ id:-1,name: '', username: '', password: 'password' });
      } catch (err:any) {
        setError(err.message);
      }
    }
  
    async function handleDeleteDriver(id:number) {
      setError('');
      try {
        await api.deleteDriver(id);
        //await loadCarsAndDrivers();
      } catch (err:any) {
        setError(err.message);
      }
    }
  return <div className="page">
      <header className="topbar">
       
    </header>
    <section className="card">
        <div className="title"> 
          <h2>Drivers</h2>
          <Link to="/">
        <MdHome size={20}/>
        </Link>  
        </div>
        
        {error && <p className="error">{error}</p>}
        <ul className="list">
          {Drivers.map((driver) => (
            <li key={driver.id}>
              {driver.name} ({driver.username})
              <div className='command'>
              <button type="button" className="secondary danger"  onClick={() => handleDeleteDriver(driver.id)}>
                Delete
                <MdDeleteForever/>
              </button>
              <button type="button" className="secondary" onClick={() => {setNewStatus(!newStatus);
                setNewDriver({ id:-1,name: '', username: '',password:'password' });}}>
                Add
                <MdAddCircle color='blue'/>
              </button>
              <button  type="button" className="secondary"  onClick={() => {setEditStatus(!editStatus);
                
                setNewDriver({ id : driver.id,name: driver.name, username: driver.username,password:driver.password});}}>
                Edit
                <MdEditSquare color='blue'/>
              </button>
              </div>
            </li>
          ))}
        </ul>
        {newStatus &&
            <div className="modal-overlay">
            <div className="modal-content">
        <form onSubmit={handleAddDriver} className="form-grid">
          <label>
            Name
            <input
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              required
            />
          </label>
          <label>
            UserName
            <input value={newDriver.username} onChange={(e) => setNewDriver({ ...newDriver, username: e.target.value })} />
          </label>
          <div className="button-form">
          <button type="submit">Add Driver</button>
          <button type="button" onClick={()=>{setNewStatus(false)}}>Cancel</button>
          </div>
        </form>
        </div></div>
        }
        {editStatus &&
            <div className="modal-overlay">
            <div className="modal-content">
        <form onSubmit={handleEditDriver} className="form-grid">
          <label>
            Name
            <input
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              required
            />
          </label>
          <label>
            UserName
            <input value={newDriver.username} onChange={(e) => setNewDriver({ ...newDriver, username: e.target.value })} />
          </label>
          <div className="button-form">
          <button type="submit">Update Driver</button>
          <button type="button" onClick={()=>{setEditStatus(false)}}>Cancel</button>
          </div>
        </form>
        </div></div>
        }
      </section>
    </div>
}