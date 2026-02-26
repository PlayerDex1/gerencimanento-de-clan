import { useState } from 'react';
import { Users, Plus, Shield, Swords, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';

export default function ConstantParties() {
  const [cps, setCps] = useState<any[]>([
    {
      id: 'cp1',
      name: 'Alpha Squad',
      leader_id: 'm1',
      leader_name: 'AdminPlayer',
      recruiting_classes: 'Bishop, Elven Elder',
      members: [
        { id: 'm1', in_game_name: 'AdminPlayer', class: 'Paladin', level: 85, combat_power: 45000 },
        { id: 'm2', in_game_name: 'HealMePls', class: 'Bishop', level: 84, combat_power: 42000 }
      ]
    },
    {
      id: 'cp2',
      name: 'Bravo Team',
      leader_id: 'm4',
      leader_name: 'BowMaster',
      recruiting_classes: 'Paladin, Swordsinger',
      members: [
        { id: 'm4', in_game_name: 'BowMaster', class: 'Hawkeye', level: 83, combat_power: 40000 },
        { id: 'm5', in_game_name: 'SingForMe', class: 'Swordsinger', level: 81, combat_power: 35000 }
      ]
    }
  ]);
  const [loading] = useState(false);
  const [expandedCp, setExpandedCp] = useState<string | null>('cp1');

  const toggleCp = (id: string) => {
    setExpandedCp(expandedCp === id ? null : id);
  };

  const handleEditNeeds = async (cpId: string, currentNeeds: string) => {
    const newNeeds = prompt('Enter recruiting classes (comma separated):', currentNeeds || '');
    if (newNeeds !== null) {
      setCps(cps.map(cp => cp.id === cpId ? { ...cp, recruiting_classes: newNeeds } : cp));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">CP Management</h1>
          <p className="text-zinc-400 mt-1">Organize Constant Parties, leaders, and members.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create CP
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading CPs...</div>
        ) : cps.map((cp) => {
          const totalCp = cp.members.reduce((sum: number, m: any) => sum + (m.combat_power || 0), 0);
          const avgLevel = Math.round(cp.members.reduce((sum: number, m: any) => sum + (m.level || 0), 0) / (cp.members.length || 1));
          const isExpanded = expandedCp === cp.id;

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
                      <Shield className="w-3 h-3" /> Leader: <span className="text-zinc-300 font-medium">{cp.leader_name}</span>
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-4 ml-9 lg:ml-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Recruiting</p>
                    <button onClick={(e) => { e.stopPropagation(); handleEditNeeds(cp.id, cp.recruiting_classes); }} className="text-zinc-400 hover:text-indigo-400 transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
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
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {cp.members.map((member: any) => (
                          <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-3 font-medium text-zinc-200">
                              <div className="flex items-center gap-2">
                                {member.id === cp.leader_id && <Shield className="w-3 h-3 text-amber-500" />}
                                {member.in_game_name}
                              </div>
                            </td>
                            <td className="px-6 py-3 text-zinc-400">{member.class}</td>
                            <td className="px-6 py-3 text-center font-medium text-zinc-300">{member.level}</td>
                            <td className="px-6 py-3 text-right font-bold text-indigo-400">
                              {member.combat_power?.toLocaleString()}
                            </td>
                            <td className="px-6 py-3 text-right">
                              <button className="text-zinc-500 hover:text-indigo-400 font-medium transition-colors text-xs">Edit</button>
                            </td>
                          </tr>
                        ))}
                        {cp.members.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                              No members in this CP yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/30">
                    <button className="w-full py-2 border border-dashed border-zinc-700 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Member to {cp.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
