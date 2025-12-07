import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Mock Data
/**
 * @typedef {Object} AgencyClientSummary
 * @property {string} id
 * @property {string} name
 * @property {number} connectedSources
 * @property {number} spend
 * @property {number} leads
 * @property {number} revenue
 * @property {number} roas
 * @property {number} attributionCoverage
 * @property {string} status - "OK" | "Warning" | "Broken"
 */

const KPI_DATA = [
  { label: 'Total Spend', value: '$123,456', delta: '+12% vs last month', isPositive: true },
  { label: 'Total Leads', value: '4,321', delta: '+5% vs last month', isPositive: true },
  { label: 'Total Revenue', value: '$456,789', delta: '+8% vs last month', isPositive: true },
  { label: 'Blended ROAS', value: '3.7x', delta: '-2% vs last month', isPositive: false },
  { label: 'Attribution Coverage', value: '82%', delta: '+1% vs last month', isPositive: true },
];

const CLIENT_DATA = [
  { id: '1', name: 'Acme Corp', connectedSources: 4, spend: 12500, leads: 450, revenue: 42000, roas: 3.36, attributionCoverage: 85, status: 'OK' },
  { id: '2', name: 'Beta Industries', connectedSources: 2, spend: 5400, leads: 120, revenue: 15000, roas: 2.78, attributionCoverage: 60, status: 'Warning' },
  { id: '3', name: 'Gamma Services', connectedSources: 5, spend: 28000, leads: 980, revenue: 110000, roas: 3.93, attributionCoverage: 92, status: 'OK' },
  { id: '4', name: 'Delta Dynamics', connectedSources: 3, spend: 8200, leads: 210, revenue: 24000, roas: 2.93, attributionCoverage: 75, status: 'Broken' },
  { id: '5', name: 'Epsilon Edge', connectedSources: 4, spend: 15000, leads: 520, revenue: 60000, roas: 4.0, attributionCoverage: 88, status: 'OK' },
];

const AgencyDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 2.1 Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agency Overview</h1>
          <p className="text-slate-500 mt-1">Blended performance across all client profiles</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white shadow-sm">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Today</option>
            <option>Custom...</option>
          </select>
        </div>
      </div>

      {/* 3. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {KPI_DATA.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* 4. Client Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-slate-900">Client Performance</h3>
          <p className="text-sm text-slate-500">High-level metrics aggregated by client profile.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gray-50 text-slate-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Connected Sources</th>
                <th className="px-6 py-3">Spend</th>
                <th className="px-6 py-3">Leads</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">ROAS</th>
                <th className="px-6 py-3">Attr. Coverage</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CLIENT_DATA.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                  <td className="px-6 py-4">{client.connectedSources}</td>
                  <td className="px-6 py-4">${client.spend.toLocaleString()}</td>
                  <td className="px-6 py-4">{client.leads.toLocaleString()}</td>
                  <td className="px-6 py-4">${client.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium">{client.roas.toFixed(2)}x</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${client.attributionCoverage > 80 ? 'bg-emerald-500' : client.attributionCoverage > 50 ? 'bg-amber-400' : 'bg-red-500'}`} 
                          style={{ width: `${client.attributionCoverage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{client.attributionCoverage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={client.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking & Integration Health - Extra Section Requested in Prompt context but not detailed in specs deeply, adding a simple placeholder/summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-900">Integration Health</h3>
               <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">1 Issue</span>
            </div>
            <div className="space-y-3">
               <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-sm font-medium text-red-900">Delta Dynamics: Facebook Ads Token Expired</p>
                     <p className="text-xs text-red-700 mt-1">Last sync failed 2 hours ago. Re-connect required.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 opacity-70">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-sm font-medium text-slate-700">All other integrations active</p>
                     <p className="text-xs text-slate-500 mt-1">54 connections healthy.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-900">Unattributed Leads</h3>
               <span className="text-xs text-slate-500">Last 7 Days</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
               <span className="text-3xl font-bold text-slate-900">142</span>
               <span className="text-sm text-slate-500 mb-1">leads missing source</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden">
               <div className="bg-amber-400 h-full w-[12%]"></div>
            </div>
            <p className="text-sm text-slate-600">
               12% of total leads are currently unattributed. 
               <a href="#" className="text-indigo-600 font-medium hover:underline ml-1">Review breakdown</a>
            </p>
         </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, delta, isPositive }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <div className="mt-2">
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      {delta && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{delta}</span>
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'OK': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Warning': 'bg-amber-100 text-amber-700 border-amber-200',
    'Broken': 'bg-red-100 text-red-700 border-red-200',
  };

  const icons = {
    'OK': <CheckCircle size={12} />,
    'Warning': <AlertCircle size={12} />,
    'Broken': <XCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles['OK']}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default AgencyDashboard;

