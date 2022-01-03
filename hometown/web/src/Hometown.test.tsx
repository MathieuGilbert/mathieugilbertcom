import React from 'react'
import { render, screen } from '@testing-library/react'
import './Hometown'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hometown-page': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

test('renders learn react link', () => {
  render(<hometown-page />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
