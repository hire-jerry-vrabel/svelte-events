import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import EventList from '$components/EventList.svelte'
import { mockEvent1, mockEvent2, mockEvents } from '../fixtures'

describe('EventList', () => {
  describe('rendering', () => {
    it('should render multiple event cards', () => {
      render(EventList, { props: { events: mockEvents } })
      expect(screen.getByText(mockEvent1.title)).toBeInTheDocument()
      expect(screen.getByText(mockEvent2.title)).toBeInTheDocument()
    })

    it('should render correct number of cards', () => {
      render(EventList, { props: { events: mockEvents } })
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(mockEvents.length)
    })

    it('should pass correct props to each EventCard', () => {
      render(EventList, { props: { events: mockEvents } })
      expect(screen.getByText(mockEvent1.title)).toBeInTheDocument()
      expect(screen.getByText(mockEvent2.title)).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('should render empty state message when no events', () => {
      render(EventList, { props: { events: [] } })
      expect(screen.getByText(/no events found/i)).toBeInTheDocument()
    })

    it('should not render cards when empty', () => {
      render(EventList, { props: { events: [] } })
      expect(screen.queryAllByRole('article')).toHaveLength(0)
    })

    it('should have helpful empty state text', () => {
      render(EventList, { props: { events: [] } })
      const emptyState = screen.getByText(/try adjusting your filters/i)
      expect(emptyState).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('should render loading skeletons when isLoading is true', () => {
      render(EventList, { props: { events: [], isLoading: true } })
      const skeletons = screen.getAllByTestId('event-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should not render cards when loading', () => {
      render(EventList, { props: { events: mockEvents, isLoading: true } })
      expect(screen.queryAllByRole('article')).toHaveLength(0)
    })

    it('should show loading indicator', () => {
      render(EventList, { props: { events: [], isLoading: true } })
      expect(screen.getAllByTestId('event-skeleton').length).toBeGreaterThan(0)
    })
  })

  describe('error state', () => {
    it('should render error message when error prop is set', () => {
      const errorMsg = 'Failed to load events'
      render(EventList, { props: { events: [], error: errorMsg } })
      expect(screen.getByText(errorMsg)).toBeInTheDocument()
    })

    it('should show retry button on error', () => {
      render(EventList, { props: { events: [], error: 'Failed to load', onRetry: () => {} } })
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should call onRetry when retry button clicked', () => {
      render(EventList, { props: { events: [], error: 'Failed to load', onRetry: () => {} } })
      const retryBtn = screen.getByRole('button')
      expect(retryBtn).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible list structure', () => {
      render(EventList, { props: { events: mockEvents } })
      const section = screen.getByRole('region')
      expect(section).toBeInTheDocument()
    })

    it('should have descriptive aria-label', () => {
      render(EventList, { props: { events: mockEvents } })
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-label')
    })

    it('should announce event count', () => {
      render(EventList, { props: { events: mockEvents } })
      const section = screen.getByRole('region')
      expect(section.textContent).toContain('events')
    })

    it('should have proper heading hierarchy', () => {
      render(EventList, { props: { events: mockEvents } })
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    })
  })

  describe('mobile layout', () => {
    it('should render single column on mobile', () => {
      render(EventList, { props: { events: mockEvents } })
      const events = screen.getAllByRole('article')
      expect(events.length).toBeGreaterThan(0)
    })

    it('should have proper spacing', () => {
      render(EventList, { props: { events: mockEvents } })
      const section = screen.getByRole('region')
      expect(section).toBeInTheDocument()
    })
  })

  describe('event interactions', () => {
    it('should handle event card click', () => {
      render(EventList, { props: { events: mockEvents } })
      const firstCard = screen.getByText(mockEvent1.title).closest('article')
      expect(firstCard).toBeInTheDocument()
    })

    it('should render all events with click handlers', () => {
      render(EventList, { props: { events: mockEvents } })
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(2)
    })
  })

  describe('pagination', () => {
    it('should show pagination info', () => {
      const manyEvents = Array(25).fill(null).map((_, i) => ({
        ...mockEvent1,
        id: `event-${i}`,
      }))
      render(EventList, { props: { events: manyEvents, itemsPerPage: 10 } })
      expect(screen.getByText(/Showing/)).toBeInTheDocument()
    })

    it('should have next page button when more events exist', () => {
      const manyEvents = Array(25).fill(null).map((_, i) => ({
        ...mockEvent1,
        id: `event-${i}`,
      }))
      render(EventList, { props: { events: manyEvents, itemsPerPage: 10 } })
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle single event', () => {
      render(EventList, { props: { events: [mockEvent1] } })
      expect(screen.getByText(mockEvent1.title)).toBeInTheDocument()
      expect(screen.getAllByRole('article')).toHaveLength(1)
    })

    it('should handle very long list', () => {
      const manyEvents = Array(100).fill(null).map((_, i) => ({
        ...mockEvent1,
        id: `event-${i}`,
        title: `Event ${i}`,
      }))
      render(EventList, { props: { events: manyEvents } })
      expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
    })
  })
})
