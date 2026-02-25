import { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Shield, ShieldAlert, User, Trash2, Swords, ArrowUpDown, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [cpFilter, setCpFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'combat_power', direction: 'desc' });

  const fetchMembers = () => {
    fetch('/api/clans/c1/members')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        const res = await fetch(`/api/clans/c1/members/${memberId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchMembers();
        }
      } catch (error) {
        console.error('Failed to remove member', error);
      }
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
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
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
    </div>
  );
}
