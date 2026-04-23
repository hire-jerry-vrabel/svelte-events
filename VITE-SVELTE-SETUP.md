# Vite + Svelte + TypeScript Setup Guide

Complete step-by-step instructions for setting up your Rogers Park Events PWA from scratch.

---

## Prerequisites

Make sure you have:
- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Git** (optional but recommended)

Check your versions:
```bash
node --version
npm --version
```

---

## Step 1: Create the Project

### Option A: Using npm create (Recommended)

```bash
npm create vite@latest rogers-park-events -- --template svelte
cd rogers-park-events
```

This creates a basic Vite + Svelte project. Choose "TypeScript" when prompted.

### Option B: Manual Setup

```bash
mkdir rogers-park-events
cd rogers-park-events
npm init -y
```

Then follow the manual steps below.

---

## Step 2: Install Core Dependencies

```bash
npm install svelte
npm install -D vite @vitejs/plugin-svelte
```

---

## Step 3: Install TypeScript

```bash
npm install -D typescript
npx tsc --init
```

This creates a `tsconfig.json`. Replace it with this optimized version:

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "$lib": ["src/lib"],
      "$lib/*": ["src/lib/*"],
      "$components": ["src/components"],
      "$components/*": ["src/components/*"],
      "$fixtures": ["tests/fixtures"],
      "$fixtures/*": ["tests/fixtures/*"]
    }
  },
  "include": ["src", "tests"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 4: Install Testing Dependencies

```bash
npm install -D vitest @testing-library/svelte @testing-library/user-event
npm install -D @vitest/coverage-v8 @vitest/ui jsdom
```

---

## Step 5: Create Vite Configuration

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import { svelte } from 'vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib'),
      $components: path.resolve(__dirname, './src/components'),
      $fixtures: path.resolve(__dirname, './tests/fixtures'),
    },
  },
});
```

---

## Step 6: Create Vitest Configuration

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import { svelte } from 'vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib'),
      $components: path.resolve(__dirname, './src/components'),
      $fixtures: path.resolve(__dirname, './tests/fixtures'),
    },
  },
});
```

---

## Step 7: Update package.json

Replace the `scripts` section with:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.svelte",
    "format": "prettier --write ."
  }
}
```

Your full `package.json` should look like:

```json
{
  "name": "rogers-park-events",
  "version": "0.1.0",
  "description": "Progressive Web App for discovering local events in Rogers Park, Chicago",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.svelte",
    "format": "prettier --write ."
  },
  "dependencies": {
    "svelte": "^4.0.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^2.0.0",
    "@testing-library/svelte": "^4.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitest/coverage-v8": "^0.34.0",
    "@vitest/ui": "^0.34.0",
    "eslint": "^8.0.0",
    "eslint-plugin-svelte": "^2.0.0",
    "jsdom": "^22.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-svelte": "^3.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "vitest": "^0.34.0"
  }
}
```

---

## Step 8: Create Project Folder Structure

```bash
mkdir -p src/lib/models src/lib/services src/lib/utils src/components src/routes
mkdir -p tests/fixtures tests/models tests/services tests/components tests/utils
mkdir -p data/events public
```

Full structure:
```
rogers-park-events/
├── src/
│   ├── lib/
│   │   ├── models/          # Data models
│   │   │   └── index.ts
│   │   ├── services/        # Business logic
│   │   │   └── index.ts
│   │   └── utils/           # Helper functions
│   │       └── index.ts
│   ├── components/          # Svelte components
│   │   └── .gitkeep
│   ├── routes/              # SvelteKit pages
│   │   └── +page.svelte
│   ├── App.svelte           # Root component
│   └── main.ts              # Entry point
├── tests/
│   ├── setup.ts             # Global test setup
│   ├── fixtures/
│   │   └── index.ts
│   ├── models/
│   │   └── .gitkeep
│   ├── services/
│   │   └── .gitkeep
│   ├── components/
│   │   └── .gitkeep
│   └── utils/
│       └── .gitkeep
├── data/
│   ├── events/
│   │   └── 2025-06.json
│   ├── venues.json
│   ├── organizers.json
│   └── categories.json
├── public/
│   └── favicon.svg
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
└── index.html
```

---

## Step 9: Create Entry Point Files

**index.html** (Vite entry point):
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rogers Park Events</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**src/main.ts** (Application entry):
```typescript
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
```

**src/App.svelte** (Root component):
```svelte
<script lang="ts">
  let count = 0

  function increment() {
    count++
  }
</script>

