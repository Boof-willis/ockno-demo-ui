import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Puzzle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  LogOut, 
  Settings, 
  CreditCard,
  Building2,
  Plus,
  Activity
} from 'lucide-react';

import AgencyDashboard from './components/AgencyDashboard';
import AgencyClients from './components/AgencyClients';
import AgencyIntegrations from './components/AgencyIntegrations';
import ClientDashboard from './components/ClientDashboard';
import ClientIntegrations from './components/ClientIntegrations';
import ClientContacts from './components/ClientContacts';
import ClientSignals from './components/ClientSignals';

// Mock Data for the selector (Lifted state)
const MOCK_IMPORTED_CLIENTS = [
  { id: '1', name: 'Acme Corp', source: 'GHL', domain: 'acme.com', lastSyncedAt: '2h ago', status: 'active', isActiveInOckno: true },
  { id: '2', name: 'Beta Industries', source: 'GHL', domain: 'beta-ind.com', lastSyncedAt: '4h ago', status: 'active', isActiveInOckno: true },
  { id: '3', name: 'Gamma Services', source: 'Manual', domain: 'gamma.net', lastSyncedAt: '1d ago', status: 'active', isActiveInOckno: true },
  { id: '4', name: 'Delta Dynamics', source: 'GHL', domain: 'delta.io', lastSyncedAt: '2d ago', status: 'disconnected', isActiveInOckno: true },
  { id: '5', name: 'Epsilon Edge', source: 'GHL', domain: 'epsilon.tech', lastSyncedAt: '5m ago', status: 'active', isActiveInOckno: true },
  { id: '6', name: 'Zeta Zone', source: 'GHL', domain: 'zeta.zone', lastSyncedAt: 'Available', status: 'available', isActiveInOckno: false },
  { id: '7', name: 'Eta Energy', source: 'GHL', domain: 'eta.energy', lastSyncedAt: 'Available', status: 'available', isActiveInOckno: false },
  { id: '8', name: 'Theta Therapeutics', source: 'Manual', domain: 'theta.med', lastSyncedAt: 'Available', status: 'active', isActiveInOckno: false },
  { id: '9', name: 'Iota Innovations', source: 'Other', domain: 'iota.ai', lastSyncedAt: 'Available', status: 'available', isActiveInOckno: false },
  { id: '10', name: 'Kappa Kitchens', source: 'GHL', domain: 'kappa.food', lastSyncedAt: 'Available', status: 'available', isActiveInOckno: false },
  { id: '11', name: 'Lambda Logistics', source: 'GHL', domain: 'lambda.log', lastSyncedAt: 'Available', status: 'disconnected', isActiveInOckno: false },
  { id: '12', name: 'Mu Manufacturing', source: 'GHL', domain: 'mu.mfg', lastSyncedAt: 'Available', status: 'available', isActiveInOckno: false },
];

