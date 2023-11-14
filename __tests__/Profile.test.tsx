/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Profile from '@/pages/profile'
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));
describe('Profile Page UI', () => {
    it('Should have profile section title UI elements', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const profileTitle = screen.getByText('Profile')

        // Assertions
        expect(profileTitle).toBeInTheDocument()
    })
    it('Should have cancel button UI element', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const saveButton = screen.getByRole('button', {name: 'Save'})

        // Assertions
        expect(saveButton).toBeInTheDocument()

    })
    it('Should have save button UI element', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const saveButton = screen.getByRole('button', {name: 'Save'})

        // Assertions
        expect(saveButton).toBeInTheDocument()

    })
    it('Should have User Info UI elements', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const userInfoTitle = screen.getByText('User Info')

        // Assertions
        expect(userInfoTitle).toBeInTheDocument()
    })
    it('Should have Change Password UI element', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const changePasswordTitle = screen.getByText('Change Password')

        // Assertions
        expect(changePasswordTitle).toBeInTheDocument()
    })
    it('Should have Pomodoro Timer (Minutes) UI elements', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const pomodoroTimerTitle = screen.getByText('Pomodoro Timer (Minutes)')

        // Assertions
        expect(pomodoroTimerTitle).toBeInTheDocument()
    })
})
