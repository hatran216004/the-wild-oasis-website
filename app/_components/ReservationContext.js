'use client';
import { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();
const initialState = { from: undefined, to: undefined };

// Component re-render => all client-component re-render
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);

  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

export default ReservationProvider;

export function useReservation() {
  const value = useContext(ReservationContext);
  if (!value) throw new Error('loi cmnr');
  return value;
}
