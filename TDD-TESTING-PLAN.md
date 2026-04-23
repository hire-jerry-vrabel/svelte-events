# Rogers Park Events PWA - TDD Testing Plan

## Testing Philosophy

This project follows **Test-Driven Development (TDD)**: write tests first, then code to pass them. This ensures:
- Data integrity (events validate correctly)
- Component reliability (filters work as expected)
- Refactoring safety (catch regressions early)
- Living documentation (tests explain how features work)

---

## Tech Stack

**Testing Framework**: Vitest (fast, Vite-native, ESM)  
**Component Testing**: Vitest + svelte-testing-library  
**Coverage Reporting**: Vitest built-in coverage  
**Assertion Library**: Vitest (chai) or custom

```bash
npm install -D vitest @testing-library/svelte @testing-library/user-event
npm install -D @vitest/coverage-v8 jsdom
```

---

## Project Test Structure

```
project/
├── src/
│   ├── lib/
│   │   ├── models/           # Data types and validation
│   │   │   ├── Event.ts
│   │   │   ├── Venue.ts
│   │   │   ├── Organizer.ts
│   │   │   └── Category.ts
│   │   ├── services/         # Business logic
│   │   │   ├── EventService.ts
│   │   │   ├── VenueService.ts
│   │   │   └── FilterService.ts
│   │   └── utils/
│   │       ├── date.ts
│   │       └── distance.ts
│   └── components/           # Svelte components
│       ├── EventCard.svelte
│       ├── EventList.svelte
│       └── EventFilter.svelte
│
├── tests/                    # ALL TEST FILES HERE
│   ├── models/
│   │   ├── Event.test.ts
│   │   ├── Venue.test.ts
│   │   └── Category.test.ts
│   ├── services/
│   │   ├── EventService.test.ts
│   │   ├── VenueService.test.ts
│   │   └── FilterService.test.ts
│   ├── components/
│   │   ├── EventCard.test.ts
│   │   ├── EventList.test.ts
│   │   └── EventFilter.test.ts
│   ├── utils/
│   │   ├── date.test.ts
│   │   └── distance.test.ts
│   └── fixtures/             # Test data
│       ├── mockEvents.ts
│       ├── mockVenues.ts
│       └── mockOrganizers.ts
│
├── vitest.config.ts          # Vitest configuration
└── package.json
```

---

## Testing Layers (Bottom-Up TDD)

### 1. **Data Models & Validation** (Unit Tests)
Test TypeScript types, validation functions, edge cases.

Example: `Event.test.ts`
- Does an event with missing title fail validation?
- Does a date in the past get flagged?
- Do recurring events generate correct future dates?

### 2. **Services & Business Logic** (Unit Tests)
Test pure functions that work with data.

Example: `EventService.test.ts`
- Can we filter events by category?
- Does distance calculation work for nearby venues?
- Do recurring events expand correctly?

### 3. **Components** (Integration Tests)
Test component behavior, user interactions, rendering.

Example: `EventCard.test.ts`
- Does the card render an event title?
- Does clicking "Save Event" emit the right event?
- Does accessibility (ARIA labels) work?

### 4. **Full Workflows** (E2E Tests)
Test complete user journeys (optional for now, add later with Playwright).

---

## TDD Workflow

**For each feature:**

1. **Write test first** (RED)
   ```typescript
   describe('EventService', () => {
     it('should filter events by category', () => {
       const events = [musicEvent, artEvent, sportsEvent];
       const filtered = EventService.filterByCategory(events, 'music');
       expect(filtered).toHaveLength(1);
       expect(filtered[0].categories).toContain('music');
     });
   });
   ```

2. **Run test, watch it fail** (confirms test is real)
   ```bash
   npm run test -- --watch
   ```

3. **Write minimal code to pass** (GREEN)
   ```typescript
   export class EventService {
     static filterByCategory(events: Event[], category: string): Event[] {
       return events.filter(e => e.categories.includes(category));
     }
   }
   ```

4. **Refactor & improve** (REFACTOR)
   - Clean up code
   - Run tests to ensure nothing broke
   - Add edge cases

---

## Example Test Files

### Layer 1: Data Validation

