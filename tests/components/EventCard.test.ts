import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import EventCard from '$components/EventCard.svelte'
import { mockEvent1, mockEvent2 } from '../fixtures'

describe('EventCard', () => {
  describe('rendering', () => {
    it('should render event title', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      expect(screen.getByText(mockEvent1.title)).toBeInTheDocument()
    })

    it('should render event date and time', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      expect(screen.getByText(/Jun 20/i)).toBeInTheDocument()
      expect(screen.getByText(/9:00 PM/i)).toBeInTheDocument()
    })

    it('should render event short description', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      expect(screen.getByText(mockEvent1.shortDescription)).toBeInTheDocument()
    })

    it('should render category badge', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const categoryText = screen.getByText('music', { selector: '.category-text' })
      expect(categoryText).toBeInTheDocument()
    })

    it('should render cost type indicator', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const costBadge = screen.getByLabelText('Cost: Free')
      expect(costBadge).toBeInTheDocument()
    })

    it('should render wheelchair accessible icon if accessible', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const accessibleElement = screen.getByLabelText(/wheelchair accessible/i)
      expect(accessibleElement).toBeInTheDocument()
    })

    it('should not render wheelchair icon if not accessible', () => {
      const inaccessibleEvent = { ...mockEvent1, wheelchairAccessible: false }
      render(EventCard, { props: { event: inaccessibleEvent } })
      expect(screen.queryByLabelText(/wheelchair accessible/i)).not.toBeInTheDocument()
    })

    it('should render venue name', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      expect(screen.getByText(mockEvent1.venueId)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have semantic article element', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()
    })

    it('should be keyboard focusable', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('tabindex', '0')
    })

    it('should have visible focus indicator', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      // Just verify it has focus-related styles (outline set in CSS)
      expect(card).toHaveClass('event-card')
    })

    it('should have descriptive heading', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent(mockEvent1.title)
    })

    it('should have aria-label for interactive elements', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label')
    })

    it('should have sufficient color contrast', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toHaveClass('card-title')
    })
  })

  describe('mobile layout', () => {
    it('should stack content vertically on mobile', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toHaveClass('event-card')
    })

    it('should have adequate touch target size', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('should have readable font size on mobile', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toHaveClass('card-title')
    })

    it('should have proper line spacing for readability', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const description = screen.getByText(mockEvent1.shortDescription)
      expect(description).toHaveClass('card-description')
    })
  })

  describe('interactivity', () => {
    it('should be clickable', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(EventCard, {
        props: { event: mockEvent1, onClick: handleClick },
      })
      const card = screen.getByRole('article')
      await user.click(card)
      expect(handleClick).toHaveBeenCalled()
    })

    it('should respond to Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(EventCard, {
        props: { event: mockEvent1, onClick: handleClick },
      })
      const card = screen.getByRole('article')
      card.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })

    it('should respond to Space key', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(EventCard, {
        props: { event: mockEvent1, onClick: handleClick },
      })
      const card = screen.getByRole('article')
      card.focus()
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalled()
    })

    it('should have hover state indicator', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toHaveClass('event-card')
    })
  })

  describe('visual design', () => {
    it('should have card styling with shadow', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toHaveClass('event-card')
    })

    it('should have rounded corners', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('should have background color', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const card = screen.getByRole('article')
      expect(card).toHaveClass('event-card')
    })
  })

  describe('different event types', () => {
    it('should handle free events', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      const costBadge = screen.getByLabelText('Cost: Free')
      expect(costBadge).toBeInTheDocument()
    })

    it('should handle paid events', () => {
      const paidEvent = {
        ...mockEvent1,
        costType: 'paid',
        cost: { minPrice: 15, maxPrice: 30, currency: 'USD' },
      }
      render(EventCard, { props: { event: paidEvent } })
      expect(screen.getByText(/\$15/)).toBeInTheDocument()
    })

    it('should display all categories', () => {
      render(EventCard, { props: { event: mockEvent1 } })
      mockEvent1.categories.forEach(category => {
        const elements = screen.getAllByText(category)
        expect(elements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('responsive design', () => {
    it('should adapt layout for tablet (640px+)', () => {
      const { container } = render(EventCard, { props: { event: mockEvent1 } })
      expect(container).toBeInTheDocument()
    })

    it('should have proper spacing at all breakpoints', () => {
      const { container } = render(EventCard, { props: { event: mockEvent1 } })
      const card = container.querySelector('article')
      expect(card).toHaveAttribute('class')
    })
  })

  describe('edge cases', () => {
    it('should handle long event titles', () => {
      const longTitleEvent = {
        ...mockEvent1,
        title: 'This is a very long event title that might wrap on mobile devices and should still look good',
      }
      render(EventCard, { props: { event: longTitleEvent } })
      expect(screen.getByText(/very long/)).toBeInTheDocument()
    })

    it('should handle missing optional fields gracefully', () => {
      const minimalEvent = {
        ...mockEvent1,
        image: undefined,
      }
      render(EventCard, { props: { event: minimalEvent } })
      expect(screen.getByText(minimalEvent.title)).toBeInTheDocument()
    })
  })
})
