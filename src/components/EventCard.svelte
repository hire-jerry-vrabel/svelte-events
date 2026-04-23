<script>
  export let event = null

  function formatTime(timeStr) {
    if (!timeStr) return 'Time TBA'
    try {
      const [hours, minutes] = timeStr.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch (e) {
      return timeStr
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Date TBA'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch (e) {
      return dateStr
    }
  }

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
</script>

<article 
  class="event-card"
  role="article"
  aria-label="{event.title} on {formatDate(event.dateTime)} at {formatTime(event.time)}"
>
  <div class="card-content">
    <div class="card-header">
      <h3 class="card-title">{event.title}</h3>
      <div class="cost-badge" aria-label="Cost: {event.costType === 'free' ? 'Free' : event.costType === 'paid' ? 'Paid' : 'Donation'}">
        {#if event.costType === 'free'}
          Free
        {:else if event.costType === 'paid'}
          Paid
        {:else if event.costType === 'donation'}
          Donation
        {/if}
      </div>
    </div>

    <p class="card-description">{event.shortDescription}</p>

    <div class="card-meta">
      <div class="meta-item">
        <span class="meta-icon" aria-hidden="true">📅</span>
        <span class="meta-text">{formatDate(event.dateTime)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon" aria-hidden="true">⏰</span>
        <span class="meta-text">{formatTime(event.time)}</span>
      </div>
    </div>

    <div class="categories">
      {#each event.categories as category}
        <span class="category-badge" title={category}>
          <span aria-hidden="true">{categoryEmojis[category] || '🏷️'}</span>
          <span class="sr-only">{category.replace(/_/g, ' ')}</span>
          <span class="category-text">{category.replace(/_/g, ' ')}</span>
        </span>
      {/each}
    </div>

    <div class="card-footer">
      <div class="venue-info">
        <span class="venue-icon" aria-hidden="true">📍</span>
        <span class="venue-name">{event.venueId}</span>
      </div>

      {#if event.wheelchairAccessible}
        <div class="accessibility-badge" aria-label="Wheelchair accessible">
          <span aria-hidden="true">♿</span>
          <span class="sr-only">Wheelchair accessible</span>
        </div>
      {/if}
    </div>
  </div>
</article>

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

  .event-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .event-card:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .card-content {
    padding: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #1f2937;
    flex: 1;
  }

  .cost-badge {
    display: inline-block;
    padding: 6px 12px;
    background-color: #ecfdf5;
    color: #065f46;
    border-radius: 20px;
    font-weight: 600;
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .card-description {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 16px 0;
    line-height: 1.5;
  }

  .card-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #4b5563;
  }

  .meta-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .meta-text {
    font-weight: 500;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background-color: #f3f4f6;
    border-radius: 16px;
    font-size: 13px;
    color: #4b5563;
  }

  .category-text {
    font-weight: 500;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
  }

  .venue-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;
    flex: 1;
  }

  .venue-icon {
    font-size: 16px;
  }

  .venue-name {
    font-weight: 500;
  }

  .accessibility-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f0f9ff;
    font-size: 18px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .card-content {
      padding: 16px;
    }

    .card-title {
      font-size: 16px;
    }

    .card-description {
      font-size: 13px;
    }

    .card-meta {
      gap: 12px;
      font-size: 13px;
    }
  }

  @media (prefers-color-scheme: dark) {
    .event-card {
      background-color: #1f2937;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .card-title {
      color: #f3f4f6;
    }

    .card-description {
      color: #d1d5db;
    }

    .meta-item {
      color: #9ca3af;
    }

    .category-badge {
      background-color: #374151;
      color: #d1d5db;
    }

    .venue-info {
      color: #9ca3af;
    }

    .card-footer {
      border-top-color: #374151;
    }

    .accessibility-badge {
      background-color: #0c4a6e;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .event-card {
      transition: none;
    }
  }
</style>
