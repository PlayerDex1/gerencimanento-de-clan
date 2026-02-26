import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Users, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState<any[]>([
    { id: 'e1', name: 'Antharas Raid', type: 'Epic Boss', date: new Date(Date.now() + 86400000).toISOString(), mandatory: true },
    { id: 'e2', name: 'Castle Siege', type: 'PvP', date: new Date(Date.now() + 172800000).toISOString(), mandatory: true },
    { id: 'e3', name: 'Clan Farm', type: 'PvE', date: new Date(Date.now() + 259200000).toISOString(), mandatory: false }
  ]);
  const [loading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Events & Attendance</h1>
          <p className="text-zinc-400 mt-1">Schedule raids, sieges, and track member attendance.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-zinc-500">Loading events...</div>
        ) : events.map((event) => (
          <div key={event.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100 group-hover:text-indigo-400 transition-colors">{event.name}</h3>
                    <p className="text-sm font-medium text-zinc-500">{event.type}</p>
                  </div>
                </div>
                {event.mandatory ? (
                  <div className="px-2.5 py-1 rounded-md bg-red-500/10 text-xs font-bold text-red-400 border border-red-500/20">
                    Mandatory
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-bold text-zinc-400">
                    Optional
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span>{format(new Date(event.date), 'MMM d, yyyy • h:mm a')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>Location TBD</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex -space-x-2 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900 bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
                    ?
                  </div>
                ))}
              </div>
              <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Manage Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
