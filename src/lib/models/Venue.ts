export type VenueType = 'park' | 'theater' | 'coffee_shop' | 'bar_restaurant' | 'community_center' | 'library' | 'museum' | 'gallery' | 'school' | 'church' | 'music_venue' | 'sports_facility' | 'outdoor_public_space' | 'commercial_storefront' | 'nonprofit_space'

export type ParkingType = 'free' | 'paid' | 'street' | 'none'

export interface Location {
  latitude: number
  longitude: number
  address: string
  city: string
  neighborhood?: string
  zipCode: string
}

export interface Venue {
  id: string
  name: string
  type: VenueType
  location: Location
  description: string
  capacity?: number
  wheelchairAccessible: boolean
  petsAllowed: boolean
  parking?: ParkingType
  hours?: string
  phone?: string
  website?: string
  image?: string
  amenities: string[]
  createdAt: Date
  updatedAt: Date
}

const VALID_VENUE_TYPES: VenueType[] = [
  'park',
  'theater',
  'coffee_shop',
  'bar_restaurant',
  'community_center',
  'library',
  'museum',
  'gallery',
  'school',
  'church',
  'music_venue',
  'sports_facility',
  'outdoor_public_space',
  'commercial_storefront',
  'nonprofit_space',
]

const VALID_PARKING_TYPES: ParkingType[] = ['free', 'paid', 'street', 'none']

export function validateVenue(venue: any): void {
  // Required fields
  if (!venue.name?.trim()) {
    throw new Error('Name is required')
  }

  if (!venue.type?.trim()) {
    throw new Error('Type is required')
  }

  // Location validation
  if (!venue.location) {
    throw new Error('Location is required')
  }

  if (!venue.location.address?.trim()) {
    throw new Error('Address is required')
  }

  if (!venue.location.city?.trim()) {
    throw new Error('City is required')
  }

  if (!venue.location.zipCode?.trim()) {
    throw new Error('Zip code is required')
  }

  if (venue.location.latitude === undefined || venue.location.latitude === null) {
    throw new Error('Latitude is required')
  }

  if (venue.location.longitude === undefined || venue.location.longitude === null) {
    throw new Error('Longitude is required')
  }

  // Coordinate validation
  if (venue.location.latitude < -90 || venue.location.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90')
  }

  if (venue.location.longitude < -180 || venue.location.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180')
  }

  // Type validation
  if (!VALID_VENUE_TYPES.includes(venue.type)) {
    throw new Error('Invalid venue type')
  }

  // Capacity validation
  if (venue.capacity !== undefined && venue.capacity !== null) {
    if (venue.capacity <= 0) {
      throw new Error('Capacity must be greater than 0')
    }
  }

  // Parking validation
  if (venue.parking !== undefined && venue.parking !== null) {
    if (!VALID_PARKING_TYPES.includes(venue.parking)) {
      throw new Error('Invalid parking type')
    }
  }
}
