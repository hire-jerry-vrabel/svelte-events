import type { Event } from '../models/Event'

export interface EventAPIOptions {
  category?: string
  limit?: number
  offset?: number
  startDate?: string
  endDate?: string
}

export class EventAPI {
  private baseUrl: string
  private cache: Map<string, { data: Event[]; timestamp: number }>

  constructor(baseUrl: string = 'https://api.example.com') {
    this.baseUrl = baseUrl
    this.cache = new Map()
  }

  private getCacheKey(url: string): string {
    return url
  }

  private isCacheValid(timestamp: number, maxAge: number = 5 * 60 * 1000): boolean {
    return Date.now() - timestamp < maxAge
  }

  private buildQueryString(params?: EventAPIOptions): string {
    if (!params) return ''

    const query = new URLSearchParams()

    if (params.category) query.append('category', params.category)
    if (params.limit) query.append('limit', params.limit.toString())
    if (params.offset) query.append('offset', params.offset.toString())
    if (params.startDate) query.append('startDate', params.startDate)
    if (params.endDate) query.append('endDate', params.endDate)

    const queryString = query.toString()
    return queryString ? `?${queryString}` : ''
  }

  async getEvents(options?: EventAPIOptions): Promise<Event[]> {
    const url = `${this.baseUrl}/events${this.buildQueryString(options)}`
    const cacheKey = this.getCacheKey(url)

    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      
      // json-server returns array directly, not wrapped in {data: ...}
      const events = Array.isArray(result) ? result : (result.data || [])

      // Cache the result
      this.cache.set(cacheKey, {
        data: events,
        timestamp: Date.now(),
      })

      return events
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    }
  }

  async getEventById(id: string): Promise<Event> {
    const url = `${this.baseUrl}/events/${id}`
    const cacheKey = this.getCacheKey(url)

    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data[0]
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      
      // json-server returns object directly
      const event = Array.isArray(result) ? result[0] : (result.data || result)

      // Cache the result
      this.cache.set(cacheKey, {
        data: [event],
        timestamp: Date.now(),
      })

      return event
    } catch (error) {
      console.error('Failed to fetch event:', error)
      throw error
    }
  }

  async searchEvents(query: string, options?: EventAPIOptions): Promise<Event[]> {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)

    if (options?.category) queryParams.append('category', options.category)
    if (options?.limit) queryParams.append('limit', options.limit.toString())

    const url = `${this.baseUrl}/events?${queryParams.toString()}`
    const cacheKey = this.getCacheKey(url)

    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      
      // json-server returns array directly
      const events = Array.isArray(result) ? result : (result.data || [])

      // Cache the result
      this.cache.set(cacheKey, {
        data: events,
        timestamp: Date.now(),
      })

      return events
    } catch (error) {
      console.error('Failed to search events:', error)
      throw error
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  clearCacheForKey(url: string): void {
    this.cache.delete(url)
  }
}
