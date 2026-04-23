export const mockEvent1 = {
  id: 'indie-dance-party-june-2025',
  title: 'Indie Dance Party',
  description: 'Join us for an evening of indie, alternative, and lo-fi beats.',
  shortDescription: 'Local indie DJs, all ages, free entry',
  categories: ['music', 'nightlife'],
  status: 'published' as const,
  times: [
    {
      date: '2026-06-21',  // ← Changed to 2026 (future)
      startTime: '21:00',
      endTime: '23:59',
      timezone: 'America/Chicago',
    },
  ],
  venueId: 'venue-lakefront-park',
  isOnline: false,
  isHybrid: false,
  organizerId: 'org-rogers-park-arts-collective',
  costType: 'free' as const,
  image: 'https://example.com/indie-dance.jpg',
  wheelchairAccessible: true,
  createdAt: new Date('2025-05-01'),
  updatedAt: new Date('2025-06-01'),
  createdBy: 'org-rogers-park-arts-collective',
}

export const mockEvent2 = {
  id: 'farmers-market-june-saturdays',
  title: 'Rogers Park Farmers Market',
  description: 'Fresh produce from local farmers.',
  shortDescription: 'Seasonal produce every Saturday',
  categories: ['food_beverage', 'community_meeting'],
  status: 'published' as const,
  times: [
    {
      date: '2026-06-07',  // ← Changed to 2026 (future)
      startTime: '08:00',
      endTime: '12:00',
      timezone: 'America/Chicago',
    },
  ],
  venueId: 'venue-lakefront-park',
  isOnline: false,
  isHybrid: false,
  organizerId: 'org-rogers-park-chamber',
  costType: 'free' as const,
  wheelchairAccessible: true,
  createdAt: new Date('2025-04-01'),
  updatedAt: new Date('2025-04-15'),
  createdBy: 'org-rogers-park-chamber',
}

export const mockEvents = [mockEvent1, mockEvent2]

export const mockVenue1 = {
  id: 'venue-lakefront-park',
  name: 'Lakefront Park Rogers Park',
  type: 'park' as const,
  location: {
    address: '6000 N Lake Shore Drive',
    city: 'Chicago',
    neighborhood: 'Rogers Park',
    zipCode: '60626',
    latitude: 41.9875,
    longitude: -87.2567,
  },
  description: 'Large public park with playgrounds and sports facilities',
  capacity: 1000,
  wheelchairAccessible: true,
  petsAllowed: true,
  parking: 'free' as const,
  amenities: ['restrooms', 'parking', 'playground'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-01'),
}

export const mockVenues = [mockVenue1]

export const mockOrganizer1 = {
  id: 'org-rogers-park-arts-collective',
  name: 'Rogers Park Arts Collective',
  type: 'nonprofit' as const,
  bio: 'Grassroots nonprofit supporting local artists',
  email: 'info@rogerspace.org',
  verified: true,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2024-06-01'),
}

export const mockOrganizers = [mockOrganizer1]
