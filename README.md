cat > README.md << 'EOF'
# Rogers Park Events PWA

A beautiful, fully-tested Progressive Web App for discovering local events in Rogers Park, Chicago.

## Features

- 🎯 Real-time event filtering (search, categories, cost, date range)
- 🎨 Beautiful, responsive UI with dark mode support
- ♿ WCAG 2.1 AA accessibility compliant
- 📱 Mobile-first design
- 🧪 192+ passing tests (TDD)
- 🔌 Real API integration with caching
- 📋 Event details modal
- 🌙 Dark mode support

## Tech Stack

- Svelte + TypeScript
- Vite
- Vitest + Testing Library
- TailwindCSS-inspired styling

## Getting Started

### Prerequisites
- Node.js 16+
- npm or pnpm

### Development

1. Install dependencies:
```bash
npm install
```

2. Start json-server (in a separate terminal):
```bash
json-server --watch db.json --port 3001
```

3. Start dev server:
```bash
npm run dev
```

Visit `http://localhost:5173`

### Testing

Run tests:
```bash
npm run test
```

Watch mode:
```bash
npm run test:watch
```

### Build

```bash
npm run build
```

## Project Structure