**File: `tests/models/Event.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { Event, EventStatus } from '../../src/lib/models/Event';

describe('Event Model', () => {
  describe('validation', () => {
    it('should require a title', () => {
      const invalidEvent = {
        id: 'test-1',
        title: '', // INVALID
        categories: ['music'],
        status: 'published' as EventStatus,
        times: [{ date: '2025-06-15', startTime: '19:00', endTime: '21:00', timezone: 'America/Chicago' }],
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      expect(() => validateEvent(invalidEvent)).toThrow('Title is required');
    });

    it('should reject past dates', () => {
      const today = new Date();
      const yesterday = new Date(today.setDate(today.getDate() - 1));

      const pastEvent = {
        id: 'test-2',
        title: 'Old Event',
        categories: ['music'],
        status: 'published' as EventStatus,
        times: [{
          date: yesterday.toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '21:00',
          timezone: 'America/Chicago'
        }],
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      expect(() => validateEvent(pastEvent)).toThrow('Event date cannot be in the past');
    });

    it('should accept future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 30);

      const futureEvent = {
        id: 'test-3',
        title: 'Future Event',
        categories: ['music'],
        status: 'published' as EventStatus,
        times: [{
          date: future.toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '21:00',
          timezone: 'America/Chicago'
        }],
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      expect(() => validateEvent(futureEvent)).not.toThrow();
    });

    it('should require at least one category', () => {
      const noCategoryEvent = {
        id: 'test-4',
        title: 'Event',
        categories: [], // INVALID
        status: 'published' as EventStatus,
        times: [{ date: '2025-06-15', startTime: '19:00', endTime: '21:00', timezone: 'America/Chicago' }],
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      expect(() => validateEvent(noCategoryEvent)).toThrow('At least one category is required');
    });

    it('should validate end time is after start time', () => {
      const invalidTime = {
        id: 'test-5',
        title: 'Event',
        categories: ['music'],
        status: 'published' as EventStatus,
        times: [{
          date: '2025-06-15',
          startTime: '21:00',
          endTime: '19:00', // BEFORE START
          timezone: 'America/Chicago'
        }],
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      expect(() => validateEvent(invalidTime)).toThrow('End time must be after start time');
    });
  });

  describe('recurring events', () => {
    it('should expand weekly events into multiple dates', () => {
      const recurringEvent = {
        id: 'weekly-event',
        title: 'Weekly Meetup',
        categories: ['community_meeting'],
        status: 'published' as EventStatus,
        times: [{
          date: '2025-06-15', // Sunday
          startTime: '18:00',
          endTime: '20:00',
          timezone: 'America/Chicago'
        }],
        recurrence: {
          frequency: 'weekly' as const,
          daysOfWeek: [0], // Sunday
          endDate: '2025-07-15'
        },
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      const expanded = expandRecurringEvent(recurringEvent);
      expect(expanded).toHaveLength(5); // 5 Sundays from June 15 to July 15
      expect(expanded[0].times[0].date).toBe('2025-06-15');
      expect(expanded[1].times[0].date).toBe('2025-06-22');
    });

    it('should handle biweekly recurrence', () => {
      const biweeklyEvent = {
        id: 'biweekly-event',
        title: 'Biweekly Event',
        categories: ['music'],
        status: 'published' as EventStatus,
        times: [{
          date: '2025-06-02',
          startTime: '19:00',
          endTime: '21:00',
          timezone: 'America/Chicago'
        }],
        recurrence: {
          frequency: 'biweekly' as const,
          interval: 2,
          endDate: '2025-08-15'
        },
        venueId: 'venue-1',
        organizerId: 'org-1',
        costType: 'free',
      };

      const expanded = expandRecurringEvent(biweeklyEvent);
      expect(expanded).toHaveLength(6); // Every 2 weeks
    });
  });
});
```

### Layer 2: Business Logic

