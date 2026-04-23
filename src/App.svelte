<script>
  import { onMount } from 'svelte'
  import EventFilter from './components/EventFilter.svelte'
  import EventList from './components/EventList.svelte'
  import EventDetails from './components/EventDetails.svelte'
  import { EventAPI } from '$lib/services/EventAPI'

  let allEvents = []
  let filteredEvents = []
  let isLoading = true
  let error = null
  let selectedEvent = null

  const api = new EventAPI('http://localhost:3001')

  let filterState = {
    searchQuery: '',
    selectedCategories: [],
    selectedCostTypes: [],
    startDate: '',
    endDate: '',
  }

  // Load events on mount
  async function loadEvents() {
    try {
      isLoading = true
      error = null
      allEvents = await api.getEvents()
      filteredEvents = allEvents
      isLoading = false
    } catch (err) {
      console.error('Failed to load events:', err)
      error = 'Failed to load events. Make sure json-server is running on port 3001.'
      isLoading = false
    }
  }

  // Use onMount instead of checking window
  onMount(() => {
    loadEvents()
  })

  function handleFilterChange(e) {
    filterState = e.detail
    applyFilters()
  }

  function applyFilters() {
    try {
      isLoading = true
      error = null

      let results = [...allEvents]

      // Apply search filter
      if (filterState.searchQuery) {
        results = results.filter(event =>
          event.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(filterState.searchQuery.toLowerCase())
        )
      }

      // Apply category filters
      if (filterState.selectedCategories.length > 0) {
        results = results.filter(event =>
          event.categories.some(cat => filterState.selectedCategories.includes(cat))
        )
      }

      // Apply cost type filters
      if (filterState.selectedCostTypes.length > 0) {
        results = results.filter(event =>
          filterState.selectedCostTypes.includes(event.costType)
        )
      }

      // Apply date range filter
      if (filterState.startDate || filterState.endDate) {
        const startDate = filterState.startDate ? new Date(filterState.startDate) : new Date('2000-01-01')
        const endDate = filterState.endDate ? new Date(filterState.endDate) : new Date('2100-12-31')
        
        results = results.filter(event => {
          const eventDate = new Date(event.dateTime)
          return eventDate >= startDate && eventDate <= endDate
        })
      }

      filteredEvents = results
      isLoading = false
    } catch (err) {
      console.error('Filter error:', err)
      error = 'Failed to apply filters'
      isLoading = false
    }
  }

  function handleRetry() {
    loadEvents()
  }

  function handleEventCardClick(e) {
    selectedEvent = e.detail
  }

  function handleCloseDetails() {
    selectedEvent = null
  }

  // Listen for filter changes and event clicks
  if (typeof window !== 'undefined') {
    window.addEventListener('filterChange', handleFilterChange)
    window.addEventListener('eventClick', handleEventCardClick)
  }
</script>

<main>
  <div class="container">
    <header class="app-header">
      <h1 class="app-title">Rogers Park Events</h1>
      <p class="app-subtitle">Discover local events in your neighborhood</p>
    </header>

    <div class="content-grid">
      <aside class="sidebar">
        <EventFilter />
      </aside>

      <section class="main-content">
        <EventList 
          events={filteredEvents}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </section>
    </div>
  </div>

  {#if selectedEvent}
    <EventDetails 
      event={selectedEvent}
      onClose={handleCloseDetails}
    />
  {/if}
</main>

<style>
  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
  }

  main {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 0;
    margin: 0;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .app-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .app-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #1f2937;
  }

  .app-subtitle {
    font-size: 18px;
    color: #6b7280;
    margin: 0;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 28px;
  }

  .sidebar {
    position: sticky;
    top: 20px;
    height: fit-content;
  }

  .main-content {
    min-height: 60vh;
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .sidebar {
      position: static;
    }
  }

  @media (max-width: 640px) {
    .container {
      padding: 12px;
    }

    .app-header {
      margin-bottom: 24px;
    }

    .app-title {
      font-size: 28px;
    }

    .app-subtitle {
      font-size: 16px;
    }

    .content-grid {
      gap: 16px;
    }
  }

  @media (prefers-color-scheme: dark) {
    main {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    }

    .app-title {
      color: #f3f4f6;
    }

    .app-subtitle {
      color: #d1d5db;
    }
  }
</style>
