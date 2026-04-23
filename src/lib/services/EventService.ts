import type { Event } from '../models/Event'

export class EventService {
  private events: Event[]

  constructor(events: Event[]) {
    this.events = [...events]
  }

  getAllEvents(): Event[] {
    return [...this.events]
  }

  filterByCategory(categories: string[]): this {
    this.events = this.events.filter(event =>
      event.categories.some(cat => categories.includes(cat))
    )
    return this
  }

  filterByDateRange(startDate: Date, endDate: Date): this {
    this.events = this.events.filter(event => {
      const eventDate = new Date(event.times[0].date)
      return eventDate >= startDate && eventDate <= endDate
    })
    return this
  }

  filterByCostType(costType: string): this {
    this.events = this.events.filter(event => event.costType === costType)
    return this
  }

  filterByVenue(venueId: string): this {
    this.events = this.events.filter(event => event.venueId === venueId)
    return this
  }

  filterByOrganizer(organizerId: string): this {
    this.events = this.events.filter(event => event.organizerId === organizerId)
    return this
  }

  searchByTitle(query: string): this {
    const lowerQuery = query.toLowerCase()
    this.events = this.events.filter(event =>
      event.title.toLowerCase().includes(lowerQuery)
    )
    return this
  }

  sortByDate(direction: 'asc' | 'desc'): this {
    this.events.sort((a, b) => {
      const dateA = new Date(a.times[0].date).getTime()
      const dateB = new Date(b.times[0].date).getTime()
      return direction === 'asc' ? dateA - dateB : dateB - dateA
    })
    return this
  }

  getUpcomingEvents(): this {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    this.events = this.events.filter(event => {
      const eventDate = new Date(event.times[0].date)
      return eventDate >= today
    })
    return this
  }

  // Get the filtered results as an array
  toArray(): Event[] {
    return [...this.events]
  }
}
