# TDD Quick Reference - Rogers Park Events PWA

## Setup (One-time)

```bash
npm install
npm run test:watch
```

---

## Writing Tests: Step-by-Step

### 1. Write a Test (RED Phase)

Create a new test file or add to existing one:

```typescript
// tests/services/EventService.test.ts
import { describe, it, expect } from 'vitest';
import { EventService } from '../../src/lib/services/EventService';
import { mockEvents, mockVenues } from '../../tests/fixtures';

describe('EventService', () => {
  it('should filter events by category', () => {
    const service = new EventService(mockEvents, mockVenues);
    const result = service.filterByCategory('music');
    
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(e => e.categories.includes('music'))).toBe(true);
  });
});
```

Run it:
```bash
npm run test:watch
```

❌ **Test fails** (function doesn't exist) → This is expected! Move to step 2.

### 2. Write Minimal Code (GREEN Phase)

Implement just enough to pass the test:

```typescript
// src/lib/services/EventService.ts
export class EventService {
  constructor(private events: Event[], private venues: Venue[]) {}

  filterByCategory(category: string): Event[] {
    return this.events.filter(e => e.categories.includes(category));
  }
}
```

✅ **Test passes** → Move to step 3.

### 3. Refactor (REFACTOR Phase)

Improve code quality while keeping tests green:

```typescript
export class EventService {
  constructor(private events: Event[], private venues: Venue[]) {}

  filterByCategory(category: string | string[]): Event[] {
    const categories = Array.isArray(category) ? category : [category];
    return this.events.filter(e =>
      categories.some(c => e.categories.includes(c))
    );
  }

  // Add more methods...
}
```

✅ **Test still passes** → You're done with that feature!

---

## Common Test Patterns

### Testing Data Validation

```typescript
it('should reject invalid events', () => {
  const invalid = { /* missing required fields */ };
  
  expect(() => validateEvent(invalid)).toThrow('Title is required');
});

it('should accept valid events', () => {
  const valid = { /* all fields */ };
  
  expect(() => validateEvent(valid)).not.toThrow();
});
```

### Testing Array Operations

```typescript
it('should filter results', () => {
  const filtered = service.filterByPrice(0, 50);
  
  expect(filtered).toHaveLength(3);
  expect(filtered[0].cost).toBeLessThanOrEqual(50);
});

it('should sort results', () => {
  const sorted = service.sortByDate();
  
  expect(sorted[0].times[0].date).toBeLessThan(sorted[1].times[0].date);
});
```

### Testing Component Rendering

```typescript
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import EventCard from '../../src/components/EventCard.svelte';

it('should render event title', () => {
  const { container } = render(EventCard, {
    props: { event: mockEvent1 }
  });
  
  expect(screen.getByText(mockEvent1.title)).toBeInTheDocument();
});

it('should emit save event on button click', async () => {
  const user = userEvent.setup();
  const { component } = render(EventCard, {
    props: { event: mockEvent1 }
  });

  const button = screen.getByRole('button', { name: /save/i });
  await user.click(button);

  expect(component.$on).toHaveBeenCalled();
});
```

### Testing Async Operations

```typescript
it('should load events from API', async () => {
  const service = new EventService();
  
  const events = await service.fetchEvents();
  
  expect(events).toHaveLength(5);
  expect(events[0]).toHaveProperty('title');
});
```

### Testing with Fixtures

```typescript
import { mockEvents, mockVenues, createMockEvent } from '../fixtures';

describe('with mock data', () => {
  it('uses fixture data', () => {
    const event = mockEvents[0];
    expect(event.id).toBe('indie-dance-party-june-2025');
  });

  it('creates custom test data', () => {
    const customEvent = createMockEvent({
      title: 'My Custom Event',
      costType: 'paid'
    });
    
    expect(customEvent.title).toBe('My Custom Event');
    expect(customEvent.costType).toBe('paid');
  });
});
```

---

## Assertion Cheatsheet

```typescript
// Equality
expect(value).toBe(expected);              // Strict equality (===)
expect(value).toEqual(expected);           // Deep equality
expect(value).toStrictEqual(expected);     // Strict (no undefined)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Numbers
expect(count).toBeGreaterThan(5);
expect(count).toBeGreaterThanOrEqual(5);
expect(count).toBeLessThan(10);
expect(price).toBeCloseTo(4.1, 2);        // Within 2 decimal places

// Strings
expect(str).toMatch(/regex/);
expect(str).toContain('substring');
expect(str).toHaveLength(5);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);
expect(array).toEqual(expect.arrayContaining([item1, item2]));
expect(array).toEqual(expect.not.arrayContaining([item3]));

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', 'value');
expect(obj).toEqual(expect.objectContaining({ key: 'value' }));

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledTimes(2);

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('message');
expect(() => fn()).toThrow(CustomError);
```

---

## Running Tests

```bash
# Watch mode (recommended during development)
npm run test:watch

# Run once
npm run test

# Run specific file
npm run test -- EventService.test.ts

# Run specific test
npm run test -- -t "should filter events"

# UI mode (visual dashboard)
npm run test:ui

# Coverage report
npm run test:coverage

# Coverage with HTML output
npm run test:coverage -- --reporter=html
# Opens: coverage/index.html
```

---

## Coverage Goals

Check coverage with:
```bash
npm run test:coverage
```

Target metrics:
- **Models/Validation**: 100%
- **Services**: 90%+
- **Components**: 80%+
- **Overall**: 85%+

If coverage is low, add tests for:
- Edge cases
- Error conditions
- Happy paths

---

## Debugging Tests

### Option 1: Console Logging
```typescript
it('debug test', () => {
  const result = service.filterByCategory('music');
  console.log('Result:', result);  // Visible in terminal
  expect(result).toBeDefined();
});
```

### Option 2: Using `debug()`
```typescript
import { render, screen } from '@testing-library/svelte';

it('debug component', () => {
  const { debug } = render(EventCard, { props: { event } });
  debug();  // Prints DOM to console
  expect(screen.getByText('title')).toBeInTheDocument();
});
```

### Option 3: Vitest UI
```bash
npm run test:ui
# Opens browser at http://localhost:51204
# Click tests to see pass/fail, expand for details
```

---

## TDD Workflow Checklist

For each feature:

- [ ] **RED**: Write a failing test
- [ ] Run test, confirm it fails
- [ ] **GREEN**: Write minimal code to pass
- [ ] Run test, confirm it passes
- [ ] **REFACTOR**: Clean up code
- [ ] Run test, confirm still passes
- [ ] Move to next feature

---

## File Locations

Create tests near their source:

```
src/lib/services/EventService.ts    ← Implementation
tests/services/EventService.test.ts ← Test

src/components/EventCard.svelte    ← Implementation
tests/components/EventCard.test.ts ← Test
```

Use fixtures centrally:
```
tests/fixtures/index.ts  ← All mock data here
```

---

## Example: Build a Filter Feature with TDD

### Feature: Filter events by date range

**Step 1: RED - Write failing test**

```typescript
// tests/services/EventService.test.ts
it('should filter events by date range', () => {
  const service = new EventService(mockEvents, mockVenues);
  const result = service.filterByDateRange('2025-06-01', '2025-06-30');
  
  expect(result.length).toBeGreaterThan(0);
  expect(result.every(e => {
    const date = new Date(e.times[0].date);
    return date >= new Date('2025-06-01') && date <= new Date('2025-06-30');
  })).toBe(true);
});
```

Run: `npm run test:watch` → ❌ FAILS

**Step 2: GREEN - Implement**

```typescript
// src/lib/services/EventService.ts
filterByDateRange(startDate: string, endDate: string): Event[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59);
  
  return this.events.filter(e => {
    const eventDate = new Date(e.times[0].date);
    return eventDate >= start && eventDate <= end;
  });
}
```

Run: `npm run test:watch` → ✅ PASSES

**Step 3: REFACTOR - Improve**

```typescript
// Handle all times in event (multi-day events)
filterByDateRange(startDate: string, endDate: string): Event[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59);
  
  return this.events.filter(e =>
    e.times.some(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    })
  );
}
```

Run: `npm run test:watch` → ✅ STILL PASSES

Done! Move to next feature.

---

## Resources

- [Vitest Docs](https://vitest.dev)
- [Testing Library](https://testing-library.com/svelte)
- [Jest Matchers](https://vitest.dev/api/expect.html) (mostly compatible)
