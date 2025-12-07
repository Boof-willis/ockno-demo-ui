import React, { useState, useMemo } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Tag, 
  Calendar, 
  Search, 
  Filter, 
  Check, 
  X, 
  DollarSign, 
  MoreHorizontal,
  ArrowRight,
  Columns,
  ChevronDown,
  List
} from 'lucide-react';

// Mock Data with extended tracking fields
const MOCK_CONTACTS = [
  { 
    id: 1, 
    name: 'Jane Cooper', 
    email: 'jane.cooper@example.com', 
    phone: '(555) 123-4567', 
    source: 'Google Ads', 
    campaign: 'Search - Brand', 
    created: '2 hours ago', 
    status: 'New', 
    value: 0,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'brand_search_q1',
    utmTerm: 'acme brand',
    gclid: 'Cj0KCQjwnf-kBhCnARIsAfl',
    landingPageUrl: '/pricing',
    firstTouchSource: 'Google Ads',
    lastTouchSource: 'Direct'
  },
  { 
    id: 2, 
    name: 'Wade Warren', 
    email: 'wade.w@example.com', 
    phone: '(555) 987-6543', 
    source: 'Meta Ads', 
    campaign: 'Retargeting - FB', 
    created: '5 hours ago', 
    status: 'Qualified', 
    value: 0,
    utmSource: 'facebook',
    utmMedium: 'paid_social',
    utmCampaign: 'retargeting_spring',
    fbclid: 'IwAR2xL...',
    landingPageUrl: '/demo-request',
    firstTouchSource: 'Meta Ads',
    lastTouchSource: 'Meta Ads'
  },
  { 
    id: 3, 
    name: 'Esther Howard', 
    email: 'esther.h@example.com', 
    phone: '(555) 456-7890', 
    source: 'Organic Search', 
    campaign: '-', 
    created: '1 day ago', 
    status: 'Converted', 
    value: 1250,
    utmSource: 'google',
    utmMedium: 'organic',
    landingPageUrl: '/blog/attribution-guide',
    firstTouchSource: 'Organic Search',
    lastTouchSource: 'Direct'
  },
  { 
    id: 4, 
    name: 'Cameron Williamson', 
    email: 'cameron.w@example.com', 
    phone: '(555) 234-5678', 
    source: 'Google Ads', 
    campaign: 'Competitor Search', 
    created: '1 day ago', 
    status: 'New', 
    value: 0,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'competitor_terms',
    utmTerm: 'competitor x',
    gclid: 'EAIaIQobChMI...',
    landingPageUrl: '/',
    firstTouchSource: 'Google Ads',
    lastTouchSource: 'Google Ads'
  },
  { 
    id: 5, 
    name: 'Brooklyn Simmons', 
    email: 'brooklyn.s@example.com', 
    phone: '(555) 876-5432', 
    source: 'Direct', 
    campaign: '-', 
    created: '2 days ago', 
    status: 'Qualified', 
    value: 0,
    firstTouchSource: 'Direct',
    lastTouchSource: 'Direct'
  },
  { 
    id: 6, 
    name: 'Leslie Alexander', 
    email: 'leslie.a@example.com', 
    phone: '(555) 345-6789', 
    source: 'Meta Ads', 
    campaign: 'Instagram Story', 
    created: '2 days ago', 
    status: 'New', 
    value: 0,
    utmSource: 'instagram',
    utmMedium: 'paid_social',
    utmCampaign: 'story_ads_v2',
    fbclid: 'IwAR0...',
    landingPageUrl: '/features',
    firstTouchSource: 'Meta Ads',
    lastTouchSource: 'Organic Search'
  },
  { 
    id: 7, 
    name: 'Jenny Wilson', 
    email: 'jenny.w@example.com', 
    phone: '(555) 654-3210', 
    source: 'Google Ads', 
    campaign: 'Search - Brand', 
    created: '3 days ago', 
    status: 'Converted', 
    value: 3500,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'brand_search_q1',
    gclid: 'CjwKCAjw...',
    landingPageUrl: '/pricing',
    firstTouchSource: 'Google Ads',
    lastTouchSource: 'Google Ads'
  },
  { 
    id: 8, 
    name: 'Guy Hawkins', 
    email: 'guy.h@example.com', 
    phone: '(555) 789-0123', 
    source: 'LinkedIn Ads', 
    campaign: 'Lead Gen Form', 
    created: '3 days ago', 
    status: 'New', 
    value: 0,
    utmSource: 'linkedin',
    utmMedium: 'paid_social',
    utmCampaign: 'b2b_leads_q2',
    landingPageUrl: '/webinar-signup',
    firstTouchSource: 'LinkedIn Ads',
    lastTouchSource: 'LinkedIn Ads'
  },
];

