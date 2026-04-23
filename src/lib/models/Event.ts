export type EventStatus = 'draft' | 'published' | 'cancelled' | 'postponed' | 'archived'
export type CostType = 'free' | 'paid' | 'donation' | 'pay_what_you_wish'
export type VenueType = 'park' | 'theater' | 'coffee_shop' | 'bar_restaurant' | 'community_center' | 'library' | 'museum' | 'gallery' | 'school' | 'church' | 'music_venue' | 'sports_facility' | 'outdoor_public_space' | 'commercial_storefront' | 'nonprofit_space'
export type EventCategory = 'music' | 'theater_performance' | 'visual_arts' | 'film' | 'literature' | 'food_beverage' | 'sports_recreation' | 'health_wellness' | 'education_workshop' | 'community_meeting' | 'cultural_festival' | 'volunteer' | 'kids_family' | 'nightlife' | 'networking' | 'seasonal'

export interface EventTime {
  date: string
  startTime: string
  endTime: string
  timezone: string
}

export interface Event {
  id: string
  title: string
  description: string
  shortDescription?: string
  categories: EventCategory[]
  status: EventStatus
  times: EventTime[]
  venueId: string
  isOnline: boolean
  isHybrid: boolean
  organizerId: string
  costType: CostType
  cost?: {
    minPrice?: number
    maxPrice?: number
    currency: string
  }
  image?: string
  wheelchairAccessible?: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export function validateEvent(event: any): void {
  // Required fields
  if (!event.title?.trim()) {
    throw new Error('Title is required')
  }

  if (!event.categories || event.categories.length === 0) {
    throw new Error('At least one category is required')
  }

  if (!event.venueId?.trim()) {
    throw new Error('Venue ID is required')
  }

  if (!event.organizerId?.trim()) {
    throw new Error('Organizer ID is required')
  }

  // Date validation
  if (event.times && event.times.length > 0) {
    const eventDate = new Date(event.times[0].date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (eventDate < today) {
      throw new Error('Event date cannot be in the past')
    }

    // Time validation
    const time = event.times[0]
    if (time.startTime && time.endTime) {
      if (time.endTime <= time.startTime) {
        throw new Error('End time must be after start time')
      }
    }
  }

  // Cost validation
  if (event.costType === 'paid' && !event.cost) {
    throw new Error('Paid events must include cost information')
  }
}
