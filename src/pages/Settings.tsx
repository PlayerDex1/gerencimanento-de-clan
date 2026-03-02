import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, Webhook, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/clans/c1/settings')
      .then((res) => res.json())
      .then((data) => {
        setWebhookUrl(data.discord_webhook_url || '');
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/clans/c1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_webhook_url: webhookUrl })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Clan Settings</h1>
        <p className="text-zinc-400 mt-1">Configure integrations and general clan preferences.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
              <Webhook className="w-5 h-5 text-[#5865F2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Discord Integration</h2>
              <p className="text-sm text-zinc-400">Receive automatic notifications in your Discord server.</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Recruitment Webhook URL</label>
              <p className="text-xs text-zinc-500 mb-3">
                Whenever a new player or CP applies via the recruitment page, a notification will be sent to this channel.
              </p>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-zinc-200 mb-2">How to get your Discord Webhook URL:</h3>
              <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-2">
                <li>Open your Discord server and go to the channel where you want to receive notifications (e.g., <span className="text-indigo-400 bg-indigo-400/10 px-1 rounded">#recruitment</span>).</li>
                <li>Click the <strong>Edit Channel</strong> (gear icon) next to the channel name.</li>
                <li>Go to the <strong>Integrations</strong> tab on the left menu.</li>
                <li>Click on <strong>Webhooks</strong> and then <strong>New Webhook</strong>.</li>
                <li>Name your webhook (e.g., "L2 Clan Manager") and click <strong>Copy Webhook URL</strong>.</li>
                <li>Paste the copied URL into the field above and click Save.</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
            <div className="text-sm text-zinc-500">
              {saved && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved successfully
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
