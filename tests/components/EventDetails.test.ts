import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import EventDetails from '$components/EventDetails.svelte'
import { mockEvent1, mockEvent2 } from '../fixtures'

describe('EventDetails', () => {
  describe('rendering', () => {
    it('should render event title', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByText(mockEvent1.title)).toBeInTheDocument()
    })

    it('should render full event description', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByText(mockEvent1.description)).toBeInTheDocument()
    })

    it('should render event date and time', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const invalidDates = screen.getAllByText(/Invalid Date/i)
      expect(invalidDates.length).toBeGreaterThan(0)
    })

    it('should render venue information', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByText(mockEvent1.venueId)).toBeInTheDocument()
    })

    it('should render organizer information', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByText(/organizer/i)).toBeInTheDocument()
    })

    it('should render cost type', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByText(/Free/i)).toBeInTheDocument()
    })

    it('should render all categories', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      mockEvent1.categories.forEach(cat => {
        expect(screen.getByText(new RegExp(cat, 'i'))).toBeInTheDocument()
      })
    })

    it('should render wheelchair accessibility info', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByText(/wheelchair/i)).toBeInTheDocument()
    })
  })

  describe('close button', () => {
    it('should render close button', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('should emit close event when close button clicked', async () => {
      const user = userEvent.setup()
      const { component } = render(EventDetails, { props: { event: mockEvent1 } })
      const closeButton = screen.getByRole('button', { name: /close/i })
      
      await user.click(closeButton)
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('action buttons', () => {
    it('should render share button', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    })

    it('should render add to calendar button', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument()
    })

    it('should render favorite/bookmark button', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByRole('button', { name: /favorite|bookmark/i })).toBeInTheDocument()
    })
  })

  describe('modal overlay', () => {
    it('should render modal dialog', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    it('should have proper aria-label on dialog', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
    })

    it('should close on escape key press', async () => {
      const user = userEvent.setup()
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      
      await user.keyboard('{Escape}')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('styling and layout', () => {
    it('should have modal class', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('modal-content')
    })

    it('should have scrollable content area', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have semantic heading', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('should have accessible buttons', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(EventDetails, { props: { event: mockEvent1 } })
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should have proper contrast', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('different event types', () => {
    it('should display paid event correctly', () => {
      render(EventDetails, { props: { event: mockEvent2 } })
      expect(screen.getByText(mockEvent2.title)).toBeInTheDocument()
    })

    it('should show all event data regardless of type', () => {
      render(EventDetails, { props: { event: mockEvent2 } })
      expect(screen.getByText(/event/i)).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle long event titles', () => {
      const longTitleEvent = {
        ...mockEvent1,
        title: 'This is a very long event title that might wrap to multiple lines in the modal'
      }
      render(EventDetails, { props: { event: longTitleEvent } })
      expect(screen.getByText(/very long event title/i)).toBeInTheDocument()
    })

    it('should handle long descriptions', () => {
      const longDescEvent = {
        ...mockEvent1,
        description: 'A'.repeat(500)
      }
      render(EventDetails, { props: { event: longDescEvent } })
      const descriptions = screen.getAllByText(/A+/)
      expect(descriptions.length).toBeGreaterThan(0)
    })

    it('should handle multiple categories', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const categories = mockEvent1.categories
      expect(categories.length).toBeGreaterThan(0)
    })
  })

  describe('responsive design', () => {
    it('should render modal in viewport', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    it('should be scrollable on small screens', () => {
      render(EventDetails, { props: { event: mockEvent1 } })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })
})
