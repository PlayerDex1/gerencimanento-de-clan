import { useState } from 'react';
import { Users, Shield, Calendar, Swords, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { clan } = useAuth();

  // Mock stats for the dashboard since we are bypassing the backend
  const stats = {
    generalStats: {
      totalMembers: 42,
      avgLevel: 82,
      totalPower: 1250000
    },
    classDistribution: [
      { name: 'Tank', value: 5 },
      { name: 'Healer', value: 8 },
      { name: 'Buffer', value: 6 },
      { name: 'Melee DPS', value: 12 },
      { name: 'Archer', value: 7 },
      { name: 'Mage', value: 4 },
    ],
    cpPower: [
      { name: 'Alpha Squad', totalPower: 450000 },
      { name: 'Bravo Team', totalPower: 380000 },
      { name: 'Charlie Force', totalPower: 420000 },
    ],
    recruitmentNeeds: [
      { cp_name: 'Alpha Squad', recruiting_classes: 'Bishop, Elven Elder' },
      { cp_name: 'Bravo Team', recruiting_classes: 'Paladin, Swordsinger' },
    ]
  };

  const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];

  const summaryCards = [
    { name: 'Total Active Members', value: stats.generalStats.totalMembers, icon: Users, change: 'All CPs' },
    { name: 'Average Level', value: Math.round(stats.generalStats.avgLevel), icon: Activity, change: 'Server Top 10%' },
    { name: 'Total Combat Power', value: stats.generalStats.totalPower.toLocaleString(), icon: Swords, change: 'Growing' },
    { name: 'Active CPs', value: stats.cpPower.length, icon: Shield, change: 'Organized' },
  ];

  const recentActivity = [
    { id: 1, user: 'AdminHero', action: 'created new CP', target: 'Alpha Squad', time: '2 hours ago' },
    { id: 2, user: 'HealerPro', action: 'reached level', target: '84', time: '5 hours ago' },
    { id: 3, user: 'TankMaster', action: 'joined clan', target: 'DragonSlayers', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Clan Dashboard</h1>
        <p className="text-zinc-400 mt-2">Overview of {clan?.name || 'your clan'} roster, power, and organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat) => (
          <div key={stat.name} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <stat.icon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-medium text-zinc-500">{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
              <p className="text-sm font-medium text-zinc-400 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Class Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.classDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.classDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">CP Combat Power Comparison</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.cpPower} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="totalPower" fill="#818cf8" radius={[0, 4, 4, 0]} name="Combat Power" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Recent Roster Activity</h2>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-indigo-400">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium text-zinc-100">{activity.target}</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Open Recruitment</h2>
          <div className="space-y-4">
            {stats.recruitmentNeeds.length === 0 ? (
              <p className="text-zinc-500 text-sm">No open recruitment needs.</p>
            ) : stats.recruitmentNeeds.map((need: any, i: number) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                <span className="text-sm font-bold text-zinc-200">{need.cp_name}</span>
                <div className="flex flex-wrap gap-2">
                  {need.recruiting_classes.split(',').map((cls: string) => (
                    <span key={cls} className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                      {cls.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
