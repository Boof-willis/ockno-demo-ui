import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Eye, 
  Users, 
  ArrowRight,
  Filter,
  Calendar
} from 'lucide-react';

// Mock Data
const CLIENT_KPI_DATA = [
  { label: 'Total Spend', value: '$12,450', delta: '+8.5%', isPositive: true, icon: DollarSign },
  { label: 'Impressions', value: '845.2k', delta: '+12.3%', isPositive: true, icon: Eye },
  { label: 'Clicks', value: '24.1k', delta: '+5.2%', isPositive: true, icon: MousePointer },
  { label: 'Leads', value: '482', delta: '-2.4%', isPositive: false, icon: Users },
  { label: 'Cost per Lead', value: '$25.83', delta: '+1.2%', isPositive: false, icon: TrendingUp }, // Higher CPL is usually "negative" but context depends
  { label: 'ROAS', value: '3.8x', delta: '+0.4x', isPositive: true, icon: TrendingUp },
];

const CAMPAIGN_DATA = [
  { id: 1, name: 'Retargeting - FB', status: 'Active', spend: '$4,200', leads: 145, cpl: '$28.96', roas: '4.2x' },
  { id: 2, name: 'Search - Brand', status: 'Active', spend: '$3,150', leads: 180, cpl: '$17.50', roas: '5.1x' },
  { id: 3, name: 'YouTube Awareness', status: 'Paused', spend: '$1,800', leads: 42, cpl: '$42.85', roas: '1.8x' },
  { id: 4, name: 'Competitor Search', status: 'Active', spend: '$2,400', leads: 85, cpl: '$28.23', roas: '2.9x' },
  { id: 5, name: 'Instagram Story', status: 'Active', spend: '$900', leads: 30, cpl: '$30.00', roas: '3.5x' },
];

const ClientDashboard = ({ client }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{client.name} Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of performance, funnel metrics, and active campaigns.</p>
        </div>
        
        {/* Date Range & Filters Stub */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-slate-700 hover:bg-gray-50">
            <Calendar size={16} className="text-slate-500" />
            <span>Last 30 Days</span>
          </button>
          <button className="p-2 bg-white border border-gray-300 rounded-md text-slate-500 hover:bg-gray-50 hover:text-slate-700">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {CLIENT_KPI_DATA.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Funnel Performance</h3>
            <span className="text-xs font-medium text-slate-500">Conversion Rate</span>
          </div>
          <div className="space-y-4">
             <FunnelStep label="Impressions" value="845k" percent="100%" color="bg-indigo-100" />
             <FunnelStep label="Clicks" value="24k" percent="2.8%" color="bg-indigo-200" sublabel="CTR" />
             <FunnelStep label="Leads" value="482" percent="2.0%" color="bg-indigo-400" sublabel="Conv. Rate" />
             <FunnelStep label="Sales" value="86" percent="17.8%" color="bg-indigo-600" sublabel="Close Rate" />
          </div>
        </div>

        {/* Revenue Trend Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Current
               </div>
               <div className="flex items-center gap-1 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div> Previous
               </div>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-2 h-64 w-full pt-4 border-b border-gray-100 relative">
             {/* Mock Bar/Line Chart visual */}
             {[40, 65, 50, 80, 75, 90, 100, 85, 70, 95, 110, 105].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-50 hover:bg-indigo-100 rounded-t-sm relative group transition-colors" style={{ height: `${h}%` }}>
                   <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500" style={{ height: `${h * 0.7}%` }}></div>
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      ${(h * 120).toLocaleString()}
                   </div>
                </div>
             ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
             <span>Day 1</span>
             <span>Day 15</span>
             <span>Day 30</span>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Top Campaigns</h3>
            <p className="text-sm text-slate-500">Performance by source and campaign.</p>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
             View All Campaigns <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gray-50 text-slate-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Campaign Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Spend</th>
                <th className="px-6 py-3">Leads</th>
                <th className="px-6 py-3">Cost / Lead</th>
                <th className="px-6 py-3">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CAMPAIGN_DATA.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{campaign.spend}</td>
                  <td className="px-6 py-4">{campaign.leads}</td>
                  <td className="px-6 py-4">{campaign.cpl}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{campaign.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, delta, isPositive, icon: Icon }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
       <p className="text-sm font-medium text-slate-500">{label}</p>
       <div className="p-2 bg-gray-50 rounded-lg text-slate-400">
          <Icon size={16} />
       </div>
    </div>
    <div>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{delta}</span>
        <span className="text-slate-400 font-normal ml-1">vs last 30d</span>
      </div>
    </div>
  </div>
);

const FunnelStep = ({ label, value, percent, color, sublabel }) => (
   <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-slate-600">{label}</div>
      <div className="flex-1 h-8 bg-gray-50 rounded-r-md relative flex items-center">
         <div 
            className={`h-full rounded-r-md ${color} flex items-center px-3 text-xs font-semibold text-slate-800 whitespace-nowrap transition-all duration-1000`} 
            style={{ width: percent }}
         >
         </div>
         <span className="ml-3 text-sm font-bold text-slate-900 absolute right-full mr-[-100%] pl-4 z-10">
            {value}
         </span>
      </div>
      <div className="w-20 text-right text-xs text-slate-500">
         <div className="font-medium">{percent}</div>
         {sublabel && <div className="text-[10px] uppercase tracking-wide opacity-70">{sublabel}</div>}
      </div>
   </div>
);

export default ClientDashboard;

