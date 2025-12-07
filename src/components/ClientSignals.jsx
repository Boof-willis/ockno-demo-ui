import React, { useState } from 'react';
import { 
  Activity, 
  Target, 
  ChevronDown, 
  ChevronRight,
  Megaphone,
  Zap,
  Layers,
  Edit3,
  AlertTriangle,
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  Info
} from 'lucide-react';

/**
 * @typedef {'NEW' | 'QUALIFIED' | 'CONVERTED'} LeadStage
 * @typedef {'phone' | 'form'} LeadSourceType
 * @typedef {'enabled' | 'paused'} CampaignStatus
 * 
 * @typedef {Object} GoogleCampaign
 * @property {string} id
 * @property {string} name
 * @property {CampaignStatus} status
 * 
 * @typedef {Object} GoogleConversionAction
 * @property {string} id
 * @property {string} name
 * @property {string} googleEventName
 * @property {LeadStage} stage
 * @property {LeadSourceType} sourceType
 * @property {number} value
 * @property {boolean} isEnabled
 * 
 * @typedef {Object} GoogleGoal
 * @property {string} id
 * @property {LeadStage} stage
 * @property {string} name
 * @property {string} description
 * @property {GoogleConversionAction[]} conversionActions
 * 
 * @typedef {Object} CampaignAssignment
 * @property {string} campaignId
 * @property {LeadStage} activeStage
 * 
 * @typedef {Object} GoogleSignalCluster
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {GoogleGoal[]} goals
 * @property {CampaignAssignment[]} campaignAssignments
 */

const MOCK_CAMPAIGNS = [
  { id: "c1", name: "Search – Brand", status: "enabled" },
  { id: "c2", name: "Search – Emergency Plumbing", status: "enabled" },
  { id: "c3", name: "YouTube – Awareness", status: "enabled" },
  { id: "c4", name: "Search – Basement Plumbing", status: "paused" },
];

const createDefaultGoals = () => [
  {
    id: `g_new_${Math.random().toString(36).substr(2, 9)}`,
    stage: 'NEW',
    name: 'New Lead',
    description: 'Fires when a new lead is created.',
    conversionActions: [
      { id: `ca_new_phone_${Math.random().toString(36).substr(2, 9)}`, name: 'New Lead – Phone Call', googleEventName: 'new_lead_phone', stage: 'NEW', sourceType: 'phone', value: 1, isEnabled: true },
      { id: `ca_new_form_${Math.random().toString(36).substr(2, 9)}`, name: 'New Lead – Form Submission', googleEventName: 'new_lead_form', stage: 'NEW', sourceType: 'form', value: 1, isEnabled: true },
    ]
  },
  {
    id: `g_qual_${Math.random().toString(36).substr(2, 9)}`,
    stage: 'QUALIFIED',
    name: 'Qualified Lead',
    description: 'Fires when lead status becomes Qualified.',
    conversionActions: [
      { id: `ca_qual_phone_${Math.random().toString(36).substr(2, 9)}`, name: 'Qualified Lead – Phone Call', googleEventName: 'qual_lead_phone', stage: 'QUALIFIED', sourceType: 'phone', value: 10, isEnabled: true },
      { id: `ca_qual_form_${Math.random().toString(36).substr(2, 9)}`, name: 'Qualified Lead – Form Submission', googleEventName: 'qual_lead_form', stage: 'QUALIFIED', sourceType: 'form', value: 10, isEnabled: true },
    ]
  },
  {
    id: `g_conv_${Math.random().toString(36).substr(2, 9)}`,
    stage: 'CONVERTED',
    name: 'Converted Lead',
    description: 'Fires when lead is Converted (Sale).',
    conversionActions: [
      { id: `ca_conv_phone_${Math.random().toString(36).substr(2, 9)}`, name: 'Converted Lead – Phone Call', googleEventName: 'conv_lead_phone', stage: 'CONVERTED', sourceType: 'phone', value: 100, isEnabled: true },
      { id: `ca_conv_form_${Math.random().toString(36).substr(2, 9)}`, name: 'Converted Lead – Form Submission', googleEventName: 'conv_lead_form', stage: 'CONVERTED', sourceType: 'form', value: 100, isEnabled: true },
    ]
  }
];

