/**
 * Pricing plans data copied exactly from original Pricing.jsx
 */
export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 4 communities',
      'Up to 4 channels per community',
      '1 moderator',
      'Limited uploads',
      'Basic profile',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 99,
    features: [
      '10 communities',
      '20 channels per community',
      'Up to 5 moderators',
      'Premium badge',
      'Username color',
      'Larger uploads',
    ],
  },
  {
    id: 'ultra_pro',
    name: 'Ultra Pro',
    price: 299,
    featured: true,
    features: [
      'Unlimited communities',
      'Unlimited channels',
      'Unlimited moderators',
      'Unlimited members',
      'Animated profile frame',
      'HD Voice',
      'Community Insights Dashboard',
      'Community Boost features',
    ],
  },
];

export const PLAN_RANK = { free: 0, plus: 1, ultra_pro: 2 };
