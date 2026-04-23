<script>
  import EventCard from './EventCard.svelte'

  export let events = []
  export let isLoading = false
  export let error = null
  export let onRetry = undefined
  export let itemsPerPage = null
  export let onEventClick = undefined

  let currentPage = 1

  $: displayEvents = itemsPerPage 
    ? events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : events

  $: totalPages = itemsPerPage ? Math.ceil(events.length / itemsPerPage) : 1
  $: hasNextPage = currentPage < totalPages
  $: hasPrevPage = currentPage > 1

  function handleNextPage() {
    if (hasNextPage) {
      currentPage += 1
    }
  }

  function handlePrevPage() {
    if (hasPrevPage) {
      currentPage -= 1
    }
  }

  function handleRetry() {
    if (onRetry) {
      onRetry()
    }
  }

  function handleEventClick(event) {
    const clickEvent = new CustomEvent('eventClick', {
      detail: event,
      bubbles: true,
    })
    window.dispatchEvent(clickEvent)
  }
</script>

<section 
  class="events-section"
  role="region"
  aria-label="Events list"
>
  <h2 class="sr-only">Events</h2>

  <!-- Loading State -->
  {#if isLoading}
    <div class="loading-container">
      {#each Array(3) as _}
        <div class="event-skeleton" data-testid="event-skeleton">
          <div class="skeleton-header"></div>
          <div class="skeleton-content"></div>
          <div class="skeleton-footer"></div>
        </div>
      {/each}
    </div>
  <!-- Error State -->
  {:else if error}
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">Something went wrong</h3>
      <p class="error-message">{error}</p>
      {#if onRetry}
        <button class="retry-button" on:click={handleRetry}>
          Retry
        </button>
      {/if}
    </div>
  <!-- Empty State -->
  {:else if events.length === 0}
    <div class="empty-container">
      <div class="empty-icon">📭</div>
      <h3 class="empty-title">No events found</h3>
      <p class="empty-message">Try adjusting your filters or check back later</p>
    </div>
  <!-- Events List -->
  {:else}
    <div class="events-header">
      <h2 class="events-title">Upcoming Events</h2>
      <p class="events-count">{events.length} {events.length === 1 ? 'event' : 'events'} available</p>
    </div>

    <div class="events-container">
      {#each displayEvents as event (event.id)}
        <div 
          class="event-card-wrapper"
          on:click={() => handleEventClick(event)}
          role="button"
          tabindex="0"
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleEventClick(event)
            }
          }}
        >
          <EventCard {event} />
        </div>
      {/each}
    </div>

    <!-- Pagination -->
    {#if itemsPerPage && events.length > itemsPerPage}
      <div class="pagination">
        <button 
          class="pagination-button"
          disabled={!hasPrevPage}
          on:click={handlePrevPage}
          aria-label="Previous page"
        >
          ← Previous
        </button>

        <div class="pagination-info">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, events.length)}–{Math.min(currentPage * itemsPerPage, events.length)} of {events.length}
        </div>

        <button 
          class="pagination-button"
          disabled={!hasNextPage}
          on:click={handleNextPage}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    {/if}
  {/if}
</section>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .events-section {
    width: 100%;
  }

  .events-header {
    margin-bottom: 28px;
  }

  .events-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #1f2937;
  }

  .events-count {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  /* Events Container */
  .events-container {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .events-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (min-width: 1024px) {
    .events-container {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
  }

  /* Event Card Wrapper */
  .event-card-wrapper {
    cursor: pointer;
    border-radius: 12px;
    transition: transform 0.2s ease-in-out;
  }

  .event-card-wrapper:hover {
    transform: translateY(-4px);
  }

  .event-card-wrapper:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 12px;
  }

  /* Loading State */
  .loading-container {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .loading-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (min-width: 1024px) {
    .loading-container {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
  }

  .event-skeleton {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .skeleton-header {
    height: 24px;
    background-color: #e5e7eb;
    border-radius: 6px;
    margin-bottom: 12px;
  }

  .skeleton-content {
    height: 16px;
    background-color: #f3f4f6;
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .skeleton-footer {
    height: 20px;
    background-color: #f3f4f6;
    border-radius: 6px;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Empty State */
  .empty-container {
    text-align: center;
    padding: 60px 20px;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #1f2937;
  }

  .empty-message {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
  }

  /* Error State */
  .error-container {
    text-align: center;
    padding: 60px 20px;
    background-color: #fef2f2;
    border-radius: 12px;
    border: 1px solid #fecaca;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #991b1b;
  }

  .error-message {
    font-size: 14px;
    color: #7f1d1d;
    margin: 0 0 20px 0;
  }

  .retry-button {
    padding: 10px 20px;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .retry-button:hover {
    background-color: #dc2626;
  }

  .retry-button:focus {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    padding: 20px;
    border-top: 1px solid #e5e7eb;
  }

  .pagination-button {
    padding: 10px 16px;
    background-color: white;
    color: #1f2937;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .pagination-button:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  .pagination-button:focus:not(:disabled) {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-info {
    font-size: 14px;
    color: #6b7280;
    min-width: 120px;
    text-align: center;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .events-title {
      color: #f3f4f6;
    }

    .events-count {
      color: #d1d5db;
    }

    .empty-title {
      color: #f3f4f6;
    }

    .empty-message {
      color: #d1d5db;
    }

    .skeleton-header {
      background-color: #374151;
    }

    .skeleton-content,
    .skeleton-footer {
      background-color: #4b5563;
    }

    .error-container {
      background-color: #7f1d1d;
      border-color: #991b1b;
    }

    .error-title {
      color: #fecaca;
    }

    .error-message {
      color: #fca5a5;
    }

    .pagination-button {
      background-color: #1f2937;
      color: #f3f4f6;
      border-color: #4b5563;
    }

    .pagination-button:hover:not(:disabled) {
      background-color: #374151;
      border-color: #6b7280;
    }

    .pagination-info {
      color: #9ca3af;
    }
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .event-skeleton {
      animation: none;
      opacity: 0.5;
    }

    .pagination-button,
    .event-card-wrapper {
      transition: none;
    }
  }
</style>
