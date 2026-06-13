import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { MdAddCircle, MdCancel, MdDeleteForever,MdEditSquare, MdSave,MdHome  } from "react-icons/md";
import { Link } from 'react-router-dom';
type Car = {
  id: number;
  name: string;
  plate: string;
  current_km: string;
} 
export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState('');   
  const [carError, setCarError] = useState('');
  const [newCar, setNewCar] = useState<Car>({ id: 0, name: '', plate: '', current_km: '' });
  const [editStatus,setEditStatus]=useState(false)  
  const [newStatus,setNewStatus]=useState(false)  
  

  async function loadCars() {
    try {
      setCars(await api.getCars());
    } catch (err:any) {
      setCarError(err.message);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);
  async function handleDeleteCar(id:number) {
    setCarError('');
    try {
      await api.deleteCar(id);
      await loadCars();
    } catch (err:any) {
      setCarError(err.message);
    }
  }

  async function handleAddCar(e: React.FormEvent) {
    e.preventDefault();
    setCarError('');
    try {
      await api.addCar({
        name: newCar.name,
        plate: newCar.plate,
        current_km: newCar.current_km ? Number(newCar.current_km) : 0,
      });
      setNewCar({ id:-1,name: '', plate: '', current_km: '' });
      await loadCars();
    } catch (err:any) {
      setCarError(err.message);
    }
  }
  async function handleEditCar(e: React.FormEvent) {
    e.preventDefault();
    setCarError('');
    try {
      await api.updateCar(newCar.id, { name: newCar.name, plate: newCar.plate });
      setEditStatus(false);
      setNewCar({ id:0,name: '', plate: '', current_km: '' });
      await loadCars();
    } catch (err:any) {
      setCarError(err.message);
    }
  }
  return <div className="page">
      <header className="topbar"></header>
  <section className="card">
        
        <div className="title"> 
        <h2>Cars</h2>
          <Link to="/">
        <MdHome size={20}/>
        </Link>  
        </div>
        {carError && <p className="error">{carError}</p>}
        <ul className="list">
          {cars.map((car) => (
            <li key={car.id}>
              {car.name} ({car.plate || 'no plate'})
              <div className="command">
              <button type="button" className="secondary danger"  onClick={() => handleDeleteCar(car.id)}>
                Delete
                <MdDeleteForever/>
              </button>
              <button type="button" className="secondary" onClick={() => {setNewStatus(!newStatus);setNewCar({ id:-1,name: '', plate: '', current_km: '' });}}>
                Add
                <MdAddCircle color='blue'/>
              </button>
              <button  type="button" className="secondary"  onClick={() => {setEditStatus(!editStatus);
                
                setNewCar({ id : car.id,name: car.name, plate: car.plate, current_km:car.current_km});}}>
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
                <form  onSubmit={handleAddCar} className="form-grid">
        
          <label>
            Car name
            <input
              value={newCar.name}
              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
              required
            />
          </label>
          <label>
            Car number / plate
            <input value={newCar.plate} onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })} />
          </label>
          <label>
            Starting odometer (km)
            <input
              type="number"
              value={newCar.current_km}
              onChange={(e) => setNewCar({ ...newCar, current_km: e.target.value })}
            />
          </label>
          <div className="form-button">
          <button type="submit">Save
            <MdSave/>
          </button>
          <button type="button" onClick={() => setNewStatus(false)}>Cancel
            <MdCancel/>
          </button>
          </div>
        </form>
        </div>
        </div>
      }
    {editStatus &&
    <div className="modal-overlay">
    <div className="modal-content">
        <form  onSubmit={handleEditCar} className="form-grid">
          <label>
            Car name
            <input
              value={newCar.name}
              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
              required
            />
          </label>
          <label>
            Car number / plate
            <input value={newCar.plate} onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })} />
          </label>
          <div  className='form-button'>
          <button type="submit">Save
            <MdSave/>
          </button>
          <button type="button" onClick={() => setEditStatus(false)}>Cancel
            <MdCancel/>
          </button>
          </div>

        </form>
        </div>
        </div>
      }
      
      </section>
    </div>
}