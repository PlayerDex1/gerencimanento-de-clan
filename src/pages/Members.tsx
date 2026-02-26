import { useState, useMemo } from 'react';
import { Search, Plus, Shield, ShieldAlert, User, Trash2, Swords, ArrowUpDown, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Members() {
  // Mock members data
  const [members, setMembers] = useState<any[]>([
    {
      id: 'm1',
      in_game_name: 'AdminPlayer',
      role: 'leader',
      join_date: '2023-01-15T00:00:00Z',
      cp_name: 'Alpha Squad',
      class: 'Paladin',
      class_group: 'Tank',
      level: 85,
      combat_power: 45000,
      total_events: 10,
      attended_events: 9,
      status: 'active'
    },
    {
      id: 'm2',
      in_game_name: 'HealMePls',
      role: 'officer',
      join_date: '2023-02-20T00:00:00Z',
      cp_name: 'Alpha Squad',
      class: 'Bishop',
      class_group: 'Healer',
      level: 84,
      combat_power: 42000,
      total_events: 10,
      attended_events: 10,
      status: 'active'
    },
    {
      id: 'm3',
      in_game_name: 'StabbyStab',
      role: 'member',
      join_date: '2023-03-10T00:00:00Z',
      cp_name: null,
      class: 'Treasure Hunter',
      class_group: 'Melee DPS',
      level: 82,
      combat_power: 38000,
      total_events: 10,
      attended_events: 4,
      status: 'inactive'
    }
  ]);
  
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [cpFilter, setCpFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'combat_power', direction: 'desc' });

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    in_game_name: '',
    class: '',
    class_group: 'Tank',
    level: 1,
    combat_power: 0,
    cp_name: ''
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `m${Date.now()}`;
    setMembers([...members, {
      id: newId,
      ...newMember,
      role: 'member',
      join_date: new Date().toISOString(),
      total_events: 0,
      attended_events: 0,
      status: 'active'
    }]);
    setIsAddModalOpen(false);
    setNewMember({
      in_game_name: '',
      class: '',
      class_group: 'Tank',
      level: 1,
      combat_power: 0,
      cp_name: ''
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredAndSortedMembers = useMemo(() => {
    let result = members.filter(m => {
      const matchesSearch = m.in_game_name.toLowerCase().includes(search.toLowerCase()) || m.class.toLowerCase().includes(search.toLowerCase());
      const matchesClass = classFilter === 'All' || m.class_group === classFilter;
      const matchesCp = cpFilter === 'All' || (cpFilter === 'Solo' ? !m.cp_name : (cpFilter === 'In CP' ? !!m.cp_name : m.cp_name === cpFilter));
      return matchesSearch && matchesClass && matchesCp;
    });

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'attendance') {
        aValue = a.total_events > 0 ? (a.attended_events / a.total_events) : 0;
        bValue = b.total_events > 0 ? (b.attended_events / b.total_events) : 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [members, search, classFilter, cpFilter, sortConfig]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'officer': return <Shield className="w-4 h-4 text-indigo-500" />;
      default: return <User className="w-4 h-4 text-zinc-500" />;
    }
  };

  const classGroups = ['All', ...Array.from(new Set(members.map(m => m.class_group)))];
  const cpOptions = ['All', 'In CP', 'Solo', ...Array.from(new Set(members.map(m => m.cp_name).filter(Boolean)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Clan Roster</h1>
          <p className="text-zinc-400 mt-1">Manage all members, CPs, and combat power.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search members or classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-zinc-500 hidden sm:block" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="flex-1 sm:w-40 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classGroups.map(group => <option key={group} value={group}>{group === 'All' ? 'All Classes' : group}</option>)}
            </select>
            <select
              value={cpFilter}
              onChange={(e) => setCpFilter(e.target.value)}
              className="flex-1 sm:w-40 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {cpOptions.map(cp => <option key={cp} value={cp}>{cp === 'All' ? 'All CPs' : cp}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-950/50 text-zinc-400 uppercase tracking-wider text-xs font-medium">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('in_game_name')}>
                  <div className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('cp_name')}>
                  <div className="flex items-center gap-1">CP <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('class')}>
                  <div className="flex items-center gap-1">Class <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-zinc-200" onClick={() => handleSort('level')}>
                  <div className="flex items-center justify-center gap-1">Lvl <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 text-right cursor-pointer hover:text-zinc-200" onClick={() => handleSort('combat_power')}>
                  <div className="flex items-center justify-end gap-1">Combat Power <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-zinc-200" onClick={() => handleSort('attendance')}>
                  <div className="flex items-center justify-center gap-1">Attendance <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">Loading roster...</td>
                </tr>
              ) : filteredAndSortedMembers.map((member) => {
                const attendanceRate = member.total_events > 0 
                  ? Math.round((member.attended_events / member.total_events) * 100) 
                  : 0;
                
                return (
                  <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          {member.in_game_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            {member.in_game_name}
                            {getRoleIcon(member.role)}
                          </div>
                          <div className="text-xs text-zinc-500 font-normal mt-0.5">
                            Joined {format(new Date(member.join_date), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.cp_name ? (
                        <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium">
                          {member.cp_name}
                        </span>
                      ) : (
                        <span className="text-zinc-500 italic text-xs">Solo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300">{member.class}</div>
                      <div className="text-xs text-zinc-500">{member.class_group}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-zinc-300">
                      {member.level}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-400">
                      <div className="flex items-center justify-end gap-1">
                        <Swords className="w-3 h-3" />
                        {member.combat_power.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${attendanceRate >= 75 ? 'bg-emerald-500' : attendanceRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-zinc-400 w-8">{attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-zinc-500 hover:text-indigo-400 font-medium transition-colors">Edit</button>
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-zinc-500 hover:text-red-400 font-medium transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-100">Add New Member</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">In-Game Name</label>
                <input 
                  required
                  type="text" 
                  value={newMember.in_game_name}
                  onChange={e => setNewMember({...newMember, in_game_name: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. HeroPlayer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Class</label>
                  <input 
                    required
                    type="text" 
                    value={newMember.class}
                    onChange={e => setNewMember({...newMember, class: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Paladin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Role Group</label>
                  <select 
                    value={newMember.class_group}
                    onChange={e => setNewMember({...newMember, class_group: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Tank">Tank</option>
                    <option value="Healer">Healer</option>
                    <option value="Buffer">Buffer</option>
                    <option value="Melee DPS">Melee DPS</option>
                    <option value="Archer">Archer</option>
                    <option value="Mage">Mage</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Level</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={newMember.level}
                    onChange={e => setNewMember({...newMember, level: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Combat Power</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={newMember.combat_power}
                    onChange={e => setNewMember({...newMember, combat_power: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">CP Name (Optional)</label>
                <input 
                  type="text" 
                  value={newMember.cp_name}
                  onChange={e => setNewMember({...newMember, cp_name: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Alpha Squad"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
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
