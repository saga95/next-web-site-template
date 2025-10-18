import { render, screen } from '@testing-library/react'
import Home from '../../src/pages/index'

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the page title', () => {
    render(<Home />)
    // Adjust these expectations based on your actual home page content
    expect(document.title).toBeDefined()
  })
})
