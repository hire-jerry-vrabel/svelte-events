import { describe, it, expect } from 'vitest'
import { validateCategory } from '$lib/models/Category'

describe('Category Model - Validation', () => {
  describe('required fields', () => {
    it('should require an id', () => {
      const invalidCategory = { id: '', name: 'Music' }
      expect(() => validateCategory(invalidCategory)).toThrow('ID is required')
    })

    it('should require a name', () => {
      const invalidCategory = { id: 'music', name: '' }
      expect(() => validateCategory(invalidCategory)).toThrow('Name is required')
    })

    it('should accept valid category data', () => {
      const validCategory = { id: 'music', name: 'Music', description: 'Music events' }
      expect(() => validateCategory(validCategory)).not.toThrow()
    })
  })

  describe('id validation', () => {
    it('should reject id with spaces', () => {
      const invalidCategory = { id: 'music events', name: 'Music Events' }
      expect(() => validateCategory(invalidCategory)).toThrow('ID cannot contain spaces')
    })

    it('should reject id with uppercase', () => {
      const invalidCategory = { id: 'Music', name: 'Music' }
      expect(() => validateCategory(invalidCategory)).toThrow('ID must be lowercase')
    })

    it('should accept valid id', () => {
      const validCategory = { id: 'music-events', name: 'Music Events' }
      expect(() => validateCategory(validCategory)).not.toThrow()
    })
  })
})
