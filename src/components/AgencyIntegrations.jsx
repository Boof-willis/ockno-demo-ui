import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Link, 
  Unlink, 
  ExternalLink, 
  RotateCw 
} from 'lucide-react';

/**
 * @typedef {"CRM" | "ADS_ANALYTICS"} IntegrationCategory
 * @typedef {"connected" | "not_connected" | "error" | "coming_soon"} IntegrationStatus
 * 
 * @typedef {Object} IntegrationDefinition
 * @property {string} id
 * @property {string} name
 * @property {IntegrationCategory} category
 * @property {string} description
 * @property {IntegrationStatus} status
 * @property {string} [lastSyncedAt]
 */

const MOCK_INTEGRATIONS = [
  // CRMs
  { id: 'ghl', name: 'HighLevel', category: 'CRM', description: 'Sync sub-accounts, leads, and offline events from HighLevel.', status: 'connected', lastSyncedAt: '15 mins ago' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Import contacts and companies from your HubSpot account.', status: 'not_connected' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', description: 'Connect Salesforce to sync opportunities and revenue data.', status: 'not_connected' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', description: 'Sync deals and persons from Pipedrive CRM.', status: 'coming_soon' },
  { id: 'zoho', name: 'Zoho CRM', category: 'CRM', description: 'Connect Zoho CRM to import leads and contacts.', status: 'coming_soon' },

  // Ad & Analytics
  { id: 'google-ads', name: 'Google Ads', category: 'ADS_ANALYTICS', description: 'Import campaigns, ad groups, and spend from Google Ads.', status: 'connected', lastSyncedAt: '1 hour ago' },
  { id: 'meta-ads', name: 'Meta Ads', category: 'ADS_ANALYTICS', description: 'Connect Facebook & Instagram ad accounts for attribution.', status: 'not_connected' },
  { id: 'tiktok-ads', name: 'TikTok Ads', category: 'ADS_ANALYTICS', description: 'Sync campaign performance data from TikTok Ads Manager.', status: 'coming_soon' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', category: 'ADS_ANALYTICS', description: 'Import spend and conversions from LinkedIn Campaign Manager.', status: 'error', lastSyncedAt: '2 days ago' },
  { id: 'microsoft-ads', name: 'Microsoft Advertising', category: 'ADS_ANALYTICS', description: 'Connect Bing Ads for search campaign attribution.', status: 'coming_soon' },
  { id: 'ga4', name: 'Google Analytics 4', category: 'ADS_ANALYTICS', description: 'Sync web events and conversions from your GA4 property.', status: 'not_connected' },
  { id: 'webhooks', name: 'Webhooks', category: 'ADS_ANALYTICS', description: 'Receive custom events via incoming webhooks.', status: 'coming_soon' },
];

const AgencyIntegrations = () => {
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS);

  const handleConnect = (id) => {
    // TODO: Implement real OAuth/API flow
    console.log(`Connecting integration: ${id}`);
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'connected', lastSyncedAt: 'Just now' } 
        : integration
    ));
  };

  const handleManage = (id) => {
    // TODO: Navigate to specific integration settings page
    console.log(`Managing integration: ${id}`);
  };

  const handleReconnect = (id) => {
    // TODO: Trigger re-authentication flow
    console.log(`Reconnecting integration: ${id}`);
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'connected', lastSyncedAt: 'Just now' } 
        : integration
    ));
  };

  const crmIntegrations = integrations.filter(i => i.category === 'CRM');
  const adIntegrations = integrations.filter(i => i.category === 'ADS_ANALYTICS');

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* 3.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
          <p className="text-slate-500 mt-1">Connect CRMs and ad platforms at the agency level to power Ockno across your clients.</p>
        </div>
        <div>
           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
             Agency-level configuration
           </span>
        </div>
      </div>

      {/* 3.2 Optional Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Connected Integrations</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{connectedCount}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <Link size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Last Sync Status</p>
            <p className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
              <CheckCircle size={14} /> All systems operational
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <RotateCw size={20} />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          Agency-level integrations feed data into all active client profiles in Ockno. 
          Client selection is managed separately on the Clients page.
        </p>
      </div>

      {/* 4.1 CRMs Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">CRMs</h2>
          <p className="text-sm text-slate-500">Connect your CRM to import client accounts, leads, and offline events into Ockno.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {crmIntegrations.map(integration => (
            <IntegrationCard 
              key={integration.id} 
              integration={integration} 
              onConnectClick={handleConnect}
              onManageClick={handleManage}
              onReconnectClick={handleReconnect}
            />
          ))}
        </div>
      </section>

      {/* 4.2 Ad & Analytics Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Ad & Analytics Platforms</h2>
          <p className="text-sm text-slate-500">Connect ad and analytics platforms to attribute spend, clicks, and conversions across your clients.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {adIntegrations.map(integration => (
            <IntegrationCard 
              key={integration.id} 
              integration={integration} 
              onConnectClick={handleConnect}
              onManageClick={handleManage}
              onReconnectClick={handleReconnect}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const IntegrationCard = ({ integration, onConnectClick, onManageClick, onReconnectClick }) => {
  const { id, name, description, status, lastSyncedAt } = integration;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Placeholder Icon */}
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
             {name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 leading-tight">{name}</h3>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-6 flex-1 leading-relaxed">
        {description}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100">
        {status === 'connected' && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Last synced</span>
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Clock size={12} /> {lastSyncedAt || 'Unknown'}
              </span>
            </div>
            <button 
              onClick={() => onManageClick && onManageClick(id)}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Manage
            </button>
          </div>
        )}

        {status === 'not_connected' && (
          <button 
            onClick={() => onConnectClick && onConnectClick(id)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            Connect
          </button>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
              <AlertCircle size={14} />
              <span>Authentication error. Please reconnect.</span>
            </div>
            <button 
              onClick={() => onReconnectClick && onReconnectClick(id)}
              className="w-full px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            >
              Reconnect
            </button>
          </div>
        )}

        {status === 'coming_soon' && (
          <button 
            disabled
            className="w-full px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed border border-transparent"
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    connected: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    not_connected: 'text-slate-500 bg-slate-50 border-slate-100',
    error: 'text-red-700 bg-red-50 border-red-100',
    coming_soon: 'text-amber-700 bg-amber-50 border-amber-100',
  };

  const labels = {
    connected: 'Connected',
    not_connected: 'Not Connected',
    error: 'Error',
    coming_soon: 'Coming Soon',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border mt-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default AgencyIntegrations;

