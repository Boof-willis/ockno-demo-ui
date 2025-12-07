import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle, 
  Target, 
  ChevronDown, 
  ChevronRight,
  Megaphone,
  Zap,
  Check,
  Layers,
  Edit3,
  AlertTriangle
} from 'lucide-react';

/**
 * @typedef {'phone' | 'form'} LeadSourceType
 * @typedef {'new' | 'qualified' | 'converted'} LeadDisposition
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
 * @property {LeadSourceType} sourceType
 * @property {boolean} isEnabled
 * 
 * @typedef {Object} GoogleCustomGoal
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} assignedCampaignIds // Array of campaign IDs assigned to this goal
 * @property {GoogleConversionAction[]} conversionActions
 */

const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'Search - Brand', status: 'enabled' },
  { id: 'c2', name: 'Search - Competitor', status: 'enabled' },
  { id: 'c3', name: 'Display - Retargeting', status: 'paused' },
  { id: 'c4', name: 'YouTube - Awareness', status: 'enabled' },
  { id: 'c5', name: 'PMax - General', status: 'enabled' },
];

const MOCK_GOOGLE_CUSTOM_GOALS = [
  {
    id: 'goal_new',
    name: 'New Lead',
    description: 'Fires when a new lead is created via phone or form.',
    assignedCampaignIds: ['c1', 'c2'],
    conversionActions: [
      { id: 'ca_new_phone', name: 'New Lead – Phone Call', googleEventName: 'new_lead_phone_call', sourceType: 'phone', isEnabled: true },
      { id: 'ca_new_form', name: 'New Lead – Form Submission', googleEventName: 'new_lead_form_submit', sourceType: 'form', isEnabled: true },
    ]
  },
  {
    id: 'goal_qual',
    name: 'Qualified Lead',
    description: 'Fires when a lead status changes to Qualified.',
    assignedCampaignIds: ['c3'],
    conversionActions: [
      { id: 'ca_qual_phone', name: 'Qualified Lead – Phone Call', googleEventName: 'qualified_lead_phone', sourceType: 'phone', isEnabled: true },
      { id: 'ca_qual_form', name: 'Qualified Lead – Form Submission', googleEventName: 'qualified_lead_form', sourceType: 'form', isEnabled: true },
    ]
  },
  {
    id: 'goal_conv',
    name: 'Converted Lead',
    description: 'Fires when a lead marks as Converted (Sale).',
    assignedCampaignIds: [],
    conversionActions: [
      { id: 'ca_conv_phone', name: 'Converted Lead – Phone Call', googleEventName: 'converted_lead_phone', sourceType: 'phone', isEnabled: true },
      { id: 'ca_conv_form', name: 'Converted Lead – Form Submission', googleEventName: 'converted_lead_form', sourceType: 'form', isEnabled: true },
    ]
  }
];

