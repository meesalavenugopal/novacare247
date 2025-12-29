import React, { useEffect, useState } from 'react';
import { branchesAPI } from '../services/api';
import { MapPin, Map } from 'lucide-react';

const AllBranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    branchesAPI.getAll()
      .then(res => setBranches(res.data))
      .catch(() => setError('Failed to load branches'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Branches</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {branches.map(branch => {
          const mapsQuery = encodeURIComponent(
            `${branch.address || ''}, ${branch.city || ''}, ${branch.state || ''}`.replace(/, +/g, ', ').trim()
          );
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
          return (
            <div key={branch.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <MapPin className="text-primary-400 mb-2" size={32} />
              <div className="text-lg font-semibold text-gray-900 mb-1">{branch.name}</div>
              <div className="text-gray-600 text-sm mb-1">{branch.address}</div>
              <div className="text-gray-500 text-xs mb-1">{branch.city}, {branch.state}</div>
              <div className="text-gray-400 text-xs mb-2">{branch.phone}</div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-700 text-xs font-medium border border-primary-200 rounded px-2 py-1 mt-1 transition-colors"
                title={`Open ${branch.name} in Google Maps`}
              >
                Open in Google Maps
                <Map className="h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AllBranchesPage;
