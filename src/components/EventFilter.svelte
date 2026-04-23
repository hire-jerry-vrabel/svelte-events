<script>
  export let onFilterChange = undefined

  let searchQuery = ''
  let selectedCategories = []
  let selectedCostTypes = []
  let startDate = ''
  let endDate = ''

  const categories = [
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'theater_performance', label: 'Theater', emoji: '🎭' },
    { id: 'visual_arts', label: 'Visual Arts', emoji: '🎨' },
    { id: 'film', label: 'Film', emoji: '🎬' },
    { id: 'literature', label: 'Literature', emoji: '📚' },
    { id: 'food_beverage', label: 'Food & Beverage', emoji: '🍴' },
    { id: 'sports_recreation', label: 'Sports', emoji: '⚽' },
    { id: 'health_wellness', label: 'Wellness', emoji: '🧘' },
  ]

  const costTypes = [
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
    { id: 'donation', label: 'Donation' },
  ]

  function toggleCategory(categoryId) {
    const index = selectedCategories.indexOf(categoryId)
    if (index > -1) {
      selectedCategories.splice(index, 1)
    } else {
      selectedCategories.push(categoryId)
    }
    selectedCategories = selectedCategories
    emitChange()
  }

  function toggleCostType(costType) {
    const index = selectedCostTypes.indexOf(costType)
    if (index > -1) {
      selectedCostTypes.splice(index, 1)
    } else {
      selectedCostTypes.push(costType)
    }
    selectedCostTypes = selectedCostTypes
    emitChange()
  }

  function handleSearchChange(e) {
    searchQuery = e.target.value
    emitChange()
  }

  function handleStartDateChange(e) {
    startDate = e.target.value
    emitChange()
  }

  function handleEndDateChange(e) {
    endDate = e.target.value
    emitChange()
  }

  function clearFilters() {
    searchQuery = ''
    selectedCategories = []
    selectedCostTypes = []
    startDate = ''
    endDate = ''
    emitChange()
  }

  function emitChange() {
    const filterData = {
      searchQuery,
      selectedCategories,
      selectedCostTypes,
      startDate,
      endDate,
    }
    
    const event = new CustomEvent('filterChange', {
      detail: filterData,
      bubbles: true,
    })
    
    window.dispatchEvent(event)
  }
</script>

<section class="filter-section" role="region" aria-label="Event filters">
  <div class="filter-header">
    <h2 class="filter-title">Filter Events</h2>
    <button class="clear-button" on:click={clearFilters} aria-label="Clear all filters">
      Clear All
    </button>
  </div>

  <!-- Search -->
  <div class="search-container">
    <input
      type="text"
      class="search-input"
      placeholder="Search events..."
      value={searchQuery}
      on:input={handleSearchChange}
      aria-label="Search events"
    />
  </div>

  <!-- Categories -->
  <fieldset class="filter-group">
    <legend class="filter-group-title">Categories</legend>
    <div class="checkbox-group">
      {#each categories as category}
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="checkbox-input"
            checked={selectedCategories.includes(category.id)}
            on:change={() => toggleCategory(category.id)}
            aria-label={category.label}
          />
          <span class="checkbox-icon">{category.emoji}</span>
          <span class="checkbox-text">{category.label}</span>
        </label>
      {/each}
    </div>
  </fieldset>

  <!-- Cost Type -->
  <fieldset class="filter-group">
    <legend class="filter-group-title">Cost</legend>
    <div class="checkbox-group">
      {#each costTypes as costType}
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="checkbox-input"
            checked={selectedCostTypes.includes(costType.id)}
            on:change={() => toggleCostType(costType.id)}
            aria-label={costType.label}
          />
          <span class="checkbox-text">{costType.label}</span>
        </label>
      {/each}
    </div>
  </fieldset>

  <!-- Date Range -->
  <fieldset class="filter-group">
    <legend class="filter-group-title">Date Range</legend>
    <div class="date-inputs">
      <div class="date-field">
        <label for="start-date" class="date-label">Start Date</label>
        <input
          id="start-date"
          type="date"
          class="date-input"
          value={startDate}
          on:change={handleStartDateChange}
          aria-label="Start date"
        />
      </div>
      <div class="date-field">
        <label for="end-date" class="date-label">End Date</label>
        <input
          id="end-date"
          type="date"
          class="date-input"
          value={endDate}
          on:change={handleEndDateChange}
          aria-label="End date"
        />
      </div>
    </div>
  </fieldset>
</section>

<style>
  .filter-section {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 28px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #1f2937;
    flex: 1;
    min-width: 0;
  }

  .clear-button {
    padding: 8px 12px;
    background-color: #f3f4f6;
    color: #6b7280;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .clear-button:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }

  .clear-button:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Search */
  .search-container {
    margin-bottom: 24px;
    width: 100%;
    box-sizing: border-box;
  }

  .search-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    transition: border-color 0.2s ease-in-out;
    box-sizing: border-box;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Filter Groups */
  .filter-group {
    margin-bottom: 24px;
    border: none;
    padding: 0;
  }

  .filter-group:last-child {
    margin-bottom: 0;
  }

  .filter-group-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 12px 0;
    display: block;
  }

  /* Checkboxes */
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: background-color 0.2s ease-in-out;
  }

  .checkbox-label:hover {
    background-color: #f9fafb;
  }

  .checkbox-input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #667eea;
    flex-shrink: 0;
  }

  .checkbox-input:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .checkbox-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }

  .checkbox-text {
    font-size: 13px;
    color: #4b5563;
    flex: 1;
    min-width: 0;
    word-break: break-word;
  }

  /* Date Inputs */
  .date-inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .date-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    box-sizing: border-box;
  }

  .date-label {
    font-size: 12px;
    font-weight: 600;
    color: #4b5563;
  }

  .date-input {
    padding: 10px 12px;
    font-size: 13px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    transition: border-color 0.2s ease-in-out;
    width: 100%;
    box-sizing: border-box;
  }

  .date-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Mobile */
  @media (max-width: 640px) {
    .filter-section {
      padding: 16px;
      margin-bottom: 20px;
    }

    .filter-header {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-title {
      font-size: 16px;
    }

    .clear-button {
      width: 100%;
    }

    .checkbox-group {
      gap: 6px;
    }

    .checkbox-label {
      padding: 4px;
    }
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .filter-section {
      background-color: #1f2937;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .filter-title {
      color: #f3f4f6;
    }

    .clear-button {
      background-color: #374151;
      color: #d1d5db;
      border-color: #4b5563;
    }

    .clear-button:hover {
      background-color: #4b5563;
      border-color: #6b7280;
    }

    .search-input {
      background-color: #111827;
      color: #f3f4f6;
      border-color: #4b5563;
    }

    .search-input:focus {
      border-color: #667eea;
    }

    .filter-group-title {
      color: #f3f4f6;
    }

    .checkbox-label:hover {
      background-color: #374151;
    }

    .checkbox-text {
      color: #d1d5db;
    }

    .date-label {
      color: #9ca3af;
    }

    .date-input {
      background-color: #111827;
      color: #f3f4f6;
      border-color: #4b5563;
    }

    .date-input:focus {
      border-color: #667eea;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .checkbox-label,
    .clear-button,
    .search-input,
    .date-input {
      transition: none;
    }
  }
</style>