const ClientSignals = ({ client }) => {
  const [goals, setGoals] = useState(MOCK_GOOGLE_CUSTOM_GOALS);
  const [expandedGoalId, setExpandedGoalId] = useState('goal_new');
  const [editingCampaignsForGoalId, setEditingCampaignsForGoalId] = useState(null);

  // This replaces "Active Goal" logic. Now "Active" effectively means "Has assigned campaigns"
  // or simply "Is expanded/being managed". The prompt implies we keep the "Active Goal" badge visual
  // but tied to campaign assignment. Let's assume if campaigns > 0, it's "In Use".
  
  // Helper to move campaign between goals
  const handleAssignCampaign = (campaignId, targetGoalId) => {
    setGoals(prevGoals => {
      // 1. Remove campaign from ALL goals
      const cleanedGoals = prevGoals.map(g => ({
        ...g,
        assignedCampaignIds: g.assignedCampaignIds.filter(cid => cid !== campaignId)
      }));

      // 2. If targetGoalId is provided (checking the box), add it there
      // If unchecked (targetGoalId matches current assignment), we effectively removed it above.
      // Wait, typical checkbox logic: if checked, add to this goal. If unchecked, just remove.
      // But we also need to ensure it's removed from others.
      
      // Let's simplify: We are inside the context of `targetGoalId`.
      // If `campaignId` is currently in `targetGoalId`, we remove it.
      // If `campaignId` is NOT in `targetGoalId`, we add it (and remove from others).
      
      const currentGoal = prevGoals.find(g => g.id === targetGoalId);
      const isCurrentlyAssignedToTarget = currentGoal.assignedCampaignIds.includes(campaignId);

      if (isCurrentlyAssignedToTarget) {
        // Just remove it (it becomes unassigned)
        return cleanedGoals; 
      } else {
        // Add to target
        return cleanedGoals.map(g => 
          g.id === targetGoalId 
            ? { ...g, assignedCampaignIds: [...g.assignedCampaignIds, campaignId] }
            : g
        );
      }
    });
  };

  const toggleGoalAccordion = (id) => {
    setExpandedGoalId(prev => prev === id ? null : id);
    setEditingCampaignsForGoalId(null); // Close edit mode when collapsing/switching
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Signals for {client.name}</h1>
        <p className="text-slate-500 mt-1">
          Manage custom goals and campaign optimization targets.
        </p>
      </div>

      {/* Helper Info */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3">
        <Activity className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-900">
          <p className="font-medium mb-1">Campaign Optimization</p>
          <p className="opacity-90">
            Assign <strong>Custom Goals</strong> to specific campaigns. 
            A campaign can only optimize toward one goal at a time.
          </p>
        </div>
      </div>

      {/* Google Ads Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded shadow-sm border border-gray-200">
             {/* Placeholder Google G Icon */}
             <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
               <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                 <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                 <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                 <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                 <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
               </g>
             </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Google Ads</h2>
        </div>

        <div className="grid gap-4">
          {goals.map(goal => {
            const assignedCampaigns = MOCK_CAMPAIGNS.filter(c => goal.assignedCampaignIds.includes(c.id));
            const isExpanded = expandedGoalId === goal.id;
            const isActive = assignedCampaigns.length > 0; // Visual "Active Goal" state based on usage
            const isEditingCampaigns = editingCampaignsForGoalId === goal.id;

            return (
              <div 
                key={goal.id} 
                className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${isActive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'}`}
              >
                {/* Goal Header */}
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleGoalAccordion(goal.id)}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                      <Target size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-slate-900">{goal.name}</h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                            Active Goal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{goal.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Preview of assigned campaigns */}
                    {assignedCampaigns.length > 0 ? (
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {assignedCampaigns.slice(0, 3).map(c => (
                            <div key={c.id} className="w-6 h-6 rounded-full bg-indigo-50 border border-white flex items-center justify-center text-[10px] font-medium text-indigo-600" title={c.name}>
                              {c.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">
                          {assignedCampaigns.length} campaign{assignedCampaigns.length !== 1 && 's'}
                        </span>
                      </div>
                    ) : (
                      <span className="hidden sm:block text-xs text-slate-400 italic">No campaigns assigned</span>
                    )}
                    
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                </div>

                {/* Goal Details (Accordion Body) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100 bg-gray-50/50">
                    
                    {/* Campaign Assignment Section */}
                    <div className="mt-5 bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <Layers size={16} className="text-indigo-600" />
                          Assigned Campaigns
                        </h4>
                        <button 
                          onClick={() => setEditingCampaignsForGoalId(prev => prev === goal.id ? null : goal.id)}
                          className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors ${isEditingCampaigns ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}
                        >
                          <Edit3 size={12} />
                          {isEditingCampaigns ? 'Done Editing' : 'Manage Assignments'}
                        </button>
                      </div>

                      {isEditingCampaigns ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {MOCK_CAMPAIGNS.map(campaign => {
                            const assignedToThis = goal.assignedCampaignIds.includes(campaign.id);
                            const assignedToOther = !assignedToThis && goals.some(g => g.id !== goal.id && g.assignedCampaignIds.includes(campaign.id));
                            const otherGoalName = assignedToOther ? goals.find(g => g.assignedCampaignIds.includes(campaign.id))?.name : '';

                            return (
                              <label 
                                key={campaign.id} 
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${assignedToThis ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={assignedToThis}
                                    onChange={() => handleAssignCampaign(campaign.id, goal.id)}
                                  />
                                  <div>
                                    <p className={`text-sm font-medium ${assignedToThis ? 'text-indigo-900' : 'text-slate-700'}`}>{campaign.name}</p>
                                    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${campaign.status === 'enabled' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {campaign.status}
                                    </span>
                                  </div>
                                </div>
                                {assignedToOther && (
                                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                    <AlertTriangle size={12} />
                                    <span>Moves from <strong>{otherGoalName}</strong></span>
                                  </div>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {assignedCampaigns.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {assignedCampaigns.map(c => (
                                <span key={c.id} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No campaigns currently optimizing toward this goal.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Conversion Actions List */}
                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Zap size={12} /> Included Conversion Actions
                      </h4>
                      <div className="space-y-2">
                        {goal.conversionActions.map(action => (
                          <div key={action.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded ${action.sourceType === 'phone' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                {action.sourceType === 'phone' ? <Megaphone size={14} /> : <Activity size={14} />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{action.name}</p>
                                <p className="text-xs text-slate-400 font-mono">Event: {action.googleEventName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span className="text-xs text-slate-500">{isActive ? 'Live' : 'Inactive'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Placeholder for Meta */}
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
