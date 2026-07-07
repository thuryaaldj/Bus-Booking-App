import { useState, useMemo } from 'react';

const EMPTY_TRIPS = [];

export function useFilteredTrips(trips = EMPTY_TRIPS) {
  const safeTrips = useMemo(() => (Array.isArray(trips) ? trips : EMPTY_TRIPS), [trips]);

  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const filteredTrips = useMemo(() => {
    return safeTrips.filter(trip => {
      const tripPrice = Number(trip.price);
      const maxPrice = Number(selectedPrice);

      return (
        (!selectedFrom || String(trip.fromDestination) === selectedFrom) &&
        (!selectedTo || String(trip.toDestination) === selectedTo) &&
        (!selectedPrice || tripPrice <= maxPrice)
      );
    });
  }, [safeTrips, selectedFrom, selectedTo, selectedPrice]);

  const fromOptions = useMemo(() => 
    [...new Set(safeTrips.map(trip => trip.fromDestination).filter(Boolean).map(String))].sort()
  , [safeTrips]);
  
  const toOptions = useMemo(() => 
    [...new Set(safeTrips.map(trip => trip.toDestination).filter(Boolean).map(String))].sort()
  , [safeTrips]);
  
  const priceOptions = useMemo(() => 
    [...new Set(safeTrips.map(trip => Number(trip.price)).filter(Number.isFinite))].sort((a, b) => a - b)
  , [safeTrips]);

  const clearFilters = () => {
    setSelectedFrom('');
    setSelectedTo('');
    setSelectedPrice('');
  };

  return {
    trips: filteredTrips,
    selectedFrom, setSelectedFrom,
    selectedTo, setSelectedTo,
    selectedPrice, setSelectedPrice,
    clearFilters,
    fromOptions, toOptions, priceOptions,
  };
}