// Column Definitions
const AVAILABLE_COLUMNS = [
  { id: 'contact', label: 'Contact', mandatory: true, minWidth: '250px' },
  { id: 'source', label: 'Source / Campaign', mandatory: false, minWidth: '200px' },
  { id: 'created', label: 'Created', mandatory: false, minWidth: '120px' },
  { id: 'status', label: 'Status', mandatory: true, minWidth: '140px' },
  { id: 'value', label: 'Value', mandatory: false, minWidth: '100px' },
  { id: 'utmSource', label: 'UTM Source', mandatory: false, minWidth: '120px' },
  { id: 'utmMedium', label: 'UTM Medium', mandatory: false, minWidth: '120px' },
  { id: 'utmCampaign', label: 'UTM Campaign', mandatory: false, minWidth: '150px' },
  { id: 'utmTerm', label: 'UTM Term', mandatory: false, minWidth: '120px' },
  { id: 'gclid', label: 'GCLID', mandatory: false, minWidth: '150px' },
  { id: 'fbclid', label: 'FBCLID', mandatory: false, minWidth: '150px' },
  { id: 'landingPage', label: 'Landing Page', mandatory: false, minWidth: '200px' },
  { id: 'firstTouch', label: 'First Touch', mandatory: false, minWidth: '140px' },
  { id: 'lastTouch', label: 'Last Touch', mandatory: false, minWidth: '140px' },
];

const DEFAULT_VISIBLE_COLUMNS = ['contact', 'source', 'created', 'status', 'value'];

