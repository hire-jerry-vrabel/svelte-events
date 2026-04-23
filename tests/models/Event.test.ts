import { describe, it, expect } from 'vitest'
import { mockEvent1, mockEvent2, mockEvents } from '../fixtures'

describe('Event Model - Validation', () => {
  describe('required fields', () => {
    it('should require a title', () => {
      const invalidEvent = { ...mockEvent1, title: '' }
      expect(() => validateEvent(invalidEvent)).toThrow('Title is required')
    })

    it('should require at least one category', () => {
      const invalidEvent = { ...mockEvent1, categories: [] }
      expect(() => validateEvent(invalidEvent)).toThrow('At least one category is required')
    })

    it('should require a venue ID', () => {
      const invalidEvent = { ...mockEvent1, venueId: '' }
      expect(() => validateEvent(invalidEvent)).toThrow('Venue ID is required')
    })

    it('should require an organizer ID', () => {
      const invalidEvent = { ...mockEvent1, organizerId: '' }
      expect(() => validateEvent(invalidEvent)).toThrow('Organizer ID is required')
    })

    it('should accept valid event data', () => {
      expect(() => validateEvent(mockEvent1)).not.toThrow()
    })
  })

  describe('date validation', () => {
    it('should reject past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const pastEvent = {
        ...mockEvent1,
        times: [{
          date: yesterday.toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '21:00',
          timezone: 'America/Chicago',
        }],
      }
      
      expect(() => validateEvent(pastEvent)).toThrow('Event date cannot be in the past')
    })

    it('should accept future dates', () => {
      expect(() => validateEvent(mockEvent1)).not.toThrow()
    })
  })

  describe('time validation', () => {
    it('should require end time to be after start time', () => {
      const invalidEvent = {
        ...mockEvent1,
        times: [{
          date: '2026-06-21',
          startTime: '21:00',
          endTime: '19:00', // Before start!
          timezone: 'America/Chicago',
        }],
      }
      
      expect(() => validateEvent(invalidEvent)).toThrow('End time must be after start time')
    })

    it('should accept valid time ranges', () => {
      expect(() => validateEvent(mockEvent1)).not.toThrow()
    })
  })

  describe('cost validation', () => {
    it('should accept free events', () => {
      expect(() => validateEvent(mockEvent1)).not.toThrow()
    })

    it('should require price for paid events', () => {
      const paidEvent = {
        ...mockEvent1,
        costType: 'paid',
        cost: undefined,
      }
      
      expect(() => validateEvent(paidEvent)).toThrow('Paid events must include cost information')
    })

    it('should accept paid events with valid price', () => {
      const paidEvent = {
        ...mockEvent1,
        costType: 'paid',
        cost: {
          minPrice: 10,
          maxPrice: 25,
          currency: 'USD',
        },
      }
      
      expect(() => validateEvent(paidEvent)).not.toThrow()
    })
  })
})

function validateEvent(event: any): void {
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
  
  if (event.times && event.times.length > 0) {
    const eventDate = new Date(event.times[0].date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (eventDate < today) {
      throw new Error('Event date cannot be in the past')
    }
  }
  
  if (event.times && event.times.length > 0) {
    const time = event.times[0]
    if (time.endTime <= time.startTime) {
      throw new Error('End time must be after start time')
    }
  }
  
  if (event.costType === 'paid' && !event.cost) {
    throw new Error('Paid events must include cost information')
  }
}
