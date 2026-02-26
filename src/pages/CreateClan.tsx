import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Swords, Server, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function CreateClan() {
  const { user, signOut, refreshContext } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    clanName: '',
    server: 'Skelth',
    inGameName: '',
    className: '',
    classGroup: 'Tank'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/clans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.clanName,
          server: formData.server,
          leader_id: user.id,
          in_game_name: formData.inGameName,
          className: formData.className,
          classGroup: formData.classGroup
        })
      });

      if (res.ok) {
        console.log('Clan created successfully, refreshing context...');
        await refreshContext();
        console.log('Context refreshed, navigating to home...');
        navigate('/');
      } else {
        const data = await res.json();
        console.error('Failed to create clan:', data);
        setError(data.error || 'Failed to create clan');
      }
    } catch (err) {
      console.error('Unexpected error during clan creation:', err);
      setError('An unexpected error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <button 
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="w-12 h-12 text-indigo-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-100">
          Create Your Clan
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Set up your clan workspace to start managing members and events.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-800">
          <form className="space-y-6" onSubmit={handleCreate}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-100 border-b border-zinc-800 pb-2">Clan Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300">Clan Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.clanName}
                    onChange={(e) => setFormData({ ...formData, clanName: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-zinc-700 bg-zinc-950 text-zinc-100 rounded-md py-2"
                    placeholder="DragonSlayers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Server</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Server className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.server}
                    onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-zinc-700 bg-zinc-950 text-zinc-100 rounded-md py-2"
                    placeholder="Skelth"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium text-zinc-100 border-b border-zinc-800 pb-2">Leader Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300">In-game Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Swords className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.inGameName}
                    onChange={(e) => setFormData({ ...formData, inGameName: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-zinc-700 bg-zinc-950 text-zinc-100 rounded-md py-2"
                    placeholder="Your character name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300">Class</label>
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-zinc-700 bg-zinc-950 text-zinc-100 rounded-md py-2 px-3"
                    placeholder="e.g. Paladin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300">Role</label>
                  <select
                    value={formData.classGroup}
                    onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-zinc-700 bg-zinc-950 text-zinc-100 rounded-md py-2 px-3"
                  >
                    <option value="Tank">Tank</option>
                    <option value="Healer">Healer</option>
                    <option value="Buffer">Buffer</option>
                    <option value="Melee">Melee DPS</option>
                    <option value="Archer">Archer</option>
                    <option value="Mage">Mage</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Clan Workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
