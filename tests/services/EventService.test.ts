import { describe, it, expect, beforeEach } from 'vitest'
import { EventService } from '$lib/services/EventService'
import { mockEvent1, mockEvent2, mockEvents } from '../fixtures'

describe('EventService', () => {
  let service: EventService

  beforeEach(() => {
    service = new EventService(mockEvents)
  })

  describe('getAllEvents', () => {
    it('should return all events', () => {
      const events = service.getAllEvents()
      expect(events).toHaveLength(2)
    })

    it('should return events in order', () => {
      const events = service.getAllEvents()
      expect(events[0].id).toBe('indie-dance-party-june-2025')
      expect(events[1].id).toBe('farmers-market-june-saturdays')
    })
  })

  describe('filterByCategory', () => {
    it('should filter events by single category', () => {
      const musicEvents = service.filterByCategory(['music']).toArray()
      expect(musicEvents).toHaveLength(1)
      expect(musicEvents[0].title).toBe('Indie Dance Party')
    })

    it('should filter events by multiple categories', () => {
      const events = service.filterByCategory(['music', 'food_beverage']).toArray()
      expect(events).toHaveLength(2)
    })

    it('should return empty array if no matches', () => {
      const events = service.filterByCategory(['film']).toArray()
      expect(events).toHaveLength(0)
    })

    it('should be case sensitive', () => {
      const events = service.filterByCategory(['MUSIC']).toArray()
      expect(events).toHaveLength(0)
    })
  })

  describe('filterByDateRange', () => {
    it('should filter events within date range', () => {
      const startDate = new Date('2026-06-01')
      const endDate = new Date('2026-06-15')
      const events = service.filterByDateRange(startDate, endDate).toArray()
      expect(events).toHaveLength(1)
      expect(events[0].title).toBe('Rogers Park Farmers Market')
    })

    it('should include events on start date', () => {
      const startDate = new Date('2026-06-07')
      const endDate = new Date('2026-06-10')
      const events = service.filterByDateRange(startDate, endDate).toArray()
      expect(events).toHaveLength(1)
    })

    it('should include events on end date', () => {
      const startDate = new Date('2026-06-20')
      const endDate = new Date('2026-06-21')
      const events = service.filterByDateRange(startDate, endDate).toArray()
      expect(events).toHaveLength(1)
    })

    it('should return empty if no events in range', () => {
      const startDate = new Date('2026-07-01')
      const endDate = new Date('2026-07-31')
      const events = service.filterByDateRange(startDate, endDate).toArray()
      expect(events).toHaveLength(0)
    })
  })

  describe('filterByCostType', () => {
    it('should filter events by cost type', () => {
      const freeEvents = service.filterByCostType('free').toArray()
      expect(freeEvents).toHaveLength(2)
    })

    it('should return empty for non-existent cost type', () => {
      const paidEvents = service.filterByCostType('paid').toArray()
      expect(paidEvents).toHaveLength(0)
    })
  })

  describe('filterByVenue', () => {
    it('should filter events by venue', () => {
      const events = service.filterByVenue('venue-lakefront-park').toArray()
      expect(events).toHaveLength(2)
    })

    it('should return empty if venue has no events', () => {
      const events = service.filterByVenue('venue-nonexistent').toArray()
      expect(events).toHaveLength(0)
    })
  })

  describe('filterByOrganizer', () => {
    it('should filter events by organizer', () => {
      const events = service.filterByOrganizer('org-rogers-park-arts-collective').toArray()
      expect(events).toHaveLength(1)
      expect(events[0].title).toBe('Indie Dance Party')
    })

    it('should return empty if organizer has no events', () => {
      const events = service.filterByOrganizer('org-nonexistent').toArray()
      expect(events).toHaveLength(0)
    })
  })

  describe('searchByTitle', () => {
    it('should search events by title (case insensitive)', () => {
      const events = service.searchByTitle('dance').toArray()
      expect(events).toHaveLength(1)
      expect(events[0].title).toBe('Indie Dance Party')
    })

    it('should search by partial title', () => {
      const events = service.searchByTitle('farmers').toArray()
      expect(events).toHaveLength(1)
    })

    it('should return empty if no matches', () => {
      const events = service.searchByTitle('concert').toArray()
      expect(events).toHaveLength(0)
    })
  })

  describe('sortByDate', () => {
    it('should sort events by date ascending', () => {
      const events = service.sortByDate('asc').toArray()
      expect(events[0].times[0].date).toBe('2026-06-07')
      expect(events[1].times[0].date).toBe('2026-06-21')
    })

    it('should sort events by date descending', () => {
      const events = service.sortByDate('desc').toArray()
      expect(events[0].times[0].date).toBe('2026-06-21')
      expect(events[1].times[0].date).toBe('2026-06-07')
    })
  })

  describe('getUpcomingEvents', () => {
    it('should return only future events', () => {
      const events = service.getUpcomingEvents().toArray()
      expect(events.length).toBeGreaterThan(0)
      events.forEach(event => {
        const eventDate = new Date(event.times[0].date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        expect(eventDate.getTime()).toBeGreaterThanOrEqual(today.getTime())
      })
    })
  })

  describe('chainable filtering', () => {
    it('should allow chaining multiple filters', () => {
      const events = service
        .filterByCategory(['music', 'food_beverage'])
        .filterByCostType('free')
        .sortByDate('asc')
        .toArray()
      
      expect(events).toHaveLength(2)
      expect(events[0].costType).toBe('free')
    })
  })
})
