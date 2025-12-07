import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Monitor, 
  Globe, 
  CloudOff, 
  Plus, 
  ToggleRight, 
  ToggleLeft 
} from 'lucide-react';

const CLIENT_PROFILE_LIMIT = 10;

const AgencyClients = ({ clients, onToggleActive }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const activeCount = clients.filter(c => c.isActiveInOckno).length;
  const ghlCount = clients.filter(c => c.source === 'GHL').length;

  const handleToggleOcknoStatus = (clientId) => {
    // Find the client to check limits before toggling
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (!client.isActiveInOckno && activeCount >= CLIENT_PROFILE_LIMIT) {
       alert("License limit reached. Upgrade to add more clients.");
       return;
    }

    onToggleActive(clientId);
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterStatus === 'All') return matchesSearch;
      if (filterStatus === 'Active in Ockno') return matchesSearch && client.isActiveInOckno;
      if (filterStatus === 'Not added') return matchesSearch && !client.isActiveInOckno;
      if (filterStatus === 'Disconnected') return matchesSearch && client.status === 'disconnected';
      
      return matchesSearch;
    });
  }, [clients, searchQuery, filterStatus]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 3.1 Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">Manage which client profiles are active in Ockno.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
             onClick={() => alert("Add new client modal would open here")}
           >
             <Plus size={16} />
             Add New Client
           </button>
        </div>
      </div>

      {/* 3.2 License Usage Card */}
      <LicenseUsageCard activeCount={activeCount} limit={CLIENT_PROFILE_LIMIT} />

      {/* 4. Clients Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* 3.3 Filters / Search */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Active in Ockno</option>
              <option>Not added</option>
              <option>Disconnected</option>
            </select>
          </div>
        </div>

        {/* 4.1 Table */}
        {clients.length === 0 ? (
          <div className="p-12 text-center">
             <p className="text-slate-500">No clients imported yet. Connect GoHighLevel or add clients to see them here.</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
             <p className="text-slate-500">No clients match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-gray-50 text-slate-900 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Last Synced</th>
                  <th className="px-6 py-3">Connection</th>
                  <th className="px-6 py-3">In Ockno</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{client.name}</p>
                        {client.domain && <p className="text-xs text-slate-400 mt-0.5">{client.domain}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {client.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {client.lastSyncedAt}
                    </td>
                    <td className="px-6 py-4">
                      <ConnectionStatusBadge status={client.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleOcknoStatus(client.id)}
                        disabled={!client.isActiveInOckno && activeCount >= CLIENT_PROFILE_LIMIT}
                        className={`
                          group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                          ${client.isActiveInOckno 
                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                            : activeCount >= CLIENT_PROFILE_LIMIT 
                              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                              : 'bg-white border border-gray-300 text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                          }
                        `}
                      >
                        {client.isActiveInOckno ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-indigo-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                            <span>{activeCount >= CLIENT_PROFILE_LIMIT ? 'Limit Reached' : 'Add to Ockno'}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const LicenseUsageCard = ({ activeCount, limit }) => {
  const percentage = Math.min((activeCount / limit) * 100, 100);
  const isLimitReached = activeCount >= limit;

  return (
    <div className={`
      p-5 rounded-xl border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6
      ${isLimitReached ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}
    `}>
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${isLimitReached ? 'text-amber-900' : 'text-slate-900'}`}>
            Standard License
          </h3>
          <span className={`text-sm font-medium ${isLimitReached ? 'text-amber-700' : 'text-slate-600'}`}>
            Using {activeCount} of {limit} client profiles
          </span>
        </div>
        
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isLimitReached ? 'bg-amber-500' : 'bg-indigo-600'}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {isLimitReached && (
          <p className="text-xs text-amber-700 mt-2 font-medium flex items-center gap-1.5">
            <AlertCircle size={14} />
            Limit reached. Upgrade your plan to add more client profiles.
          </p>
        )}
      </div>
    </div>
  );
};

const ConnectionStatusBadge = ({ status }) => {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle size={12} />
        Active
      </span>
    );
  }
  if (status === 'disconnected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
        <CloudOff size={12} />
        Disconnected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      <Globe size={12} />
      Available
    </span>
  );
};

export default AgencyClients;
