import { describe, it, expect } from 'vitest'
import { validateOrganizer } from '$lib/models/Organizer'
import { mockOrganizer1 } from '../fixtures'

describe('Organizer Model - Validation', () => {
  describe('required fields', () => {
    it('should require a name', () => {
      const invalidOrganizer = { ...mockOrganizer1, name: '' }
      expect(() => validateOrganizer(invalidOrganizer)).toThrow('Name is required')
    })

    it('should require a type', () => {
      const invalidOrganizer = { ...mockOrganizer1, type: '' }
      expect(() => validateOrganizer(invalidOrganizer)).toThrow('Type is required')
    })

    it('should accept valid organizer data', () => {
      expect(() => validateOrganizer(mockOrganizer1)).not.toThrow()
    })
  })

  describe('type validation', () => {
    it('should accept valid organizer types', () => {
      const validTypes = ['individual', 'nonprofit', 'business', 'community_group', 'government', 'school']
      validTypes.forEach(type => {
        const organizer = { ...mockOrganizer1, type }
        expect(() => validateOrganizer(organizer)).not.toThrow()
      })
    })

    it('should reject invalid organizer types', () => {
      const invalidOrganizer = { ...mockOrganizer1, type: 'invalid_type' }
      expect(() => validateOrganizer(invalidOrganizer)).toThrow('Invalid organizer type')
    })
  })

  describe('email validation', () => {
    it('should accept valid email', () => {
      const validOrganizer = { ...mockOrganizer1, email: 'test@example.com' }
      expect(() => validateOrganizer(validOrganizer)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidOrganizer = { ...mockOrganizer1, email: 'not-an-email' }
      expect(() => validateOrganizer(invalidOrganizer)).toThrow('Invalid email format')
    })

    it('should allow optional email', () => {
      const organizerNoEmail = { ...mockOrganizer1, email: undefined }
      expect(() => validateOrganizer(organizerNoEmail)).not.toThrow()
    })
  })
})
