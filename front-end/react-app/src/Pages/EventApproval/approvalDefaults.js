// Fallback sample data for the Event Approval Dashboard.
import { EVENT_STATUSES } from '../../Components/event-management/utils/constants';

export const DEFAULT_APPROVAL_EVENTS = [
  {
    id: 1,
    title: 'Valorant Regional Qualifiers',
    description: 'Official collegiate 5v5 tournament with single elimination format.',
    date: '2026-10-18',
    time: '5:00 PM',
    communityId: 1,
    createdBy: 'player01',
    status: EVENT_STATUSES.PENDING,
    maxAttendees: 64,
    category: 'tournament',
  },
  {
    id: 2,
    title: 'Apex Legends Duo Scrims',
    description: 'Custom lobby practice for ranked players with live casting.',
    date: '2026-10-20',
    time: '7:00 PM',
    communityId: 2,
    createdBy: 'gamer99',
    status: EVENT_STATUSES.APPROVED,
    maxAttendees: 60,
    category: 'scrim',
  },
];

export const DEFAULT_APPROVAL_COMMUNITIES = [
  { id: 1, name: 'FPS Arena' },
  { id: 2, name: 'Pro Gamers' },
];
