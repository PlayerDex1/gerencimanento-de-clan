// Create a new clan
app.post('/api/clans', async (req, res) => {
  try {
    const { name, server, leader_id, in_game_name, className, classGroup } = req.body;
    const clanId = 'c_' + Date.now();
    
    const { error: clanError } = await supabase.from('clans').insert([{ id: clanId, name, server, leader_id }]);
    if (clanError) {
      console.error('Supabase Clan Error:', clanError);
      return res.status(400).json({ error: `Supabase Error: ${clanError.message}` });
    }
    
    const memberId = 'm_' + Date.now();
    const { error: memberError } = await supabase.from('members').insert([{
      id: memberId, 
      clan_id: clanId, 
      user_id: leader_id, 
      in_game_name, 
      class: className, 
      class_group: classGroup, 
      role: 'leader', 
      join_date: new Date().toISOString()
    }]);

    if (memberError) {
      console.error('Supabase Member Error:', memberError);
      return res.status(400).json({ error: `Supabase Error: ${memberError.message}` });
    }
    
    res.json({ success: true, clanId });
  } catch (error: any) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create clan' });
  }
});

// Catch-all for API routes to prevent HTML 404s
app.use((req, res) => {
  res.status(404).json({ error: `API Route not found: ${req.method} ${req.url}` });
});

export default app;
