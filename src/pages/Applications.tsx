import { useEffect, useState } from 'react';
import { Search, Check, X, MessageSquare, Clock, Users, User, Link as LinkIcon, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [copied, setCopied] = useState(false);

  const fetchApplications = () => {
    fetch('/api/clans/c1/applications')
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/clans/c1/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const copyApplyLink = () => {
    const link = `${window.location.origin}/apply`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredApps = applications.filter(app => app.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Recruitment</h1>
          <p className="text-zinc-400 mt-1">Review and manage clan applications.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={copyApplyLink}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center"
          >
            {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Apply Link'}
          </button>
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 w-full sm:w-auto justify-center">
            {['pending', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  filter === status 
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {status}
                {status === 'pending' && applications.filter(a => a.status === 'pending').length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px]">
                    {applications.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <p className="text-zinc-500">No {filter} applications found.</p>
          </div>
        ) : filteredApps.map((app) => (
          <div key={app.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 transition-colors hover:bg-zinc-800/30">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    app.type === 'cp' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {app.type === 'cp' ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-zinc-100">{app.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        app.type === 'cp' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {app.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        {app.discord}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Class / Comp</p>
                    <p className="text-sm font-medium text-zinc-200">{app.class}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Level</p>
                    <p className="text-sm font-medium text-zinc-200">{app.level}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Combat Power</p>
                    <p className="text-sm font-medium text-indigo-400">{app.combat_power?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Playtime</p>
                    <p className="text-sm font-medium text-zinc-200">{app.playtime}</p>
                  </div>
                </div>

                {app.notes && (
                  <div className="p-4 bg-zinc-950/30 rounded-lg border border-zinc-800/30">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Additional Notes</p>
                    <p className="text-sm text-zinc-300 italic">"{app.notes}"</p>
                  </div>
                )}
              </div>

              {filter === 'pending' && (
                <div className="flex lg:flex-col gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800 lg:border-l lg:pl-6">
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'accepted')}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg font-medium transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