**File: `tests/services/EventService.test.ts`**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { EventService } from '../../src/lib/services/EventService';
import { mockEvents, mockVenues } from '../fixtures';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    service = new EventService(mockEvents, mockVenues);
  });

  describe('filtering', () => {
    it('should filter events by single category', () => {
      const musicEvents = service.filterByCategory('music');
      expect(musicEvents.length).toBeGreaterThan(0);
      expect(musicEvents.every(e => e.categories.includes('music'))).toBe(true);
    });

    it('should filter events by multiple categories (OR logic)', () => {
      const entertainmentEvents = service.filterByCategory(['music', 'theater_performance']);
      expect(entertainmentEvents.length).toBeGreaterThan(0);
      expect(
        entertainmentEvents.every(e =>
          e.categories.some(c => ['music', 'theater_performance'].includes(c))
        )
      ).toBe(true);
    });

    it('should filter events by date range', () => {
      const juneEvents = service.filterByDateRange('2025-06-01', '2025-06-30');
      expect(juneEvents.length).toBeGreaterThan(0);
      expect(
        juneEvents.every(e => {
          const date = new Date(e.times[0].date);
          return date >= new Date('2025-06-01') && date <= new Date('2025-06-30');
        })
      ).toBe(true);
    });

    it('should filter free events', () => {
      const freeEvents = service.filterByCost('free');
      expect(freeEvents.every(e => e.costType === 'free')).toBe(true);
    });

    it('should filter paid events within price range', () => {
      const affordable = service.filterByPriceRange(0, 25);
      expect(
        affordable.every(e => {
          if (e.costType !== 'paid') return true; // Include free
          return (e.cost?.maxPrice || 0) <= 25;
        })
      ).toBe(true);
    });

    it('should chain filters together', () => {
      const filtered = service
        .filterByCategory('music')
        .filterByDateRange('2025-06-01', '2025-06-30')
        .filterByCost('free');

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(e => 
        e.categories.includes('music') && 
        e.costType === 'free'
      )).toBe(true);
    });
  });

  describe('location-based search', () => {
    it('should find events near user location', () => {
      const nearbyEvents = service.findNearby(
        41.9875, // lat
        -87.2567, // lng
        1 // 1 mile radius
      );
      expect(nearbyEvents.length).toBeGreaterThan(0);
    });

    it('should calculate distance correctly', () => {
      // Rogers Park to Lakefront Park ≈ 0 miles (same neighborhood)
      const distance = service.distanceToVenue(
        41.9875,
        -87.2567,
        'venue-lakefront-park'
      );
      expect(distance).toBeLessThan(0.5); // Less than half mile
    });
  });

  describe('sorting', () => {
    it('should sort events by date ascending', () => {
      const sorted = service.sortByDate('asc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(new Date(sorted[i].times[0].date)).toBeLessThanOrEqual(
          new Date(sorted[i + 1].times[0].date)
        );
      }
    });

    it('should sort by proximity', () => {
      const sorted = service.sortByProximity(41.9875, -87.2567);
      for (let i = 0; i < sorted.length - 1; i++) {
        const dist1 = service.distanceToVenue(41.9875, -87.2567, sorted[i].venueId);
        const dist2 = service.distanceToVenue(41.9875, -87.2567, sorted[i + 1].venueId);
        expect(dist1).toBeLessThanOrEqual(dist2);
      }
    });
  });

  describe('saved events', () => {
    it('should add event to saved list', () => {
      const eventId = 'indie-dance-party-june-2025';
      service.saveEvent(eventId);
      expect(service.getSavedEvents()).toContain(eventId);
    });

    it('should remove event from saved list', () => {
      const eventId = 'indie-dance-party-june-2025';
      service.saveEvent(eventId);
      service.unsaveEvent(eventId);
      expect(service.getSavedEvents()).not.toContain(eventId);
    });

    it('should not allow duplicates in saved list', () => {
      const eventId = 'indie-dance-party-june-2025';
      service.saveEvent(eventId);
      service.saveEvent(eventId);
      expect(service.getSavedEvents().filter(e => e === eventId)).toHaveLength(1);
    });
  });
});
```

### Layer 3: Components

**File: `tests/components/EventCard.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import EventCard from '../../src/components/EventCard.svelte';
import { mockEvents } from '../fixtures';

describe('EventCard Component', () => {
  const testEvent = mockEvents[0];

  it('should render event title', () => {
    render(EventCard, { props: { event: testEvent } });
    expect(screen.getByText(testEvent.title)).toBeInTheDocument();
  });

  it('should render event date and time', () => {
    render(EventCard, { props: { event: testEvent } });
    expect(screen.getByText(/2025-06/)).toBeInTheDocument();
    expect(screen.getByText(/19:00|9:00 PM/)).toBeInTheDocument();
  });

  it('should display venue name', () => {
    render(EventCard, { props: { event: testEvent } });
    expect(screen.getByText(testEvent.venueId)).toBeInTheDocument();
  });

  it('should show cost information', () => {
    render(EventCard, { props: { event: testEvent } });
    if (testEvent.costType === 'free') {
      expect(screen.getByText('Free')).toBeInTheDocument();
    }
  });

  it('should display category badges', () => {
    render(EventCard, { props: { event: testEvent } });
    testEvent.categories.forEach(category => {
      expect(screen.getByText(new RegExp(category, 'i'))).toBeInTheDocument();
    });
  });

  it('should have a save button', () => {
    render(EventCard, { props: { event: testEvent } });
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeInTheDocument();
  });

  it('should emit save event when button clicked', async () => {
    const user = userEvent.setup();
    const { component } = render(EventCard, { props: { event: testEvent } });

    const saveBtn = screen.getByRole('button', { name: /save/i });
    await user.click(saveBtn);

    expect(component.$on).toHaveBeenCalledWith('save', expect.objectContaining({
      detail: testEvent.id
    }));
  });

  it('should show accessibility info when present', () => {
    const accessibleEvent = { ...testEvent, wheelchairAccessible: true };
    render(EventCard, { props: { event: accessibleEvent } });
    expect(screen.getByLabelText(/wheelchair/i)).toBeInTheDocument();
  });

  it('should truncate long descriptions', () => {
    render(EventCard, { props: { event: testEvent } });
    const description = screen.getByText(testEvent.shortDescription || testEvent.description);
    expect(description.textContent?.length).toBeLessThanOrEqual(150);
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(EventCard, { props: { event: testEvent } });
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(testEvent.title);
  });
});
```

### Fixtures (Mock Data)

**File: `tests/fixtures/mockEvents.ts`**

```typescript
import { Event, EventStatus } from '../../src/lib/models/Event';

