import { describe, it, expect } from 'vitest'
import { validateVenue } from '$lib/models/Venue'
import { mockVenue1 } from '../fixtures'

describe('Venue Model - Validation', () => {
  describe('required fields', () => {
    it('should require a name', () => {
      const invalidVenue = { ...mockVenue1, name: '' }
      expect(() => validateVenue(invalidVenue)).toThrow('Name is required')
    })

    it('should require a type', () => {
      const invalidVenue = { ...mockVenue1, type: '' }
      expect(() => validateVenue(invalidVenue)).toThrow('Type is required')
    })

    it('should require an address', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, address: '' } }
      expect(() => validateVenue(invalidVenue)).toThrow('Address is required')
    })

    it('should require a city', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, city: '' } }
      expect(() => validateVenue(invalidVenue)).toThrow('City is required')
    })

    it('should require a zip code', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, zipCode: '' } }
      expect(() => validateVenue(invalidVenue)).toThrow('Zip code is required')
    })

    it('should require latitude', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, latitude: undefined } }
      expect(() => validateVenue(invalidVenue)).toThrow('Latitude is required')
    })

    it('should require longitude', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, longitude: undefined } }
      expect(() => validateVenue(invalidVenue)).toThrow('Longitude is required')
    })

    it('should accept valid venue data', () => {
      expect(() => validateVenue(mockVenue1)).not.toThrow()
    })
  })

  describe('location validation', () => {
    it('should validate latitude range', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, latitude: 95 } }
      expect(() => validateVenue(invalidVenue)).toThrow('Latitude must be between -90 and 90')
    })

    it('should validate longitude range', () => {
      const invalidVenue = { ...mockVenue1, location: { ...mockVenue1.location, longitude: 200 } }
      expect(() => validateVenue(invalidVenue)).toThrow('Longitude must be between -180 and 180')
    })

    it('should accept valid coordinates', () => {
      expect(() => validateVenue(mockVenue1)).not.toThrow()
    })
  })

  describe('type validation', () => {
    it('should accept valid venue types', () => {
      const validTypes = ['park', 'theater', 'coffee_shop', 'museum', 'library']
      validTypes.forEach(type => {
        const venue = { ...mockVenue1, type }
        expect(() => validateVenue(venue)).not.toThrow()
      })
    })

    it('should reject invalid venue types', () => {
      const invalidVenue = { ...mockVenue1, type: 'invalid_type' }
      expect(() => validateVenue(invalidVenue)).toThrow('Invalid venue type')
    })
  })

  describe('capacity validation', () => {
    it('should allow optional capacity', () => {
      const venueNoCapacity = { ...mockVenue1, capacity: undefined }
      expect(() => validateVenue(venueNoCapacity)).not.toThrow()
    })

    it('should reject negative capacity', () => {
      const invalidVenue = { ...mockVenue1, capacity: -10 }
      expect(() => validateVenue(invalidVenue)).toThrow('Capacity must be greater than 0')
    })

    it('should reject zero capacity', () => {
      const invalidVenue = { ...mockVenue1, capacity: 0 }
      expect(() => validateVenue(invalidVenue)).toThrow('Capacity must be greater than 0')
    })

    it('should accept valid capacity', () => {
      expect(() => validateVenue(mockVenue1)).not.toThrow()
    })
  })

  describe('parking validation', () => {
    it('should accept valid parking types', () => {
      const validParking = ['free', 'paid', 'street', 'none']
      validParking.forEach(parking => {
        const venue = { ...mockVenue1, parking }
        expect(() => validateVenue(venue)).not.toThrow()
      })
    })

    it('should reject invalid parking types', () => {
      const invalidVenue = { ...mockVenue1, parking: 'invalid' }
      expect(() => validateVenue(invalidVenue)).toThrow('Invalid parking type')
    })

    it('should allow optional parking', () => {
      const venueNoParking = { ...mockVenue1, parking: undefined }
      expect(() => validateVenue(venueNoParking)).not.toThrow()
    })
  })
})
