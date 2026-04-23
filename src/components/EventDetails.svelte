<script>
  export let event = null
  export let onClose = undefined

  const categoryEmojis = {
    music: '🎵',
    theater_performance: '🎭',
    visual_arts: '🎨',
    film: '🎬',
    literature: '📚',
    food_beverage: '🍴',
    sports_recreation: '⚽',
    health_wellness: '🧘',
    nightlife: '🌙',
    community_meeting: '🤝',
  }

  function handleClose() {
    if (onClose) {
      onClose()
    }
  }

  function handleEscape(e) {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      })
    }
  }

  function handleAddToCalendar() {
    const startDate = new Date(event.dateTime)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}`
    
    window.open(calendarUrl, '_blank')
  }

  function handleFavorite() {
    console.log('Added to favorites:', event.id)
  }
</script>

<svelte:window on:keydown={handleEscape} />

<div class="modal-overlay" on:click={handleClose}>
  <dialog class="modal-content" role="dialog" aria-labelledby="event-title" open>
    <div class="modal-header">
      <h2 id="event-title" class="modal-title">{event.title}</h2>
      <button
        class="close-button"
        on:click={handleClose}
        aria-label="Close event details"
      >
        ✕
      </button>
    </div>

    <div class="modal-body">
      <div class="event-hero">
        <div class="hero-placeholder">📸</div>
      </div>

      <div class="info-section">
        <h3 class="section-title">When</h3>
        <div class="info-content">
          <div class="info-item">
            <span class="info-icon">📅</span>
            <span>{formatDate(event.dateTime)}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">⏰</span>
            <span>{formatTime(event.time)}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">Where</h3>
        <div class="info-content">
          <div class="info-item">
            <span class="info-icon">📍</span>
            <span>{event.venueId}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">Organizer</h3>
        <div class="info-content">
          <div class="info-item">
            <span class="info-icon">👤</span>
            <span>{event.organizerId}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">Cost</h3>
        <div class="cost-badge">
          {#if event.costType === 'free'}
            Free
          {:else if event.costType === 'paid'}
            Paid
          {:else if event.costType === 'donation'}
            Donation
          {/if}
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">Categories</h3>
        <div class="categories-list">
          {#each event.categories as category}
            <span class="category-tag">
              {categoryEmojis[category] || '🏷️'}
              {category.replace(/_/g, ' ')}
            </span>
          {/each}
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">Accessibility</h3>
        <div class="accessibility-info">
          {#if event.wheelchairAccessible}
            <div class="accessibility-item">
              <span class="accessibility-icon">♿</span>
              <span>Wheelchair accessible</span>
            </div>
          {:else}
            <div class="accessibility-item">
              <span>Accessibility information not available</span>
            </div>
          {/if}
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">About This Event</h3>
        <p class="description">{event.description}</p>
      </div>
    </div>

    <div class="modal-footer">
      <button class="action-button secondary" on:click={handleShare} aria-label="Share event">
        📤 Share
      </button>
      <button class="action-button secondary" on:click={handleAddToCalendar} aria-label="Add to calendar">
        📆 Add to Calendar
      </button>
      <button class="action-button primary" on:click={handleFavorite} aria-label="Add to favorites">
        ❤️ Favorite
      </button>
    </div>
  </dialog>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    background-color: white;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: #1f2937;
    flex: 1;
    padding-right: 16px;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;
    flex-shrink: 0;
  }

  .close-button:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  .close-button:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .modal-body {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
  }

  .event-hero {
    margin: -24px -24px 24px -24px;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 12px 0 0;
  }

  .hero-placeholder {
    font-size: 80px;
  }

  .info-section {
    margin-bottom: 24px;
  }

  .info-section:last-of-type {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px 0;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    color: #1f2937;
  }

  .info-icon {
    font-size: 20px;
    width: 24px;
    text-align: center;
  }

  .cost-badge {
    display: inline-block;
    padding: 8px 16px;
    background-color: #ecfdf5;
    color: #065f46;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
  }

  .categories-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .category-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: #f3f4f6;
    border-radius: 20px;
    font-size: 14px;
    color: #4b5563;
  }

  .accessibility-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .accessibility-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: #1f2937;
  }

  .accessibility-icon {
    font-size: 20px;
    width: 24px;
    text-align: center;
  }

  .description {
    font-size: 15px;
    line-height: 1.6;
    color: #4b5563;
    margin: 0;
  }

  .modal-footer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
    border-radius: 0 0 12px 12px;
  }

  .action-button {
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .action-button.primary {
    background-color: #667eea;
    color: white;
  }

  .action-button.primary:hover {
    background-color: #5568d3;
  }

  .action-button.primary:focus {
    outline: 2px solid #5568d3;
    outline-offset: 2px;
  }

  .action-button.secondary {
    background-color: white;
    color: #4b5563;
    border: 1px solid #d1d5db;
  }

  .action-button.secondary:hover {
    background-color: #f3f4f6;
  }

  .action-button.secondary:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    .modal-overlay {
      padding: 0;
    }

    .modal-content {
      max-width: 100%;
      border-radius: 12px 12px 0 0;
      max-height: 100vh;
    }

    .modal-header {
      padding: 16px;
    }

    .modal-title {
      font-size: 20px;
    }

    .modal-body {
      padding: 16px;
    }

    .event-hero {
      margin: -16px -16px 16px -16px;
      height: 150px;
    }

    .modal-footer {
      grid-template-columns: 1fr;
      padding: 12px 16px;
      gap: 8px;
    }
  }

  @media (prefers-color-scheme: dark) {
    .modal-content {
      background-color: #1f2937;
    }

    .modal-header {
      border-bottom-color: #374151;
      background-color: #1f2937;
    }

    .modal-title {
      color: #f3f4f6;
    }

    .close-button {
      color: #9ca3af;
    }

    .close-button:hover {
      background-color: #374151;
      color: #f3f4f6;
    }

    .info-item {
      color: #f3f4f6;
    }

    .section-title {
      color: #9ca3af;
    }

    .category-tag {
      background-color: #374151;
      color: #d1d5db;
    }

    .description {
      color: #d1d5db;
    }

    .modal-footer {
      border-top-color: #374151;
      background-color: #111827;
    }

    .action-button.secondary {
      background-color: #374151;
      color: #d1d5db;
      border-color: #4b5563;
    }

    .action-button.secondary:hover {
      background-color: #4b5563;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .close-button,
    .action-button {
      transition: none;
    }
  }
</style>