export const mockEvents: Event[] = [
  {
    id: 'indie-dance-party-june-2025',
    title: 'Indie Dance Party',
    description: 'Local indie DJs spinning vinyl',
    shortDescription: 'Local DJs, all ages',
    categories: ['music', 'nightlife'],
    status: 'published' as EventStatus,
    times: [{
      date: '2025-06-21',
      startTime: '21:00',
      endTime: '23:59',
      timezone: 'America/Chicago'
    }],
    venueId: 'venue-lakefront-park',
    isOnline: false,
    isHybrid: false,
    organizerId: 'org-rogers-park-arts-collective',
    costType: 'free',
    image: 'https://example.com/indie-dance.jpg',
    wheelchairAccessible: true,
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-06-01'),
    createdBy: 'org-rogers-park-arts-collective',
  },
  {
    id: 'farmers-market-june-saturdays',
    title: 'Rogers Park Farmers Market',
    description: 'Fresh produce from local farmers',
    shortDescription: 'Seasonal produce every Saturday',
    categories: ['food_beverage', 'community_meeting'],
    status: 'published' as EventStatus,
    times: [{
      date: '2025-06-07',
      startTime: '08:00',
      endTime: '12:00',
      timezone: 'America/Chicago'
    }],
    recurrence: {
      frequency: 'weekly',
      daysOfWeek: [6],
      endDate: '2025-10-31'
    },
    venueId: 'venue-lakefront-park',
    isOnline: false,
    isHybrid: false,
    organizerId: 'org-rogers-park-chamber',
    costType: 'free',
    wheelchairAccessible: true,
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-15'),
    createdBy: 'org-rogers-park-chamber',
  },
];
```

---

## Running Tests

```bash
# Run all tests
npm run test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Run specific test file
npm run test tests/services/EventService.test.ts

# Coverage report
npm run test:coverage

# Coverage with HTML report
npm run test:coverage -- --reporter=html
```

---

## CI/CD Integration

**Add to `package.json`:**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

**GitHub Actions (`.github/workflows/test.yml`):**

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm install
      - run: npm run test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## Test Coverage Goals

- **Models & Validation**: 100% coverage (catch all bugs before runtime)
- **Services**: 90%+ coverage (business logic is critical)
- **Components**: 80%+ coverage (UI complexity varies)
- **Overall**: Target 85%+

```bash
npm run test:coverage
```

Output shows which lines/functions lack coverage.

---

## TDD Workflow Example

### Feature: Filter events by distance

**1. Write test first (RED)**
```typescript
// tests/services/EventService.test.ts
it('should find events within 1 mile', () => {
  const nearbyEvents = service.findNearby(41.9875, -87.2567, 1);
  expect(nearbyEvents.length).toBeGreaterThan(0);
  expect(nearbyEvents.every(e => {
    const distance = service.distanceToVenue(41.9875, -87.2567, e.venueId);
    return distance <= 1;
  })).toBe(true);
});
```

Run test: ❌ FAILS (function doesn't exist yet)

**2. Write minimal code (GREEN)**
```typescript
// src/lib/services/EventService.ts
findNearby(lat: number, lng: number, radiusMiles: number): Event[] {
  return this.events.filter(e => {
    const distance = this.distanceToVenue(lat, lng, e.venueId);
    return distance <= radiusMiles;
  });
}

distanceToVenue(lat1: number, lng1: number, venueId: string): number {
  const venue = this.venues.find(v => v.id === venueId);
  if (!venue) return Infinity;
  
  // Haversine formula
  const R = 3959; // Earth radius in miles
  const dLat = (venue.location.latitude - lat1) * Math.PI / 180;
  const dLng = (venue.location.longitude - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(venue.location.latitude * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

Run test: ✅ PASSES

**3. Refactor (REFACTOR)**
- Extract distance calculation to utils
- Add caching
- Handle edge cases

```typescript
// src/lib/utils/distance.ts
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // ... refactored version
}
```

Run test: ✅ STILL PASSES

---

## Next Steps

1. **Set up Vitest** in your Vite project
2. **Write fixtures** (mock event/venue data)
3. **Start with models** - validation tests first
4. **Move to services** - filter/search logic
5. **Add components** - UI behavior tests
6. **Track coverage** - aim for 85%+

Want me to set up the Vitest config and scaffolding?