const ClientContacts = ({ client }) => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  
  const [editingContactId, setEditingContactId] = useState(null);
  const [conversionValue, setConversionValue] = useState('');

  const toggleColumn = (columnId) => {
    setVisibleColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  // Order columns based on AVAILABLE_COLUMNS order but filter by visibility
  const tableColumns = useMemo(() => {
    return AVAILABLE_COLUMNS.filter(col => visibleColumns.includes(col.id));
  }, [visibleColumns]);

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === 'Converted') {
      setEditingContactId(id);
      setConversionValue(''); 
    } else {
      updateContactStatus(id, newStatus);
    }
  };

  const updateContactStatus = (id, status, value = 0) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, status, value: Number(value) } : c
    ));
    setEditingContactId(null);
  };

  const confirmConversion = (id) => {
    updateContactStatus(id, 'Converted', conversionValue);
  };

  return (
    <div className="max-w-full mx-auto space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Manage leads and track conversions for {client.name}.</p>
        </div>
        <div className="flex gap-2">
           <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 shadow-sm">
             <ArrowRight size={16} /> Export CSV
           </button>
        </div>
      </div>

      {/* Filters & Column Chooser */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select 
              className="border border-gray-300 rounded-lg text-sm pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Column Chooser */}
          <div className="relative">
            <button 
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50"
            >
              <Columns size={16} /> Columns
            </button>
            
            {isColumnMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsColumnMenuOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto py-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                    Toggle Columns
                  </div>
                  {AVAILABLE_COLUMNS.map(col => (
                    <label key={col.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        checked={visibleColumns.includes(col.id)}
                        onChange={() => !col.mandatory && toggleColumn(col.id)}
                        disabled={col.mandatory}
                      />
                      <span className={`text-sm ${col.mandatory ? 'text-gray-400 font-medium' : 'text-slate-700'}`}>
                        {col.label}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 min-w-[1000px]">
            <thead className="bg-gray-50 text-slate-900 font-semibold border-b border-gray-200 sticky top-0 z-10">
              <tr>
                {tableColumns.map(col => (
                  <th 
                    key={col.id} 
                    className="px-6 py-3 whitespace-nowrap" 
                    style={{ minWidth: col.minWidth }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right sticky right-0 bg-gray-50 w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                    
                    {/* Contact Column */}
                    {visibleColumns.includes('contact') && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{contact.name}</div>
                            <div className="text-xs text-slate-500 flex flex-col">
                              <span className="flex items-center gap-1 mt-0.5"><Mail size={10} /> {contact.email}</span>
                              <span className="flex items-center gap-1 mt-0.5"><Phone size={10} /> {contact.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Source / Campaign */}
                    {visibleColumns.includes('source') && (
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{contact.source}</span>
                          <span className="text-xs text-slate-500">{contact.campaign}</span>
                        </div>
                      </td>
                    )}

                    {/* Created */}
                    {visibleColumns.includes('created') && (
                      <td className="px-6 py-4 text-slate-500">
                        {contact.created}
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.includes('status') && (
                      <td className="px-6 py-4">
                        <select 
                          className={`
                            text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-offset-1 cursor-pointer appearance-none pr-6 relative
                            ${contact.status === 'New' ? 'bg-blue-50 text-blue-700 ring-blue-500' : ''}
                            ${contact.status === 'Qualified' ? 'bg-amber-50 text-amber-700 ring-amber-500' : ''}
                            ${contact.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 ring-emerald-500' : ''}
                          `}
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Converted">Converted</option>
                        </select>
                      </td>
                    )}

                    {/* Value */}
                    {visibleColumns.includes('value') && (
                      <td className="px-6 py-4">
                        {editingContactId === contact.id ? (
                          <div className="flex items-center gap-2">
                            <div className="relative w-20">
                              <DollarSign size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                type="number" 
                                className="w-full pl-5 pr-2 py-1 text-xs border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="0"
                                autoFocus
                                value={conversionValue}
                                onChange={(e) => setConversionValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && confirmConversion(contact.id)}
                              />
                            </div>
                            <button onClick={() => confirmConversion(contact.id)} className="text-emerald-600 hover:text-emerald-700"><Check size={14} /></button>
                            <button onClick={() => setEditingContactId(null)} className="text-gray-400 hover:text-gray-500"><X size={14} /></button>
                          </div>
                        ) : (
                          <span className={`font-medium ${contact.value > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {contact.value > 0 ? `$${contact.value.toLocaleString()}` : '-'}
                          </span>
                        )}
                      </td>
                    )}

                    {/* Extended Columns */}
                    {visibleColumns.includes('utmSource') && <td className="px-6 py-4 text-slate-500 text-xs font-mono">{contact.utmSource || '-'}</td>}
                    {visibleColumns.includes('utmMedium') && <td className="px-6 py-4 text-slate-500 text-xs font-mono">{contact.utmMedium || '-'}</td>}
                    {visibleColumns.includes('utmCampaign') && <td className="px-6 py-4 text-slate-500 text-xs font-mono">{contact.utmCampaign || '-'}</td>}
                    {visibleColumns.includes('utmTerm') && <td className="px-6 py-4 text-slate-500 text-xs font-mono">{contact.utmTerm || '-'}</td>}
                    {visibleColumns.includes('gclid') && <td className="px-6 py-4 text-slate-500 text-xs font-mono truncate max-w-[150px]" title={contact.gclid}>{contact.gclid || '-'}</td>}
                    {visibleColumns.includes('fbclid') && <td className="px-6 py-4 text-slate-500 text-xs font-mono truncate max-w-[150px]" title={contact.fbclid}>{contact.fbclid || '-'}</td>}
                    {visibleColumns.includes('landingPage') && <td className="px-6 py-4 text-slate-500 text-xs truncate max-w-[200px]" title={contact.landingPageUrl}>{contact.landingPageUrl || '-'}</td>}
                    {visibleColumns.includes('firstTouch') && <td className="px-6 py-4 text-slate-500 text-xs">{contact.firstTouchSource || '-'}</td>}
                    {visibleColumns.includes('lastTouch') && <td className="px-6 py-4 text-slate-500 text-xs">{contact.lastTouchSource || '-'}</td>}

                    {/* Actions Menu (Fixed Right) */}
                    <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50 border-l border-gray-100">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length + 1} className="px-6 py-12 text-center text-slate-500">
                    No contacts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientContacts;