const INITIAL_CLUSTERS = [
  {
    id: "cluster_default",
    name: "Default Service",
    description: "Standard conversion ladder for general services.",
    campaignAssignments: [
      { campaignId: "c1", activeStage: "NEW" },
      { campaignId: "c3", activeStage: "NEW" }
    ],
    goals: createDefaultGoals()
  },
  {
    id: "cluster_emergency",
    name: "Emergency Plumbing",
    description: "High-value emergency leads.",
    campaignAssignments: [
      { campaignId: "c2", activeStage: "QUALIFIED" }
    ],
    goals: createDefaultGoals()
  }
];

const STAGE_LABELS = {
  NEW: 'New Lead',
  QUALIFIED: 'Qualified Lead',
  CONVERTED: 'Converted Lead'
};

const ClientSignals = ({ client }) => {
  // TODO: Load clusters, goals, actions, and campaign assignments from backend for this client.
  const [clusters, setClusters] = useState(INITIAL_CLUSTERS);
  const [expandedClusterId, setExpandedClusterId] = useState(null);
  
  // New Cluster Dialog State
  const [isCreatingCluster, setIsCreatingCluster] = useState(false);
  const [newClusterName, setNewClusterName] = useState('');
  const [newClusterDesc, setNewClusterDesc] = useState('');

  const toggleCluster = (id) => {
    setExpandedClusterId(prev => prev === id ? null : id);
  };

  const handleCreateCluster = () => {
    if (!newClusterName.trim()) return;
    
    const newCluster = {
      id: `cluster_${Date.now()}`,
      name: newClusterName,
      description: newClusterDesc,
      campaignAssignments: [],
      goals: createDefaultGoals()
    };

    setClusters(prev => [...prev, newCluster]);
    setIsCreatingCluster(false);
    setNewClusterName('');
    setNewClusterDesc('');
    setExpandedClusterId(newCluster.id);
  };

  const handleDeleteCluster = (clusterId) => {
    setClusters(prev => prev.filter(c => c.id !== clusterId));
  };

  const handleDuplicateCluster = (clusterId) => {
    const clusterToCopy = clusters.find(c => c.id === clusterId);
    if (!clusterToCopy) return;

    const newCluster = {
      ...clusterToCopy,
      id: `cluster_${Date.now()}`,
      name: `${clusterToCopy.name} (Copy)`,
      campaignAssignments: [], // Don't copy assignments
      goals: createDefaultGoals() // Re-create goals to have unique IDs
      // Ideally we should copy values from the source cluster, but for now defaults are fine or deep clone if needed
    };
    
    // Deep clone values
    newCluster.goals = clusterToCopy.goals.map(g => ({
      ...g,
      id: `g_${Math.random().toString(36).substr(2, 9)}`,
      conversionActions: g.conversionActions.map(a => ({
        ...a,
        id: `ca_${Math.random().toString(36).substr(2, 9)}`
      }))
    }));

    setClusters(prev => [...prev, newCluster]);
  };

  // TODO: Persist campaign→cluster→stage mapping and ensure only one cluster is active per campaign at backend layer.
  const assignCampaignToCluster = (clusterId, campaignId, activeStage) => {
    setClusters(prev => {
      return prev.map(cluster => {
        if (cluster.id === clusterId) {
          const existing = cluster.campaignAssignments.find(ca => ca.campaignId === campaignId);
          let updatedAssignments;
          
          if (existing) {
            updatedAssignments = cluster.campaignAssignments.map(ca => 
              ca.campaignId === campaignId ? { ...ca, activeStage } : ca
            );
          } else {
            updatedAssignments = [...cluster.campaignAssignments, { campaignId, activeStage }];
          }
          return { ...cluster, campaignAssignments: updatedAssignments };
        }
        
        // Remove this campaign from all other clusters
        return {
          ...cluster,
          campaignAssignments: cluster.campaignAssignments.filter(ca => ca.campaignId !== campaignId),
        };
      });
    });
  };

  const removeCampaignFromCluster = (clusterId, campaignId) => {
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          campaignAssignments: c.campaignAssignments.filter(ca => ca.campaignId !== campaignId)
        };
      }
      return c;
    }));
  };

  // TODO: Persist updated conversion values and sync these to Google Ads.
  const updateConversionActionValue = (clusterId, goalId, actionId, value) => {
    setClusters(prev => 
      prev.map(cluster => {
        if (cluster.id !== clusterId) return cluster;
        return {
          ...cluster,
          goals: cluster.goals.map(goal => {
            if (goal.id !== goalId) return goal;
            return {
              ...goal,
              conversionActions: goal.conversionActions.map(action => 
                action.id === actionId ? { ...action, value } : action
              )
            };
          })
        };
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Signals for {client.name}</h1>
        <p className="text-slate-500 mt-1">
          Manage Google Ads signal clusters and campaign optimization targets.
        </p>
      </div>

      {/* Automatic Mapping Info Box */}
      {/* TODO: Implement backend flow to map (campaign, disposition, sourceType) to a GoogleConversionAction and fire offline conversions with the configured value. */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">How conversions fire</p>
          <div className="space-y-1.5 opacity-90">
             <p>1. A lead enters Ockno from your CRM. We identify the originating campaign.</p>
             <p>2. When you update the lead’s status in Contacts (New, Qualified, Converted), we:</p>
             <ul className="list-disc list-inside ml-1 space-y-0.5">
               <li>Find the campaign’s <strong>Signal Cluster</strong> and active stage.</li>
               <li>Look up the correct conversion action (Phone vs Form).</li>
               <li>Send an offline conversion to Google Ads using that action’s value.</li>
             </ul>
             <p className="mt-2 text-xs text-blue-700 font-medium">No manual mapping needed. Just assign campaigns to clusters.</p>
          </div>
        </div>
      </div>

      {/* Google Ads Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded shadow-sm border border-gray-200">
               {/* Google G Icon */}
               <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                 <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                   <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                   <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                   <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                   <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                 </g>
               </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Google Ads – Signal Clusters</h2>
          </div>

          <button 
            onClick={() => setIsCreatingCluster(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Cluster
          </button>
        </div>

        {/* Create Cluster Dialog (Inline) */}
        {isCreatingCluster && (
          <div className="bg-white border border-indigo-200 p-4 rounded-xl shadow-sm space-y-3 mb-4 animate-in fade-in slide-in-from-top-2">
             <h3 className="font-semibold text-slate-900">Create New Cluster</h3>
             <div className="grid gap-3">
               <div>
                 <label className="block text-xs font-medium text-slate-700 mb-1">Cluster Name</label>
                 <input 
                   type="text" 
                   value={newClusterName}
                   onChange={e => setNewClusterName(e.target.value)}
                   placeholder="e.g. Basement Waterproofing"
                   className="w-full text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                   autoFocus
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-slate-700 mb-1">Description (Optional)</label>
                 <input 
                   type="text" 
                   value={newClusterDesc}
                   onChange={e => setNewClusterDesc(e.target.value)}
                   placeholder="e.g. For high-intent local search campaigns"
                   className="w-full text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                 />
               </div>
               <div className="flex justify-end gap-2 pt-2">
                 <button 
                   onClick={() => setIsCreatingCluster(false)}
                   className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleCreateCluster}
                   disabled={!newClusterName.trim()}
                   className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                 >
                   Create Cluster
                 </button>
               </div>
             </div>
          </div>
        )}

        <div className="grid gap-4">
          {clusters.map(cluster => {
            const isExpanded = expandedClusterId === cluster.id;
            
            // Calculate most common stage
            const stageCounts = cluster.campaignAssignments.reduce((acc, curr) => {
              acc[curr.activeStage] = (acc[curr.activeStage] || 0) + 1;
              return acc;
            }, {});
            const mostCommonStage = Object.keys(stageCounts).reduce((a, b) => stageCounts[a] > stageCounts[b] ? a : b, null);

            return (
              <div 
                key={cluster.id} 
                className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-indigo-500 border-indigo-500' : 'border-gray-200'}`}
              >
                {/* Cluster Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex items-start gap-4 cursor-pointer flex-1"
                      onClick={() => toggleCluster(cluster.id)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Layers size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{cluster.name}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{cluster.description || 'No description'}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {cluster.campaignAssignments.length} campaign{cluster.campaignAssignments.length !== 1 && 's'}
                          </span>
                          {mostCommonStage && (
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              Optimizing for: {STAGE_LABELS[mostCommonStage]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {/* Menu Actions (Simplified) */}
                       <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleDuplicateCluster(cluster.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-50"
                            title="Duplicate Cluster"
                          >
                            <Copy size={16} />
                          </button>
                          {cluster.campaignAssignments.length === 0 && (
                            <button 
                              onClick={() => handleDeleteCluster(cluster.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50"
                              title="Delete Cluster"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                       </div>
                       <button 
                         onClick={() => toggleCluster(cluster.id)}
                         className="p-1 text-slate-400 hover:text-slate-600"
                       >
                         {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                       </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100 bg-gray-50/50">
                    
                    {/* 3.1 Campaigns in this cluster */}
                    <div className="mt-5 bg-white border border-gray-200 rounded-lg p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <Megaphone size={16} className="text-indigo-600" />
                          Assigned Campaigns
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Choose which campaigns belong to this service/ICP and which stage each one optimizes for.
                        </p>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {MOCK_CAMPAIGNS.map(campaign => {
                          const assignment = cluster.campaignAssignments.find(ca => ca.campaignId === campaign.id);
                          const isAssignedToThis = !!assignment;
                          
                          // Check if assigned to another cluster
                          const otherCluster = !isAssignedToThis && clusters.find(c => c.id !== cluster.id && c.campaignAssignments.some(ca => ca.campaignId === campaign.id));
                          
                          return (
                            <div 
                              key={campaign.id}
                              className={`flex items-center justify-between p-3 rounded border transition-all ${isAssignedToThis ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}
                            >
                              <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox"
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  checked={isAssignedToThis}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      assignCampaignToCluster(cluster.id, campaign.id, 'NEW'); // Default to NEW
                                    } else {
                                      removeCampaignFromCluster(cluster.id, campaign.id);
                                    }
                                  }}
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${isAssignedToThis ? 'text-indigo-900' : 'text-slate-700'}`}>
                                      {campaign.name}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${campaign.status === 'enabled' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {campaign.status}
                                    </span>
                                  </div>
                                  {otherCluster && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                                      <AlertTriangle size={10} />
                                      <span>Currently in <strong>{otherCluster.name}</strong></span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isAssignedToThis && (
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-medium text-slate-500">Optimizes for:</label>
                                  <select 
                                    value={assignment.activeStage}
                                    onChange={(e) => assignCampaignToCluster(cluster.id, campaign.id, e.target.value)}
                                    className="text-xs border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-6"
                                  >
                                    <option value="NEW">New Lead</option>
                                    <option value="QUALIFIED">Qualified Lead</option>
                                    <option value="CONVERTED">Converted Lead</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Goals & Conversion Actions */}
                    <div className="mt-6 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Target size={14} /> Conversion Goals
                      </h4>
                      
                      <div className="grid gap-4">
                        {cluster.goals.map(goal => {
                          const isNew = goal.stage === 'NEW';
                          const isQual = goal.stage === 'QUALIFIED';
                          const isConv = goal.stage === 'CONVERTED';
                          
                          // Optional: Highlight "Active Goal" based on assigned campaigns
                          const campaignsOptimizingForThis = cluster.campaignAssignments.filter(ca => ca.activeStage === goal.stage).length;
                          const isActive = campaignsOptimizingForThis > 0;

                          return (
                            <div key={goal.id} className={`bg-white border rounded-lg overflow-hidden ${isActive ? 'border-indigo-200 ring-1 ring-indigo-200' : 'border-gray-200'}`}>
                              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${isNew ? 'bg-blue-400' : isQual ? 'bg-purple-400' : 'bg-green-400'}`} />
                                  <h5 className="font-semibold text-slate-900 text-sm">{goal.name}</h5>
                                </div>
                                {isActive && (
                                  <span className="text-[10px] font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                    {campaignsOptimizingForThis} Active Campaign{campaignsOptimizingForThis !== 1 && 's'}
                                  </span>
                                )}
                              </div>
                              
                              <div className="p-4 space-y-3">
                                {goal.conversionActions.map(action => (
                                  <div key={action.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-1.5 rounded ${action.sourceType === 'phone' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {action.sourceType === 'phone' ? <Megaphone size={14} /> : <Activity size={14} />}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-slate-900">{action.name}</p>
                                        <div className="flex items-center gap-2">
                                          <p className="text-xs text-slate-400 font-mono">{action.googleEventName}</p>
                                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded">{action.sourceType}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <label className="text-[10px] text-slate-400 uppercase font-medium block">Value</label>
                                        <div className="relative">
                                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                          <input 
                                            type="number" 
                                            value={action.value}
                                            onChange={e => updateConversionActionValue(cluster.id, goal.id, action.id, parseFloat(e.target.value) || 0)}
                                            className="w-20 py-1 pl-5 pr-2 text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-right"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Meta Ads Placeholder */}
      <section className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 opacity-60">
          <div className="bg-white p-1.5 rounded shadow-sm border border-gray-200 text-slate-600">
             <Megaphone size={16} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Meta Ads</h2>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Coming Soon</span>
        </div>
      </section>
    </div>
  );
};

export default ClientSignals;
