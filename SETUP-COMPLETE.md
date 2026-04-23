# Rogers Park Events PWA - TDD Setup Complete ✅

## What's Been Created

You now have a **complete TDD framework** for your events app. Here's what's in place:

### 📋 Documentation
- **TDD-TESTING-PLAN.md** — Comprehensive guide covering testing layers, examples, and workflows
- **TDD-QUICK-REFERENCE.md** — Handy cheatsheet with commands, patterns, and assertions
- **events-data-model.ts** — Full TypeScript types for Events, Venues, Organizers, Categories
- **data-structure-example.yaml** — How to organize your JSON/YAML event data

### ⚙️ Configuration Files
- **vitest.config.ts** — Vitest setup with jsdom, coverage, path aliases
- **package.json** — Dependencies and test scripts (test, test:watch, test:ui, test:coverage)
- **tests/setup.ts** — Global test utilities, mocks (matchMedia, IntersectionObserver)

### 🧪 Test Infrastructure
- **tests/fixtures/index.ts** — Mock data (events, venues, organizers, categories)
  - `mockEvent1`, `mockEvent2`, `mockEvent3`, etc.
  - `mockVenue1`, `mockVenue2`, `mockVenue3`
  - `mockOrganizer1`, `mockOrganizer2`, `mockOrganizer3`
  - Helper functions: `createMockEvent()`, `createMockVenue()`, etc.

### 📝 Example Tests
- **tests/models/Event.test.ts** — Real example showing:
  - Required field validation
  - Date/time validation
  - Cost/pricing validation
  - Recurring event expansion (weekly, biweekly, monthly)
  - Edge cases

---

## Quick Start (Next 5 Minutes)

### 1. Clone/Initialize Project
```bash
mkdir rogers-park-events
cd rogers-park-events
npm init -y
```

### 2. Install Dependencies
```bash
npm install
npm install -D vitest @testing-library/svelte @testing-library/user-event @vitest/coverage-v8 @vitest/ui jsdom
```

### 3. Copy Config Files
Copy these to your project:
- `vitest.config.ts`
- `package.json` (merge scripts section)
- `tests/setup.ts`
- `tests/fixtures/index.ts`
- `tests/models/Event.test.ts`

### 4. Run Tests
```bash
npm run test:watch
```