<main>
  <h1>Rogers Park Events</h1>
  <button on:click={increment}>
    count is {count}
  </button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 4rem 0;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ff3e00;
    cursor: pointer;
    transition: border-color 0.25s;
    color: white;
  }

  button:hover {
    border-color: #ff3e00;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
```

---

## Step 10: Install Test Setup Files

Copy these files into your project (from the previous setup):

1. **tests/setup.ts** — Global test configuration
2. **tests/fixtures/index.ts** — Mock data
3. **tests/models/Event.test.ts** — Example tests

---

## Step 11: Create .gitignore

**.gitignore:**
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build
dist/
.output

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## Step 12: Install All Dependencies

```bash
npm install
```

---

## Step 13: Verify Everything Works

### Test that Vite works:
```bash
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Open `http://localhost:5173/` in your browser. You should see "Rogers Park Events" with a counter button.

Press `Ctrl+C` to stop.

### Test that Vitest works:
```bash
npm run test:watch
```

You should see the example Event tests running (some will fail, which is expected—tests need implementation).

```
✓ tests/models/Event.test.ts (45 tests) 5678ms
  ✓ Event Model - Validation
    ✓ required fields
      ✓ should require a title
      ✓ should accept a valid title
      ...
  ✓ Event Model - Recurring Events
    ...

Tests Files  1 passed (1)
     Tests  45 passed (45)
```

Press `q` to exit watch mode.

---

## Step 14: Create a Sample Data File

Copy your event data into `data/venues.json`:

**data/venues.json:**
```json
[
  {
    "id": "venue-lakefront-park",
    "name": "Lakefront Park Rogers Park",
    "type": "park",
    "location": {
      "address": "6000 N Lake Shore Drive",
      "city": "Chicago",
      "neighborhood": "Rogers Park",
      "zipCode": "60626",
      "latitude": 41.9875,
      "longitude": -87.2567
    },
    "description": "Large public park with playgrounds and sports facilities",
    "capacity": 1000,
    "wheelchairAccessible": true,
    "petsAllowed": true,
    "parking": "free",
    "amenities": ["restrooms", "parking", "playground"]
  }
]
```

---

## Your Project is Ready! 🎉

You now have:

✅ **Vite** - Fast build tool and dev server  
✅ **Svelte** - Lightweight, reactive components  
✅ **TypeScript** - Type-safe development  
✅ **Vitest** - Lightning-fast testing  
✅ **Testing Library** - Component testing tools  
✅ **Path aliases** - Clean imports ($lib, $components)  
✅ **TDD setup** - Ready for test-first development  

---

## Next Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Start Tests in Watch Mode
```bash
npm run test:watch
```

### 3. Implement Your First Feature (TDD)

**Red Phase** - Write a failing test:
```typescript
// tests/models/Event.test.ts (already provided)
it('should validate event titles', () => {
  expect(() => validateEvent({ title: '' })).toThrow();
});
```

**Green Phase** - Write minimal code:
```typescript
// src/lib/models/Event.ts
export function validateEvent(event: any) {
  if (!event.title?.trim()) {
    throw new Error('Title is required');
  }
}
```

**Refactor Phase** - Improve:
```typescript
export class EventValidator {
  static validate(event: Event): void {
    this.validateTitle(event.title);
    // ...
  }
}
```

### 4. Build Components

Create your first component using TDD:
```svelte
<!-- src/components/EventCard.svelte -->
<script lang="ts">
  import type { Event } from '$lib/models';
  
  export let event: Event;
</script>

<article class="event-card">
  <h3>{event.title}</h3>
  <p>{event.shortDescription}</p>
</article>

<style>
  .event-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

Test it:
```typescript
// tests/components/EventCard.test.ts
import { render, screen } from '@testing-library/svelte';
import EventCard from '$components/EventCard.svelte';
import { mockEvent1 } from '$fixtures';

it('should render event title', () => {
  render(EventCard, { props: { event: mockEvent1 } });
  expect(screen.getByText(mockEvent1.title)).toBeInTheDocument();
});
```

---

## Helpful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Create production build
npm run preview         # Preview production build

# Testing
npm run test            # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Visual test dashboard
npm run test:coverage   # Coverage report

# Code Quality
npm run lint            # Check for errors
npm run format          # Auto-format code
```

---

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Tests not finding files
Make sure path aliases in `tsconfig.json` match `vite.config.ts` and `vitest.config.ts`

### TypeScript errors
```bash
npx tsc --noEmit  # Check for type errors
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Ready to Build?

You have a complete, modern development setup. Start with the TDD guides:

1. **SETUP-COMPLETE.md** — Overview and roadmap
2. **TDD-TESTING-PLAN.md** — Testing strategy
3. **TDD-QUICK-REFERENCE.md** — Test patterns

Happy coding! 🚀
