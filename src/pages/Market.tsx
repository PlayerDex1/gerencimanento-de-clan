import { useState } from 'react';
import { Search, ShoppingCart, Clock, ArrowUpDown, Filter } from 'lucide-react';

export default function Market() {
  // Mock data based exactly on the ZGaming Discord screenshot
  const [marketItems, setMarketItems] = useState([
    {
      id: '1',
      name: '+6 Talisman of Aden (Sealed)',
      price: 17,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:01:07',
      iconUrl: 'https://l2db.info/icon/etc_talisman_of_aden_i05.png' // Placeholder icon
    },
    {
      id: '2',
      name: '+8 Cloak of Protection (Sealed)',
      price: 169,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:01:34',
      iconUrl: 'https://l2db.info/icon/cloak_of_protection_i00.png'
    },
    {
      id: '3',
      name: 'Talisman of Authority (Sealed)',
      price: 3,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:02:11',
      iconUrl: 'https://l2db.info/icon/etc_talisman_of_authority_i00.png'
    },
    {
      id: '4',
      name: 'Talisman of Authority (Sealed)',
      price: 3,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:02:17',
      iconUrl: 'https://l2db.info/icon/etc_talisman_of_authority_i00.png'
    },
    {
      id: '5',
      name: 'Dye Booster',
      price: 22,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:02:23',
      iconUrl: 'https://l2db.info/icon/etc_dye_booster_i00.png'
    },
    {
      id: '6',
      name: '+5 Talisman of Aden (Sealed)',
      price: 5,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:02:31',
      iconUrl: 'https://l2db.info/icon/etc_talisman_of_aden_i04.png'
    },
    {
      id: '7',
      name: '+3 Talisman of Authority (Sealed)',
      price: 31,
      currency: 'zCoin',
      timestamp: '2026-02-26T18:02:34',
      iconUrl: 'https://l2db.info/icon/etc_talisman_of_authority_i03.png'
    }
  ]);

  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredAndSortedItems = marketItems
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aValue = a[sortConfig.key as keyof typeof a];
      let bValue = b[sortConfig.key as keyof typeof b];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Market Tracker</h1>
          <p className="text-zinc-400 mt-1">Live feed of items added to the ZGaming market.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">Bot Connected</span>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search items (e.g. 'Talisman', '+6')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-zinc-500 hidden sm:block" />
            <select className="flex-1 sm:w-40 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Currencies</option>
              <option value="zcoin">zCoin</option>
              <option value="adena">Adena</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-950/50 text-zinc-400 uppercase tracking-wider text-xs font-medium">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Item Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">Price <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center gap-1">Time Added <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredAndSortedItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No items found matching your search.</td>
                </tr>
              ) : filteredAndSortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden">
                        <img src={item.iconUrl} alt={item.name} className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://l2db.info/icon/weapon_the_sword_of_hero_i00.png'; }} />
                      </div>
                      <span className={item.name.includes('+') ? 'text-amber-400' : 'text-zinc-200'}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-amber-500">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">z</div>
                      {item.price.toLocaleString()} {item.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-500" />
                      {formatTime(item.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium transition-colors text-xs">
                      <ShoppingCart className="w-3 h-3" />
                      Notify Me
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