You should see the example Event validation tests running (some will fail — that's expected! Tests need implementation).

---

## Your TDD Journey (Recommended Order)

### Phase 1: Foundation (Data Models)
**Goal**: Ensure data integrity at the type level

1. **Create Event model & validation** (`src/lib/models/Event.ts`)
   - Write tests first in `tests/models/Event.test.ts` (provided)
   - Implement validation functions
   - Goal: 100% test coverage

2. **Create Venue model & validation** (`src/lib/models/Venue.ts`)
   - Write tests: required fields, location, capacity
   - Implement validation

3. **Create Organizer model & validation** (`src/lib/models/Organizer.ts`)

4. **Create Category model** (`src/lib/models/Category.ts`)

**Test coverage target**: 100% for all models

---

### Phase 2: Business Logic (Services)
**Goal**: Filtering, searching, sorting all work correctly

1. **EventService** (`src/lib/services/EventService.ts`)
   - Write tests for filtering (by category, date, cost, distance)
   - Write tests for sorting (by date, proximity)
   - Write tests for saved events (add/remove)
   - Implement methods
   - **Test coverage target**: 90%+

2. **VenueService** (`src/lib/services/VenueService.ts`)
   - Get venue by ID
   - Find nearby venues
   - Get capacity info

3. **Utility functions** (`src/lib/utils/distance.ts`, `src/lib/utils/date.ts`)
   - Distance calculations (Haversine)
   - Date formatting, recurring event expansion
   - **Test coverage target**: 100%

---

### Phase 3: UI Components (Svelte)
**Goal**: Components render, filter, and respond to user input correctly

1. **EventCard.svelte** (`src/components/EventCard.svelte`)
   - Tests: renders title, date, venue, cost, categories
   - Tests: click save button emits event
   - Tests: accessibility (ARIA labels)
   - **Test coverage target**: 80%+

2. **EventList.svelte** (`src/components/EventList.svelte`)
   - Tests: renders list of events
   - Tests: handles empty state
   - Tests: shows loading state

3. **EventFilter.svelte** (`src/components/EventFilter.svelte`)
   - Tests: filter inputs work
   - Tests: selections update event list
   - Tests: reset button clears filters

4. **EventCalendar.svelte** (if building calendar view)
   - Tests: month navigation
   - Tests: event indicators on dates
   - Tests: click date shows day view

---

### Phase 4: Integration (Full Workflows)
**Goal**: End-to-end user journeys work

- User searches for music events
- User filters by date and cost
- User saves favorite events
- User views saved events
- (Optional: Add Playwright for full E2E tests)

---

## File Structure to Build

```
rogers-park-events/
├── src/
│   ├── lib/
│   │   ├── models/
│   │   │   ├── Event.ts              ← Implement (tests provided)
│   │   │   ├── Venue.ts              ← Implement
│   │   │   ├── Organizer.ts          ← Implement
│   │   │   └── Category.ts           ← Implement
│   │   ├── services/
│   │   │   ├── EventService.ts       ← Implement
│   │   │   ├── VenueService.ts       ← Implement
│   │   │   └── FilterService.ts      ← Optional
│   │   └── utils/
│   │       ├── distance.ts           ← Implement
│   │       └── date.ts               ← Implement
│   ├── components/
│   │   ├── EventCard.svelte
│   │   ├── EventList.svelte
│   │   ├── EventFilter.svelte
│   │   └── EventCalendar.svelte
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte              ← Homepage
│   │   ├── event/
│   │   │   └── [id]/+page.svelte     ← Event detail
│   │   └── saved/+page.svelte        ← Saved events
│   └── App.svelte
├── tests/
│   ├── setup.ts                       ✅ (provided)
│   ├── fixtures/
│   │   └── index.ts                  ✅ (provided)
│   ├── models/
│   │   ├── Event.test.ts            ✅ (provided)
│   │   ├── Venue.test.ts            ← Write tests, then implement
│   │   ├── Organizer.test.ts
│   │   └── Category.test.ts
│   ├── services/
│   │   ├── EventService.test.ts     ← Write tests, then implement
│   │   ├── VenueService.test.ts
│   │   └── FilterService.test.ts
│   ├── components/
│   │   ├── EventCard.test.ts        ← Write tests, then implement
│   │   ├── EventList.test.ts
│   │   ├── EventFilter.test.ts
│   │   └── EventCalendar.test.ts
│   └── utils/
│       ├── distance.test.ts         ← Write tests, then implement
│       └── date.test.ts
├── data/
│   ├── events/
│   │   ├── 2025-06.json             ← Event data
│   │   └── 2025-07.json
│   ├── venues.json                  ← Venue data
│   ├── organizers.json              ← Organizer data
│   └── categories.json              ← Category data
├── vitest.config.ts                 ✅ (provided)
├── package.json                     ✅ (provided)
└── tsconfig.json
```

---

## Key Commands to Remember

```bash
# Development
npm run test:watch           # Watch tests (recommended!)
npm run dev                  # Dev server (Vite)

# Testing
npm run test                 # Run once
npm run test:ui             # Visual dashboard
npm run test:coverage       # Coverage report
npm run test -- Event.test  # Run specific test file
npm run test -- -t "filter" # Run specific test by name

# Building
npm run build               # Production build
npm run preview             # Preview production build
```

---

## TDD Workflow Reminder

For **each feature**:

1. **RED**: Write a test that fails
   ```bash
   npm run test:watch
   ```

2. **GREEN**: Write minimal code to pass
   ```bash
   # Edit src/lib/...
   # Test auto-runs, should pass now
   ```

3. **REFACTOR**: Clean up while keeping tests green
   ```bash
   # Edit src/lib/...
   # Test still passes
   ```

4. **Commit**: Push your work
   ```bash
   git add src/ tests/
   git commit -m "feat: add event filtering"
   ```

---

## Coverage Targets

Track coverage with:
```bash
npm run test:coverage
```

Targets:
- **Models**: 100% (catch all bugs early)
- **Services**: 90%+ (critical business logic)
- **Components**: 80%+ (UI is more flexible)
- **Overall**: 85%+

The `vitest.config.ts` will warn if you fall below these thresholds.

---

## Example: Build Your First Feature

### Feature: Event Validation

**1. Write test first** (RED)
```bash
# Create tests/models/Event.test.ts (already provided!)
npm run test:watch
# Tests fail ❌
```

**2. Implement model** (GREEN)
```typescript
// src/lib/models/Event.ts
export function validateEvent(event: Event): void {
  if (!event.title?.trim()) {
    throw new Error('Title is required');
  }
  if (event.categories.length === 0) {
    throw new Error('At least one category is required');
  }
  // ... more validation
}
```

**3. Tests pass** ✅
```bash
# npm run test:watch shows all green
```

**4. Refactor** (REFACTOR)
```typescript
// Move validation into a class for reusability
export class EventValidator {
  static validate(event: Event): void { ... }
  static validateTitle(title: string): void { ... }
  static validateCategories(categories: string[]): void { ... }
}
```

**5. Tests still pass** ✅

Done! Move to next feature.

---

## Need Help?

### Understanding the test I provided
- See: **tests/models/Event.test.ts** (heavily commented)
- Read: **TDD-TESTING-PLAN.md** (layer breakdown)
- Quick ref: **TDD-QUICK-REFERENCE.md** (patterns & assertions)

### Writing your own tests
1. Look at an existing test
2. Copy the pattern
3. Change the values
4. Add your test logic

### Debugging a failing test
```bash
npm run test:ui          # Visual dashboard
# Or
npm run test -- -t "test name"  # Run one test
```

### Understanding fixtures
- File: **tests/fixtures/index.ts**
- Use `mockEvent1`, `mockEvent2`, etc. in your tests
- Or call `createMockEvent({ title: 'My Custom Event' })`

---

## Next Steps

1. ✅ **You have**: Full TDD setup, example tests, mock data
2. 🔜 **You do**: Set up Vite/Svelte project scaffold
3. 🔜 **You do**: Implement first feature (Event validation)
4. 🔜 **You do**: Add more models, services, components

---

## Checklist for Getting Started

- [ ] Copy all provided files into project
- [ ] Run `npm install`
- [ ] Run `npm run test:watch`
- [ ] See Event validation tests run
- [ ] Create `src/lib/models/Event.ts`
- [ ] Implement `validateEvent()` function
- [ ] Watch tests turn green ✅
- [ ] Celebrate! 🎉

---

Good luck! TDD ensures your app is solid from day one. Questions? Refer back to the guides — they've got you covered.
