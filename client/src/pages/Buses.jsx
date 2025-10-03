import { useEffect, useState } from 'react';
import API from "../utils/API";

export default function Buses() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    API.get('/buses').then(res => {
      if(res.data.success) setBuses(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>All Buses</h2>
     <div className='flex '>
       {buses.map(bus => (
        <div key={bus._id}>
          <h3>{bus.name}</h3>
          <p>From: {bus.from} To: {bus.to}</p>
          <p>Seats: {bus.seats.filter(s => !s.isBooked).length} / {bus.totalSeats} available</p>
        </div>
      ))}
     </div>
    </div>
  );
}
