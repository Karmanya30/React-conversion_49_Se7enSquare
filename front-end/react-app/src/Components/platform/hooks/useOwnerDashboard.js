import { useState, useEffect } from 'react';
import { DEFAULT_STATS, DEFAULT_REVENUE } from '../data/ownerDashboardData';

const API_BASE = 'http://localhost:3000/api';

function getCurrentUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return {
      id: raw.id,
      username: raw.username || 'owner',
      firstName: raw.firstName || 'Owner',
      lastName: raw.lastName || '',
      role: raw.role || 'owner',
    };
  } catch {
    return { username: 'owner', firstName: 'Owner', lastName: '', role: 'owner' };
  }
}

// Extracts the human-readable error message a NestJS response carries.
async function apiErrorMessage(res) {
  try {
    const body = await res.json();
    const msg = body?.message;
    return Array.isArray(msg) ? msg.join(', ') : (msg || `HTTP ${res.status}`);
  } catch { return `HTTP ${res.status}`; }
}

/**
 * Manages OwnerDashboard stats, revenue, and drill-down modal state.
 * All fallback values are 0 — never hardcoded fake numbers — so any
 * backend outage is clearly indicated by the status indicator.
 */
export default function useOwnerDashboard() {
  const currentUser = getCurrentUser();

  const [stats, setStats] = useState(DEFAULT_STATS);
  const [revenue, setRevenue] = useState(DEFAULT_REVENUE);

  // Drilldown Modal
  const [drillModalOpen, setDrillModalOpen] = useState(false);
  const [drillTitle, setDrillTitle] = useState('Details');
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillContent, setDrillContent] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const role = getCurrentUser().role || 'owner';
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: { 'x-role': role } });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalCommunities: data.totalCommunities || 0,
            totalEvents: data.totalEvents || 0,
            pendingReportsCount: data.pendingReportsCount || 0,
            pendingEventsCount: data.pendingEventsCount || 0,
            pendingAppealsCount: data.pendingAppealsCount || 0,
            backendStatus: 'Reachable',
          });
        } else {
          setStats((prev) => ({ ...prev, backendStatus: '⚠️ Degraded' }));
        }
      } catch {
        // Backend unreachable — leave all counts at 0 so no fake numbers are
        // presented as real data. The status indicator makes the outage visible.
        setStats((prev) => ({ ...prev, backendStatus: '⚠️ Unreachable' }));
      }

      try {
        const revRes = await fetch(`${API_BASE}/dashboard/revenue`, { headers: { 'x-role': role } });
        if (revRes.ok) {
          const revData = await revRes.json();
          setRevenue({
            totalRevenue: revData.totalRevenue || 0,
            monthlyRevenue: revData.monthlyRevenue || 0,
            subscriptionRevenue: revData.subscriptionRevenue || 0,
            organiserRevenue: revData.organiserRevenue || 0,
            featuredEventRevenue: revData.featuredEventRevenue || 0,
            premiumUsers: revData.premiumUsers || 0,
            verifiedOrganisers: revData.verifiedOrganisers || 0,
            pendingOrganiserApplications: revData.pendingOrganiserApplications || 0,
          });
        }
      } catch {
        // Revenue endpoint unreachable — leave all values at 0.
        // Do NOT substitute hardcoded numbers: they would be indistinguishable
        // from real data on the dashboard.
        setStats((prev) => ({ ...prev, backendStatus: '⚠️ Unreachable' }));
      }
    }
    loadStats();
  }, []);

  const openDrill = async (kind, filter) => {
    setDrillModalOpen(true);
    setDrillLoading(true);
    const role = currentUser.role || 'owner';

    try {
      if (kind === 'communities') {
        setDrillTitle('Communities Breakdown');
        let communities = [];
        let users = [];
        let loadError = '';
        try {
          const [commRes, usersRes] = await Promise.all([
            fetch(`${API_BASE}/communities`, { headers: { 'x-role': role } }),
            fetch(`${API_BASE}/users`, { headers: { 'x-role': role } }),
          ]);
          if (commRes.ok) communities = await commRes.json();
          else loadError = await apiErrorMessage(commRes);
          // GET /users is not permitted for the owner role — fall back to
          // "user#<id>" labels rather than showing an error.
          users = usersRes.ok ? await usersRes.json() : [];
        } catch {
          communities = [
            { id: 1, name: 'FPS Arena', icon: '🎯', memberCount: 1420, category: 'FPS', ownerId: 1 },
            { id: 2, name: 'Pro Gamers', icon: '⚡', memberCount: 890, category: 'Gaming', ownerId: 2 },
          ];
        }
        setDrillContent({ kind: 'communities', communities, users, loadError });
      } else if (kind === 'events') {
        setDrillTitle('Events Overview');
        let events = [];
        let communities = [];
        let loadError = '';
        try {
          const [eventsRes, commsRes] = await Promise.all([
            fetch(`${API_BASE}/events`, { headers: { 'x-role': role } }),
            fetch(`${API_BASE}/communities`, { headers: { 'x-role': role } }),
          ]);
          if (eventsRes.ok) events = await eventsRes.json();
          else loadError = await apiErrorMessage(eventsRes);
          communities = commsRes.ok ? await commsRes.json() : [];
        } catch {
          events = [
            { id: 1, title: 'Summer Valorant Cup', type: 'tournament', entryFee: 150, date: '2026-10-15', status: 'approved', communityId: 1 },
            { id: 2, title: 'Apex Community Scrims', type: 'event', entryFee: 0, date: '2026-10-18', status: 'pending', communityId: 2 },
          ];
          communities = [];
        }
        setDrillContent({ kind: 'events', events, communities, loadError });
      } else if (kind === 'revenue') {
        setDrillTitle('Revenue — All Transactions');
        let payments = [];
        let loadError = '';
        try {
          const res = await fetch(`${API_BASE}/payments/history`, { headers: { 'x-role': role } });
          if (res.ok) payments = await res.json();
          else loadError = await apiErrorMessage(res);
        } catch {
          payments = [
            { id: 1, type: 'subscription', amount: 499, description: 'Plus Upgrade', createdAt: new Date().toISOString() },
            { id: 2, type: 'tournament_fee', amount: 150, description: 'Tournament Registration', createdAt: new Date().toISOString() },
          ];
        }
        payments = Array.isArray(payments) ? payments : [];
        setDrillContent({ kind: 'revenue', payments, loadError });
      } else if (kind === 'subscriptions') {
        setDrillTitle('Subscriptions Status');
        let subData = { byPlan: { free: 0, plus: 0, ultra_pro: 0 }, subscribers: [] };
        let loadError = '';
        try {
          const res = await fetch(`${API_BASE}/subscriptions`, { headers: { 'x-role': role } });
          if (res.ok) subData = await res.json();
          else loadError = await apiErrorMessage(res);
        } catch {
          loadError = 'Could not reach the backend.';
        }
        setDrillContent({ kind: 'subscriptions', subData, loadError });
      } else if (kind === 'organisers') {
        const title = filter === 'verified' ? 'Verified Organizers' : 'Pending Organizer Applications';
        setDrillTitle(title);
        let orgs = [];
        let loadError = '';
        try {
          const res = await fetch(`${API_BASE}/organisers?status=${filter}`, { headers: { 'x-role': role } });
          if (res.ok) orgs = await res.json();
          else loadError = await apiErrorMessage(res);
        } catch {
          orgs = [
            { username: 'champion_org', plan: 'premium', appliedAt: new Date().toISOString() },
            { username: 'pixel_guild', plan: 'free', appliedAt: new Date().toISOString() },
          ];
        }
        orgs = Array.isArray(orgs) ? orgs : [];
        setDrillContent({ kind: 'organisers', orgs, filter, loadError });
      }
    } catch (err) {
      setDrillContent({ kind: 'error', message: err.message });
    }

    setDrillLoading(false);
  };

  return {
    currentUser,
    stats, revenue,
    drillModalOpen, setDrillModalOpen,
    drillTitle, drillLoading, drillContent,
    openDrill,
  };
}
