# Quick Start: From Zero to Running in 5 Minutes

Follow these exact steps to get your Rogers Park Events PWA up and running.

---

## Prerequisites Check (1 minute)

Open your terminal and verify:

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be v9.0.0 or higher
git --version     # Optional, but recommended
```

If Node/npm aren't installed, [download Node.js](https://nodejs.org/) (npm comes with it).

---

## Step-by-Step Setup (4 minutes)

### 1. Create Your Project (30 seconds)

```bash
mkdir rogers-park-events
cd rogers-park-events
```

### 2. Copy All Configuration Files (1 minute)

Copy these files into your `rogers-park-events` folder:

**Root level files:**
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `vitest.config.ts`
- `index.html`
- `.gitignore`

**Create the src folder structure:**
```bash
mkdir -p src/lib/models src/lib/services src/lib/utils src/components
```

Copy these into `src/`:
- `src/main.ts`
- `src/App.svelte`

**Create the tests folder structure:**
```bash
mkdir -p tests/fixtures tests/models tests/services tests/components tests/utils
mkdir -p data/events
```

Copy these into `tests/`:
- `tests/setup.ts`
- `tests/fixtures/index.ts`
- `tests/models/Event.test.ts`

### 3. Install Dependencies (2 minutes)

```bash
npm install
```

This will download and install all necessary packages (~400MB). Grab a coffee, it takes a minute or two.

### 4. Verify Everything Works (30 seconds)

**Test the dev server:**
```bash
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Open `http://localhost:5173/` in your browser. You should see the Rogers Park Events page.

Press `Ctrl+C` to stop.

**Test the test runner:**
```bash
npm run test:watch
```

You should see tests running:
```
✓ tests/models/Event.test.ts (45 tests)
Tests Files  1 passed (1)
     Tests  45 passed (45)
```

Press `q` to exit.

---

## You're Done! 🎉

Your project is now fully set up and ready for development.

---

## Recommended Next Steps

### Option 1: Understand the Structure (5 minutes)
```bash
# Read these in order:
cat SETUP-COMPLETE.md
cat VITE-SVELTE-SETUP.md
cat TDD-TESTING-PLAN.md
```

### Option 2: Start Building Right Now (2 minutes)
```bash
# Run dev server in one terminal
npm run dev

# Run tests in another terminal
npm run test:watch
```

Then follow the TDD workflow:
1. Write a failing test
2. Make it pass
3. Refactor
4. Repeat

### Option 3: Jump to a Specific Guide
- **Building components?** → Read `TDD-QUICK-REFERENCE.md`
- **Want examples?** → Look at `tests/models/Event.test.ts`
- **Understanding data?** → Check `events-data-model.ts` and `data-structure-example.yaml`

---

## Project Structure Recap

```
rogers-park-events/
├── src/
│   ├── lib/
│   │   ├── models/        ← Your data types (Event, Venue, etc.)
│   │   ├── services/      ← Business logic (filtering, search, etc.)
│   │   └── utils/         ← Helper functions (date, distance, etc.)
│   ├── components/        ← Svelte components (EventCard, EventList, etc.)
│   ├── App.svelte         ← Root component
│   └── main.ts            ← Entry point
├── tests/
│   ├── setup.ts           ← Test configuration
│   ├── fixtures/          ← Mock data
│   ├── models/            ← Model tests
│   ├── services/          ← Service tests
│   └── components/        ← Component tests
├── data/                  ← Static JSON event data
├── public/                ← Static assets
├── index.html             ← HTML entry point
├── package.json           ← Dependencies & scripts
├── tsconfig.json          ← TypeScript config
├── vite.config.ts         ← Vite config
├── vitest.config.ts       ← Test config
└── .gitignore             ← Git ignore
```

---

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build           # Create production build
npm run preview         # Preview production build

# Testing
npm run test            # Run tests once
npm run test:watch      # Watch tests (RECOMMENDED!)
npm run test:ui         # Visual test dashboard
npm run test:coverage   # Coverage report

# Code Quality
npm run lint            # Check for errors
npm run format          # Auto-format code
```

---

## Troubleshooting

### "Port 5173 already in use"
```bash
npm run dev -- --port 3000
```

### "npm: command not found"
Node.js isn't installed. Download from https://nodejs.org/

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tests not running
Make sure `tests/setup.ts`, `tests/fixtures/index.ts`, and `tests/models/Event.test.ts` are in the right place.

### TypeScript errors
```bash
npx tsc --noEmit
```

---

## Next: The TDD Workflow

Once everything is running, this is how you build features:

```
1. WRITE TEST (Red)
   └─ npm run test:watch
   └─ Test fails ❌

2. IMPLEMENT CODE (Green)
   └─ Edit src/lib/...
   └─ Test passes ✅

3. REFACTOR (Refactor)
   └─ Clean up code
   └─ Test still passes ✅

4. REPEAT
   └─ Next feature
```

Example in `TDD-QUICK-REFERENCE.md`.

---

## You're Ready! 🚀

Everything is set up. You have:

✅ Vite + Svelte + TypeScript  
✅ Vitest + Testing Library  
✅ Example tests  
✅ Mock data  
✅ TDD workflows  

Start coding!

```bash
npm run dev
npm run test:watch
```

Welcome to TDD. Build something amazing! 💜
