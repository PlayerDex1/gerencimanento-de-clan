import { useState } from 'react';
import { Shield, Send, CheckCircle2 } from 'lucide-react';

export default function Apply() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'solo',
    name: '',
    class: '',
    level: '',
    combat_power: '',
    discord: '',
    playtime: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/clans/c1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit application', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Application Received!</h2>
          <p className="text-zinc-400 mb-6">
            Thank you for applying to DragonSlayers. Our officers will review your application and contact you on Discord shortly.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-3">Join DragonSlayers</h1>
          <p className="text-lg text-zinc-400">
            We are currently recruiting active players and CPs for Skelth server.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Application Type */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">I am applying as a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'solo' })}
                  className={`p-4 rounded-xl border text-center transition-colors ${
                    formData.type === 'solo' 
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="block font-bold mb-1">Solo Player</span>
                  <span className="text-xs opacity-80">Looking for a CP or playing solo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'cp' })}
                  className={`p-4 rounded-xl border text-center transition-colors ${
                    formData.type === 'cp' 
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="block font-bold mb-1">Full CP</span>
                  <span className="text-xs opacity-80">Applying with my entire party</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {formData.type === 'solo' ? 'In-game Name' : 'CP Name / Leader Name'}
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={formData.type === 'solo' ? 'e.g. AdminHero' : 'e.g. Alpha Squad'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {formData.type === 'solo' ? 'Class' : 'CP Composition'}
                </label>
                <input
                  required
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={formData.type === 'solo' ? 'e.g. Cardinal' : 'e.g. Melee (2 Daggers, 1 Tank...)'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {formData.type === 'solo' ? 'Level' : 'Average Level'}
                </label>
                <input
                  required
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 85"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {formData.type === 'solo' ? 'Combat Power' : 'Total Combat Power'}
                </label>
                <input
                  required
                  type="number"
                  value={formData.combat_power}
                  onChange={(e) => setFormData({ ...formData, combat_power: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 150000"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-800">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Discord Tag (for contact)</label>
                <input
                  required
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. player#1234"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Available Playtime / Schedule</label>
                <input
                  required
                  type="text"
                  value={formData.playtime}
                  onChange={(e) => setFormData({ ...formData, playtime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 18:00 to 23:00 GMT-3 (Everyday)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Additional Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
                  placeholder="Tell us a bit about yourself, past clans, or what you're looking for..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
