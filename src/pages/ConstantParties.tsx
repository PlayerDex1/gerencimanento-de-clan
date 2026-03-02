import React, { useState, useMemo } from 'react';
import { Plus, Shield, Swords, ChevronDown, ChevronRight, Edit2, Trash2, UserPlus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for all clan members (simulating a database table)
const MOCK_ALL_MEMBERS = [
  { id: 'm1', in_game_name: 'AdminPlayer', class: 'Paladin', level: 85, combat_power: 45000 },
  { id: 'm2', in_game_name: 'HealMePls', class: 'Bishop', level: 84, combat_power: 42000 },
  { id: 'm3', in_game_name: 'StabbyStab', class: 'Treasure Hunter', level: 82, combat_power: 38000 },
  { id: 'm4', in_game_name: 'BowMaster', class: 'Hawkeye', level: 83, combat_power: 40000 },
  { id: 'm5', in_game_name: 'SingForMe', class: 'Swordsinger', level: 81, combat_power: 35000 },
  { id: 'm6', in_game_name: 'NukeEmAll', class: 'Spellsinger', level: 84, combat_power: 43000 },
  { id: 'm7', in_game_name: 'BuffMeUp', class: 'Prophet', level: 80, combat_power: 32000 },
  { id: 'm8', in_game_name: 'ShadowStep', class: 'Abyss Walker', level: 82, combat_power: 39000 },
];

export default function ConstantParties() {
  const { member: currentUser } = useAuth();
  const canManageCps = currentUser?.role === 'leader' || currentUser?.role === 'officer';

  const [cps, setCps] = useState<any[]>([
    {
      id: 'cp1',
      name: 'Alpha Squad',
      leader_id: 'm1',
      recruiting_classes: 'Bishop, Elven Elder',
      members: [
        MOCK_ALL_MEMBERS.find(m => m.id === 'm1'),
        MOCK_ALL_MEMBERS.find(m => m.id === 'm2')
      ]
    },
    {
      id: 'cp2',
      name: 'Bravo Team',
      leader_id: 'm4',
      recruiting_classes: 'Paladin, Swordsinger',
      members: [
        MOCK_ALL_MEMBERS.find(m => m.id === 'm4'),
        MOCK_ALL_MEMBERS.find(m => m.id === 'm5')
      ]
    }
  ]);

  const [expandedCp, setExpandedCp] = useState<string | null>('cp1');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  
  const [editingCp, setEditingCp] = useState<any>(null);
  const [selectedCpForMember, setSelectedCpForMember] = useState<string | null>(null);

  // Form States
  const [cpForm, setCpForm] = useState({ name: '', leader_id: '', recruiting_classes: '' });
  const [memberToAdd, setMemberToAdd] = useState('');

  // Derived Data
  const availableMembers = useMemo(() => {
    // Members who are NOT in any CP currently
    const membersInCps = new Set(cps.flatMap(cp => cp.members.map((m: any) => m.id)));
    return MOCK_ALL_MEMBERS.filter(m => !membersInCps.has(m.id));
  }, [cps]);

  const toggleCp = (id: string) => {
    setExpandedCp(expandedCp === id ? null : id);
  };

  // --- Handlers ---

  const handleCreateCp = (e: React.FormEvent) => {
    e.preventDefault();
    const newCp = {
      id: `cp${Date.now()}`,
      name: cpForm.name,
      leader_id: cpForm.leader_id,
      recruiting_classes: cpForm.recruiting_classes,
      members: cpForm.leader_id ? [MOCK_ALL_MEMBERS.find(m => m.id === cpForm.leader_id)] : []
    };
    setCps([...cps, newCp]);
    setIsCreateModalOpen(false);
    setCpForm({ name: '', leader_id: '', recruiting_classes: '' });
  };

  const handleEditCpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCp) {
      setCps(cps.map(cp => cp.id === editingCp.id ? { ...cp, ...cpForm } : cp));
      setIsEditModalOpen(false);
      setEditingCp(null);
    }
  };

  const handleDeleteCp = (cpId: string) => {
    if (confirm('Are you sure you want to delete this CP? All members will become Solo.')) {
      setCps(cps.filter(cp => cp.id !== cpId));
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCpForMember && memberToAdd) {
      const memberObj = MOCK_ALL_MEMBERS.find(m => m.id === memberToAdd);
      setCps(cps.map(cp => {
        if (cp.id === selectedCpForMember) {
          return { ...cp, members: [...cp.members, memberObj] };
        }
        return cp;
      }));
      setIsAddMemberModalOpen(false);
      setMemberToAdd('');
      setSelectedCpForMember(null);
    }
  };

  const handleRemoveMember = (cpId: string, memberId: string) => {
    if (confirm('Remove this member from the CP?')) {
      setCps(cps.map(cp => {
        if (cp.id === cpId) {
          return { ...cp, members: cp.members.filter((m: any) => m.id !== memberId) };
        }
        return cp;
      }));
    }
  };

  const openEditModal = (cp: any) => {
    setEditingCp(cp);
    setCpForm({ name: cp.name, leader_id: cp.leader_id, recruiting_classes: cp.recruiting_classes });
    setIsEditModalOpen(true);
  };

  const openAddMemberModal = (cpId: string) => {
    setSelectedCpForMember(cpId);
    setMemberToAdd('');
    setIsAddMemberModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">CP Management</h1>
          <p className="text-zinc-400 mt-1">Organize Constant Parties, leaders, and members.</p>
        </div>
        {canManageCps && (
          <button 
            onClick={() => {
              setCpForm({ name: '', leader_id: '', recruiting_classes: '' });
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create CP
          </button>
        )}
      </div>

      <div className="space-y-4">
        {cps.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            No Constant Parties found. Create one to get started.
          </div>
        ) : cps.map((cp) => {
          const totalCp = cp.members.reduce((sum: number, m: any) => sum + (m.combat_power || 0), 0);
          const avgLevel = cp.members.length > 0 
            ? Math.round(cp.members.reduce((sum: number, m: any) => sum + (m.level || 0), 0) / cp.members.length)
            : 0;
          const isExpanded = expandedCp === cp.id;
          const leader = MOCK_ALL_MEMBERS.find(m => m.id === cp.leader_id);

          return (
            <div key={cp.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden transition-colors">
              <div 
                onClick={() => toggleCp(cp.id)}
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer text-left"
              >
                <div className="lg:col-span-4 flex items-center gap-4">
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" /> : <ChevronRight className="w-5 h-5 text-zinc-500 shrink-0" />}
                  <div>
                    <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                      {cp.name}
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                        {cp.members.length}/9
                      </span>
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Leader: <span className="text-zinc-300 font-medium">{leader?.in_game_name || 'None'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-3 ml-9 lg:ml-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Recruiting</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cp.recruiting_classes ? cp.recruiting_classes.split(',').map((cls: string) => (
                      <span key={cls} className="px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-[11px] font-medium">
                        {cls.trim()}
                      </span>
                    )) : <span className="text-zinc-600 text-xs italic">Full</span>}
                  </div>
                </div>

                <div className="lg:col-span-2 hidden sm:block text-right">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Avg Level</p>
                  <p className="text-zinc-200 font-bold text-lg">{avgLevel}</p>
                </div>
                
                <div className="lg:col-span-2 text-right ml-9 lg:ml-0">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total CP</p>
                  <p className="text-indigo-400 font-bold text-lg flex items-center justify-end gap-1.5">
                    <Swords className="w-4 h-4" />
                    {totalCp.toLocaleString()}
                  </p>
                </div>

                {canManageCps && (
                  <div className="lg:col-span-1 flex items-center justify-end gap-2 ml-9 lg:ml-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(cp); }} 
                      className="p-2 text-zinc-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-zinc-800"
                      title="Edit CP"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteCp(cp.id); }} 
                      className="p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                      title="Delete CP"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-zinc-800 bg-zinc-950/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-zinc-500 uppercase tracking-wider text-xs font-medium bg-zinc-900/30">
                        <tr>
                          <th className="px-6 py-3">Member</th>
                          <th className="px-6 py-3">Class</th>
                          <th className="px-6 py-3 text-center">Level</th>
                          <th className="px-6 py-3 text-right">Combat Power</th>
                          {canManageCps && <th className="px-6 py-3 text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {cp.members.map((member: any) => (
                          <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-3 font-medium text-zinc-200">
                              <div className="flex items-center gap-2">
                                {member.id === cp.leader_id && <Shield className="w-3 h-3 text-amber-500" title="CP Leader" />}
                                {member.in_game_name}
                              </div>
                            </td>
                            <td className="px-6 py-3 text-zinc-400">{member.class}</td>
                            <td className="px-6 py-3 text-center font-medium text-zinc-300">{member.level}</td>
                            <td className="px-6 py-3 text-right font-bold text-indigo-400">
                              {member.combat_power?.toLocaleString()}
                            </td>
                            {canManageCps && (
                              <td className="px-6 py-3 text-right">
                                <button 
                                  onClick={() => handleRemoveMember(cp.id, member.id)}
                                  className="text-zinc-500 hover:text-red-400 font-medium transition-colors text-xs"
                                >
                                  Remove
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                        {cp.members.length === 0 && (
                          <tr>
                            <td colSpan={canManageCps ? 5 : 4} className="px-6 py-8 text-center text-zinc-500">
                              No members in this CP yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {canManageCps && cp.members.length < 9 && (
                    <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/30">
                      <button 
                        onClick={() => openAddMemberModal(cp.id)}
                        className="w-full py-2 border border-dashed border-zinc-700 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Member to {cp.name}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create/Edit CP Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-100">
                {isEditModalOpen ? 'Edit Constant Party' : 'Create Constant Party'}
              </h2>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={isEditModalOpen ? handleEditCpSubmit : handleCreateCp} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">CP Name</label>
                <input 
                  required
                  type="text" 
                  value={cpForm.name}
                  onChange={e => setCpForm({...cpForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Alpha Squad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">CP Leader</label>
                <select 
                  value={cpForm.leader_id}
                  onChange={e => setCpForm({...cpForm, leader_id: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a leader (Optional)</option>
                  {/* Show current members of the CP + available members */}
                  {MOCK_ALL_MEMBERS
                    .filter(m => availableMembers.includes(m) || (isEditModalOpen && editingCp?.members.some((cpm: any) => cpm.id === m.id)))
                    .map(m => (
                    <option key={m.id} value={m.id}>{m.in_game_name} ({m.class})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Recruiting Classes</label>
                <input 
                  type="text" 
                  value={cpForm.recruiting_classes}
                  onChange={e => setCpForm({...cpForm, recruiting_classes: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Bishop, Swordsinger (Comma separated)"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Create CP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-100">Add Member to CP</h2>
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMemberSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Select Member</label>
                {availableMembers.length === 0 ? (
                  <p className="text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    No available members found. All clan members are already in a CP.
                  </p>
                ) : (
                  <select 
                    required
                    value={memberToAdd}
                    onChange={e => setMemberToAdd(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select a member --</option>
                    {availableMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.in_game_name} - {m.class} (Lvl {m.level})</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={availableMembers.length === 0 || !memberToAdd}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
