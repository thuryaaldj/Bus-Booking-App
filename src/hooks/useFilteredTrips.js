import { useState, useMemo } from 'react';

export function useFilteredTrips(trips = []) {
  const safeTrips = Array.isArray(trips) ? trips : [];

  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const filteredTrips = useMemo(() => {
    return safeTrips.filter(trip => {
      return (
        (!selectedFrom || trip.fromDestination === selectedFrom) &&
        (!selectedTo || trip.toDestination === selectedTo) &&
        (!selectedPrice || trip.price <= parseFloat(selectedPrice))
      );
    });
  }, [safeTrips, selectedFrom, selectedTo, selectedPrice]);

  const fromOptions = useMemo(() => 
    [...new Set(safeTrips.map(trip => trip.fromDestination))].filter(Boolean)
  , [safeTrips]);
  
  const toOptions = useMemo(() => 
    [...new Set(safeTrips.map(trip => trip.toDestination))].filter(Boolean)
  , [safeTrips]);
  
  const priceOptions = useMemo(() => 
    [...new Set(safeTrips.map(trip => trip.price))].sort((a, b) => a - b)
  , [safeTrips]);

  return {
    trips: filteredTrips,
    selectedFrom, setSelectedFrom,
    selectedTo, setSelectedTo,
    selectedPrice, setSelectedPrice,
    fromOptions, toOptions, priceOptions,
  };
}
