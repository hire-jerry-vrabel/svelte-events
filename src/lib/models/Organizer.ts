export type OrganizerType = 'individual' | 'nonprofit' | 'business' | 'community_group' | 'government' | 'school' | 'artist_collective'

export interface Organizer {
  id: string
  name: string
  type: OrganizerType
  bio?: string
  email?: string
  phone?: string
  website?: string
  social?: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedIn?: string
    tiktok?: string
  }
  image?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

const VALID_ORGANIZER_TYPES: OrganizerType[] = [
  'individual',
  'nonprofit',
  'business',
  'community_group',
  'government',
  'school',
  'artist_collective',
]

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateOrganizer(organizer: any): void {
  if (!organizer.name?.trim()) {
    throw new Error('Name is required')
  }

  if (!organizer.type?.trim()) {
    throw new Error('Type is required')
  }

  if (!VALID_ORGANIZER_TYPES.includes(organizer.type)) {
    throw new Error('Invalid organizer type')
  }

  if (organizer.email && !isValidEmail(organizer.email)) {
    throw new Error('Invalid email format')
  }
}
