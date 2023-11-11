/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Index from '@/pages/index'
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('Index Page UI', () => {
    it('Should have tasks section title UI element', () => {
        // Arrange
        render(<Index />)

        // Actions
        const tasksTitle = screen.getByText('Tasks')

        // Assertions
        expect(tasksTitle).toBeInTheDocument()
    })
})
