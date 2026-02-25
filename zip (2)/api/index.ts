import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mgylypvmgjebvpxhlmly.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RG-4on-iquEBjcvHD-ZAMw_SqZTkHTS';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// Get all members for a clan
app.get('/api/clans/:clanId/members', async (req, res) => {
  try {
    const clanId = req.params.clanId;
    const [{ data: members }, { data: cps }, { data: events }] = await Promise.all([
      supabase.from('members').select('*').eq('clan_id', clanId),
      supabase.from('constant_parties').select('*').eq('clan_id', clanId),
      supabase.from('events').select('id').eq('clan_id', clanId)
    ]);
    
    const memberIds = members?.map(m => m.id) || [];
    let attendees: any[] = [];
    if (memberIds.length > 0) {
      const { data: att } = await supabase.from('event_attendees').select('*').in('member_id', memberIds);
      attendees = att || [];
    }

    const totalEvents = events?.length || 0;

    const enrichedMembers = (members || []).map(m => {
      const cp = cps?.find(c => c.id === m.cp_id);
      const attended = attendees.filter(a => a.member_id === m.id).length;
      return {
        ...m,
        cp_name: cp ? cp.name : null,
        attended_events: attended,
        total_events: totalEvents
      };
    });

    res.json(enrichedMembers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Remove a member
app.delete('/api/clans/:clanId/members/:memberId', async (req, res) => {
  try {
    await supabase.from('members').delete().eq('id', req.params.memberId).eq('clan_id', req.params.clanId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Get all CPs for a clan
app.get('/api/clans/:clanId/cps', async (req, res) => {
  try {
    const clanId = req.params.clanId;
    const [{ data: cps }, { data: members }, { data: users }] = await Promise.all([
      supabase.from('constant_parties').select('*').eq('clan_id', clanId),
      supabase.from('members').select('*').eq('clan_id', clanId),
      supabase.from('users').select('*')
    ]);

    const enrichedCps = (cps || []).map(cp => {
      const cpMembers = (members || []).filter(m => m.cp_id === cp.id);
      const leader = users?.find(u => u.id === cp.leader_id);
      return {
        ...cp,
        leader_name: leader ? leader.username : 'Unknown',
        members: cpMembers
      };
    });
    res.json(enrichedCps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CPs' });
  }
});

// Update CP needs
app.put('/api/clans/:clanId/cps/:cpId/needs', async (req, res) => {
  try {
    await supabase.from('constant_parties').update({ recruiting_classes: req.body.recruiting_classes }).eq('id', req.params.cpId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update CP needs' });
  }
});

// Get all events for a clan
app.get('/api/clans/:clanId/events', async (req, res) => {
  try {
    const { data: events } = await supabase.from('events').select('*').eq('clan_id', req.params.clanId).order('date', { ascending: false });
    res.json(events || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get applications
app.get('/api/clans/:clanId/applications', async (req, res) => {
  try {
    const { data: apps } = await supabase.from('applications').select('*').eq('clan_id', req.params.clanId).order('created_at', { ascending: false });
    res.json(apps || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Submit application
app.post('/api/clans/:clanId/applications', async (req, res) => {
  try {
    const { type, name, class: className, level, combat_power, discord, playtime, notes } = req.body;
    const id = 'app_' + Date.now();
    const now = new Date().toISOString();
    
    await supabase.from('applications').insert([{
      id, clan_id: req.params.clanId, type, name, class: className, level, combat_power, discord, playtime, notes, created_at: now
    }]);
    
    // Discord Webhook Integration
    const { data: clan } = await supabase.from('clans').select('name, discord_webhook_url').eq('id', req.params.clanId).single();
    
    if (clan && clan.discord_webhook_url) {
      const embed = {
        title: `🛡️ New Recruitment Application: ${name}`,
        description: `A new **${type === 'cp' ? 'Constant Party' : 'Solo Player'}** has applied to join **${clan.name}**.`,
        color: 0x5865F2,
        fields: [
          { name: 'Class / Comp', value: className, inline: true },
          { name: 'Level', value: level.toString(), inline: true },
          { name: 'Combat Power', value: combat_power.toString(), inline: true },
          { name: 'Discord Contact', value: discord, inline: true },
          { name: 'Playtime', value: playtime, inline: true },
          { name: 'Notes', value: notes || 'No additional notes provided.', inline: false }
        ],
        footer: { text: 'L2 Clan Manager • Recruitment System' },
        timestamp: now
      };

      try {
        await fetch(clan.discord_webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] })
        });
      } catch (webhookError) {
        console.error('Failed to send Discord webhook:', webhookError);
      }
    }

    res.json({ success: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get clan settings
app.get('/api/clans/:clanId/settings', async (req, res) => {
  try {
    const { data: clan } = await supabase.from('clans').select('discord_webhook_url').eq('id', req.params.clanId).single();
    res.json(clan || { discord_webhook_url: '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update clan settings
app.put('/api/clans/:clanId/settings', async (req, res) => {
  try {
    const { discord_webhook_url } = req.body;
    await supabase.from('clans').update({ discord_webhook_url }).eq('id', req.params.clanId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update application status
app.put('/api/clans/:clanId/applications/:appId/status', async (req, res) => {
  try {
    const { status } = req.body;
    await supabase.from('applications').update({ status }).eq('id', req.params.appId).eq('clan_id', req.params.clanId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Sync user from Supabase Auth
app.post('/api/users', async (req, res) => {
  try {
    const { id, email, username } = req.body;
    await supabase.from('users').upsert([{ id, email, username, created_at: new Date().toISOString() }]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get user context (profile, clan, member)
app.get('/api/users/:userId/context', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { data: member } = await supabase.from('members').select('*').eq('user_id', userId).single();
    let clan = null;
    
    if (member) {
      const { data: clanData } = await supabase.from('clans').select('*').eq('id', member.clan_id).single();
      clan = clanData;
    } else {
      const { data: clanData } = await supabase.from('clans').select('*').eq('leader_id', userId).single();
      clan = clanData;
    }
    
    res.json({ user, member, clan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch context' });
  }
});

// Create a new clan
app.post('/api/clans', async (req, res) => {
  try {
    const { name, server, leader_id, in_game_name, className, classGroup } = req.body;
    const clanId = 'c_' + Date.now();
    
    await supabase.from('clans').insert([{ id: clanId, name, server, leader_id }]);
    
    const memberId = 'm_' + Date.now();
    await supabase.from('members').insert([{
      id: memberId, 
      clan_id: clanId, 
      user_id: leader_id, 
      in_game_name, 
      class: className, 
      class_group: classGroup, 
      role: 'leader', 
      join_date: new Date().toISOString()
    }]);
    
    res.json({ success: true, clanId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create clan' });
  }
});

export default app;
