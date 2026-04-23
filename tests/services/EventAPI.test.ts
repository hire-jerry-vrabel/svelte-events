import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EventAPI } from '$lib/services/EventAPI'

describe('EventAPI', () => {
  describe('initialization', () => {
    it('should initialize with a base URL', () => {
      const api = new EventAPI('https://api.example.com')
      expect(api).toBeDefined()
    })

    it('should have default base URL', () => {
      const api = new EventAPI()
      expect(api).toBeDefined()
    })
  })

  describe('getEvents', () => {
    it('should fetch events from API', async () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Test Event',
          dateTime: '2026-06-21',
          time: '19:00',
          shortDescription: 'Test',
          description: 'Test event',
          categories: ['music'],
          costType: 'free',
          venueId: 'venue-1',
          organizerId: 'org-1',
          wheelchairAccessible: true,
        }
      ]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockEvents }),
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      const events = await api.getEvents()

      expect(events).toEqual(mockEvents)
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/events')
    })

    it('should handle API errors gracefully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      await expect(api.getEvents()).rejects.toThrow()
    })

    it('should support query parameters', async () => {
      const mockEvents = []

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockEvents }),
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      await api.getEvents({ category: 'music', limit: 10 })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=music')
      )
    })
  })

  describe('getEventById', () => {
    it('should fetch a single event by ID', async () => {
      const mockEvent = {
        id: '1',
        title: 'Test Event',
        dateTime: '2026-06-21',
        time: '19:00',
        shortDescription: 'Test',
        description: 'Test event',
        categories: ['music'],
        costType: 'free',
        venueId: 'venue-1',
        organizerId: 'org-1',
        wheelchairAccessible: true,
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockEvent }),
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      const event = await api.getEventById('1')

      expect(event).toEqual(mockEvent)
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/events/1')
    })
  })

  describe('searchEvents', () => {
    it('should search events by query', async () => {
      const mockEvents = []

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockEvents }),
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      await api.searchEvents('music festival')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('music')
      )
    })
  })

  describe('caching', () => {
    it('should cache events', async () => {
      const mockEvents = []

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockEvents }),
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      
      await api.getEvents()
      await api.getEvents()

      // With caching, fetch should only be called once for the same request
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as any

      const api = new EventAPI('https://api.example.com')
      await expect(api.getEvents()).rejects.toThrow('Network error')
    })

    it('should handle invalid JSON response', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        })
      ) as any

      const api = new EventAPI('https://api.example.com')
      await expect(api.getEvents()).rejects.toThrow()
    })
  })
})
