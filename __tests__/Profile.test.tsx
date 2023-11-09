/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Profile from '@/pages/profile'

it('should have Profile text', () => {
    render(<Profile />) // ARRANGE

    const myElem = screen.getByText('Profile') // ACT

    expect(myElem).toBeInTheDocument() // ASSERT
})