const OcknoShell = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Null = Agency View
  const [activeAgencyView, setActiveAgencyView] = useState('dashboard'); // 'dashboard' | 'clients' | 'integrations' | 'contacts' | 'signals'
  const [searchQuery, setSearchQuery] = useState('');

  // State for clients now managed at shell level
  const [clients, setClients] = useState(MOCK_IMPORTED_CLIENTS);

  // Derived state for the sidebar dropdown
  const activeClients = clients.filter(c => c.isActiveInOckno);
  const filteredActiveClients = activeClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleClientActive = (clientId) => {
    setClients(prevClients => prevClients.map(client => {
      if (client.id !== clientId) return client;
      return { ...client, isActiveInOckno: !client.isActiveInOckno };
    }));
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setIsClientSelectorOpen(false);
    if (client) {
      setActiveAgencyView('dashboard'); // Reset to dashboard view when picking a client
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside 
        className={`
          relative flex flex-col h-full bg-white border-r border-gray-200 shadow-sm
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        
        {/* 1. LOGO AREA */}
        <div className="h-16 flex items-center px-6 border-b border-transparent">
          <div className="flex items-center gap-3">
            {/* Logo Mark */}
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            {/* Logo Text - Hides when collapsed */}
            <span className={`font-bold text-xl tracking-tight text-slate-900 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              Ockno
            </span>
          </div>
        </div>

        {/* 2. CLIENT SELECTOR (Context Switcher) */}
        <div className="px-3 py-4">
          <div className="relative">
            <button
              onClick={() => setIsClientSelectorOpen(!isClientSelectorOpen)}
              className={`
                w-full flex items-center rounded-md border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 transition-colors
                ${isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'}
              `}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {selectedClient ? (
                  <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">{selectedClient.name[0]}</span>
                  </div>
                ) : (
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                
                {!isCollapsed && (
                  <span className={`text-sm truncate ${selectedClient ? 'font-medium text-slate-700' : 'text-gray-500'}`}>
                    {selectedClient ? selectedClient.name : "Select Client..."}
                  </span>
                )}
              </div>
              
              {!isCollapsed && <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Dropdown Menu */}
            {isClientSelectorOpen && (
              <div className={`
                absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-1
                ${isCollapsed ? 'left-14 top-0' : ''} 
              `}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Switch Context
                </div>
                <button 
                  onClick={() => handleClientSelect(null)}
                  disabled={!selectedClient}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2
                    ${!selectedClient 
                      ? 'bg-gray-50 text-gray-400 cursor-default' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Building2 className="w-4 h-4" />
                  Agency Overview
                  {!selectedClient && <span className="ml-auto text-xs font-medium">Current</span>}
                </button>
                <div className="h-px bg-gray-100 my-1"></div>

                {/* Search Bar */}
                <div className="px-3 py-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                
                {/* Scrollable Client List (Max height for ~5 items) */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredActiveClients.length > 0 ? (
                    filteredActiveClients.map(client => (
                      <button 
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                      {client.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-gray-500">No clients found</div>
                  )}
                </div>

                {/* Footer Action: Add New Client */}
                <div className="h-px bg-gray-100 my-1"></div>
                <button 
                  onClick={() => {
                    setSelectedClient(null);
                    setActiveAgencyView('clients');
                    setIsClientSelectorOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add new client profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gray-200 mx-4 mb-4"></div>

        {/* 3. NAV ITEMS */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={activeAgencyView === 'dashboard'} 
            isCollapsed={isCollapsed} 
            onClick={() => {
              setActiveAgencyView('dashboard');
            }}
          />
          {!selectedClient && (
            <NavItem 
              icon={<Users size={20} />} 
              label="Clients" 
              isActive={!selectedClient && activeAgencyView === 'clients'} 
              isCollapsed={isCollapsed} 
              onClick={() => {
                setSelectedClient(null);
                setActiveAgencyView('clients');
              }}
            />
          )}
          {selectedClient && (
            <>
              <NavItem 
                icon={<Users size={20} />} 
                label="Contacts" 
                isActive={activeAgencyView === 'contacts'} 
                isCollapsed={isCollapsed} 
                onClick={() => {
                  setActiveAgencyView('contacts');
                }}
              />
              <NavItem 
                icon={<Activity size={20} />} 
                label="Signals" 
                isActive={activeAgencyView === 'signals'} 
                isCollapsed={isCollapsed} 
                onClick={() => {
                  setActiveAgencyView('signals');
                }}
              />
            </>
          )}
          <NavItem 
            icon={<Puzzle size={20} />} 
            label="Integrations"  
            isActive={activeAgencyView === 'integrations'} 
            isCollapsed={isCollapsed} 
            onClick={() => {
              setActiveAgencyView('integrations');
            }}
          />
        </nav>

        {/* 5. COLLAPSE TOGGLE */}
        <div className="px-3 py-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : (
              <div className="flex items-center gap-2 text-sm font-medium">
                <ChevronLeft size={20} />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gray-200 mx-4"></div>

        {/* 4. USER PROFILE AREA */}
        <div className="p-3 relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`
              flex items-center rounded-lg hover:bg-gray-50 transition-colors w-full
              ${isCollapsed ? 'justify-center p-1' : 'p-2 gap-3'}
            `}
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-medium shrink-0">
              SR
            </div>

            {/* User Info */}
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700 leading-none">Spencer R.</p>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">spencer@ockno.com</p>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            )}
          </button>

          {/* User Menu Popup */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-3 mb-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-medium text-slate-800">Spencer Roberts</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <CreditCard size={16} /> Billing
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">
        {!selectedClient ? (
          activeAgencyView === 'clients' ? (
            <AgencyClients clients={clients} onToggleActive={handleToggleClientActive} />
          ) : activeAgencyView === 'integrations' ? (
             <AgencyIntegrations />
          ) : (
            <AgencyDashboard />
          )
        ) : (
          activeAgencyView === 'integrations' ? (
            <ClientIntegrations client={selectedClient} />
          ) : activeAgencyView === 'contacts' ? (
            <ClientContacts client={selectedClient} />
          ) : activeAgencyView === 'signals' ? (
            <ClientSignals client={selectedClient} />
          ) : (
            <ClientDashboard client={selectedClient} />
          )
        )}
      </main>
    </div>
  );
};

// Reusable Nav Item Component
const NavItem = ({ icon, label, isActive, isCollapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center w-full rounded-md transition-all duration-200 relative
        ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2 gap-3'}
        ${isActive 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'}
      `}
    >
      {/* Icon */}
      <span className={`${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
        {icon}
      </span>

      {/* Label */}
      {!isCollapsed && (
        <span className="text-sm font-medium whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Tooltip for Collapsed State */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
          {label}
        </div>
      )}
    </button>
  );
};

export default OcknoShell;

