import React, { useState } from 'react';
import { 
  Plug, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Link2,
  Database,
  Megaphone,
  ArrowRight
} from 'lucide-react';

// Mock Data for Available Agency Integrations (Parent Sources)
const AVAILABLE_INTEGRATIONS = [
  { id: 'ghl', name: 'HighLevel', category: 'CRM', status: 'connected', icon: Database },
  { id: 'google-ads', name: 'Google Ads', category: 'ADS', status: 'connected', icon: Megaphone },
  { id: 'meta-ads', name: 'Meta Ads', category: 'ADS', status: 'connected', icon: Megaphone },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', status: 'not_connected', icon: Database },
];

// Mock Data for Accounts/Locations inside connected platforms
const PLATFORM_ACCOUNTS = {
  'ghl': [
    { id: 'ghl_1', name: 'Acme Corp - Main Location' },
    { id: 'ghl_2', name: 'Acme Corp - East Branch' },
    { id: 'ghl_3', name: 'Beta Industries HQ' },
  ],
  'google-ads': [
    { id: 'ga_1', name: 'Acme Corp (123-456-7890)' },
    { id: 'ga_2', name: 'Beta Ads (987-654-3210)' },
  ],
  'meta-ads': [
    { id: 'ma_1', name: 'Acme Facebook Page' },
    { id: 'ma_2', name: 'Acme Instagram' },
  ],
};

// Mock Initial Client Mappings (What this client is already linked to)
const INITIAL_CLIENT_MAPPINGS = {
  'ghl': 'ghl_1',        // Mapped to Acme Corp - Main Location
  'google-ads': null,    // Not mapped yet
  'meta-ads': ['ma_1'],  // Mapped to one account (array for multi-select platforms)
};

const ClientIntegrations = ({ client }) => {
  // Local state for mappings
  const [mappings, setMappings] = useState(INITIAL_CLIENT_MAPPINGS);

  const handleMappingChange = (platformId, accountId) => {
    setMappings(prev => ({
      ...prev,
      [platformId]: accountId
    }));
  };

  const handleMultiSelectChange = (platformId, accountId) => {
    setMappings(prev => {
      const current = prev[platformId] || [];
      if (current.includes(accountId)) {
        return { ...prev, [platformId]: current.filter(id => id !== accountId) };
      } else {
        return { ...prev, [platformId]: [...current, accountId] };
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integrations for {client.name}</h1>
        <p className="text-slate-500 mt-1">
          Map agency-level connections to specific accounts for this client.
        </p>
      </div>

      {/* CRMs Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Database size={20} className="text-indigo-600" />
          CRM Connection
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          {AVAILABLE_INTEGRATIONS.filter(i => i.category === 'CRM').map(platform => (
            <IntegrationMappingRow 
              key={platform.id}
              platform={platform}
              accounts={PLATFORM_ACCOUNTS[platform.id]}
              selected={mappings[platform.id]}
              onChange={(val) => handleMappingChange(platform.id, val)}
              type="single"
            />
          ))}
        </div>
      </section>

      {/* Ad Platforms Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Megaphone size={20} className="text-emerald-600" />
          Ad Accounts
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          {AVAILABLE_INTEGRATIONS.filter(i => i.category === 'ADS').map(platform => (
            <IntegrationMappingRow 
              key={platform.id}
              platform={platform}
              accounts={PLATFORM_ACCOUNTS[platform.id]}
              selected={mappings[platform.id]}
              onChange={(val) => platform.id === 'meta-ads' ? handleMultiSelectChange(platform.id, val) : handleMappingChange(platform.id, val)}
              type={platform.id === 'meta-ads' ? 'multi' : 'single'} // Example: Meta allows multiple, Google single
            />
          ))}
        </div>
      </section>

      {/* Helper Box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3">
        <div className="p-2 bg-white rounded-full shadow-sm text-indigo-600 shrink-0">
          <Link2 size={18} />
        </div>
        <div>
          <h4 className="font-medium text-indigo-900 text-sm">Need a new connection?</h4>
          <p className="text-sm text-indigo-700 mt-1">
            To add a new CRM or Ad Platform integration, switch to the <strong>Agency Overview</strong> and go to the Integrations page.
          </p>
        </div>
      </div>
    </div>
  );
};

const IntegrationMappingRow = ({ platform, accounts, selected, onChange, type }) => {
  const isConnected = platform.status === 'connected';

  return (
    <div className="p-6 flex flex-col sm:flex-row sm:items-start gap-6">
      {/* Icon & Info */}
      <div className="flex items-start gap-4 sm:w-1/3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isConnected ? 'bg-gray-100 text-slate-700' : 'bg-gray-50 text-gray-400'}`}>
          <platform.icon size={20} />
        </div>
        <div>
          <h3 className="font-medium text-slate-900">{platform.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
            <span className="text-xs text-slate-500">{isConnected ? 'Agency Connected' : 'Not Connected'}</span>
          </div>
        </div>
      </div>

      {/* Mapping Selector */}
      <div className="flex-1">
        {!isConnected ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 italic bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
            <AlertCircle size={14} />
            Connect this platform in Agency Settings first.
          </div>
        ) : !accounts || accounts.length === 0 ? (
          <div className="text-sm text-slate-500 italic">No accounts found to link.</div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Select account for this client:</p>
            
            {type === 'single' ? (
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  value={selected || ''}
                  onChange={(e) => onChange(e.target.value || null)}
                >
                  <option value="">-- Select Account --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2 border border-gray-200 rounded-md p-3 bg-gray-50/50 max-h-40 overflow-y-auto">
                {accounts.map(acc => {
                  const isSelected = Array.isArray(selected) && selected.includes(acc.id);
                  return (
                    <label key={acc.id} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded cursor-pointer hover:border-indigo-300 transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        checked={isSelected}
                        onChange={() => onChange(acc.id)}
                      />
                      <span className={`text-sm ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>
                        {acc.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientIntegrations;

