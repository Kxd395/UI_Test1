'use client';

    import React, { useState } from 'react';
    import { FilterPanel } from './components/FilterPanel';

    function App() {
      const [filters, setFilters] = useState({});
      const [results, setResults] = useState([]);

      const handleFilterChange = (updatedFilters) => {
        setFilters(updatedFilters);
        fetchResults(updatedFilters);
      };

      const fetchResults = async (filters) => {
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filters),
        });
        const data = await response.json();
        setResults(data);
      };

      const resetFilters = () => {
        setFilters({});
        setResults([]);
      };

      return (
        <div className="flex">
          <FilterPanel 
            onFilterChange={handleFilterChange} 
            onFilterClick={() => {}}
            setInput={() => {}} 
            onReset={resetFilters}
          />
          <div className="flex-grow p-4">
            <h2 className="text-xl font-bold">Results</h2>
            <div>
              {results.map((result) => (
                <div key={result.id} className="p-2 border-b">
                  {result.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    export default App;
