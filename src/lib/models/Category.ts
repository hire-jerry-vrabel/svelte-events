export type EventCategory = 'music' | 'theater_performance' | 'visual_arts' | 'film' | 'literature' | 'food_beverage' | 'sports_recreation' | 'health_wellness' | 'education_workshop' | 'community_meeting' | 'cultural_festival' | 'volunteer' | 'kids_family' | 'nightlife' | 'networking' | 'seasonal'

export interface Category {
  id: string
  name: string
  description?: string
  emoji?: string
  color?: string
  icon?: string
}

export function validateCategory(category: any): void {
  if (!category.id?.trim()) {
    throw new Error('ID is required')
  }

  if (!category.name?.trim()) {
    throw new Error('Name is required')
  }

  if (category.id.includes(' ')) {
    throw new Error('ID cannot contain spaces')
  }

  if (category.id !== category.id.toLowerCase()) {
    throw new Error('ID must be lowercase')
  }
}
