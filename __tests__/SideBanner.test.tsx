import { render, screen } from '@testing-library/react'
import SideBanner from '@/components/SideBanner'
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('SideBanner Component UI', () => {
    it('Should have Crush It title UI element', () => {
        // Arrange
        render(<SideBanner />)

        // Actions
        const title = screen.getByText('Crush It')

        // Assertions
        expect(title).toBeInTheDocument()
    })

    it('Should have Plan Day button UI element', () => {
        // Arrange
        render(<SideBanner />)

        // Actions
        const planDayButton = screen.getByRole('button', {name: 'Plan Day'})

        // Assertions
        expect(planDayButton).toBeInTheDocument()
    })


    it('Should have It`s time to plan your day! text UI element', () => {
        // Arrange
        render(<SideBanner />)

        // Actions
        const planDayText = screen.getByText(`It's time to plan your day!`)

        // Assertions
        expect(planDayText).toBeInTheDocument()
    })
})