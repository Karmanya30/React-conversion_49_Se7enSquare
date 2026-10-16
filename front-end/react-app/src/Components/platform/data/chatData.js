/** Static data constants for the Chat page. */

export const EMOJIS = ['😊','😂','🔥','❤️','👍','🎉','🤔','😎','💡','🚀','🏆','⚡','🎮','💻','🌟','✨'];

export const DEFAULT_CHANNELS = [
  { id: 1, name: 'general', type: 'text', topic: 'The main hub — say hello, share updates, ask any...' },
];

export const DEMO_MESSAGES = [
  {
    id: 1,
    author: 'Rahul Kumar',
    role: 'Owner',
    initials: 'AK',
    color: '#059669',
    text: 'Welcome to the Pro Gamers community! ✌️',
    time: '10:00 AM',
    reactions: [{ emoji: '🔥', count: 3 }],
  },
  {
    id: 2,
    author: 'Alex Morgan',
    role: 'You',
    initials: 'AM',
    color: '#6366f1',
    text: 'wffffr',
    time: '08:51 AM',
    reactions: [],
  },
  {
    id: 3,
    author: 'Mia Park',
    role: '',
    initials: 'MP',
    color: '#ec4899',
    text: "Got it! We'll be using the Nexus Design System to keep things consistent. Can't wait for tomorrow! 🚀",
    time: '08:51 AM',
    reactions: [{ emoji: '🔥', count: 2 }, { emoji: '🙏', count: 1 }],
  },
];

export const DEMO_MEMBERS = [
  { name: 'Rahul Kumar', role: 'Owner', initials: 'AK', color: '#f97316' },
  { name: 'Arjun Kumar', role: 'Moderator', initials: 'AK', color: '#f97316' },
  { name: 'Jane Doe',    role: 'Member',    initials: 'JD', color: '#06b6d4' },
];
