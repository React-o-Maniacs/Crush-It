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
        const userInfoTitle = screen.getByText('User Info')
        const changePasswordTitle = screen.getByText('Change Password')
        const pomodoroTimerTitle = screen.getByText('Pomodoro Timer (Minutes)')

        // Assertions
        expect(profileTitle).toBeInTheDocument()
        expect(userInfoTitle).toBeInTheDocument()
        expect(changePasswordTitle).toBeInTheDocument()
        expect(pomodoroTimerTitle).toBeInTheDocument()
    })
    it('Should have profile section button UI elements', () => {
        // Arrange
        render(<Profile />)

        // Actions
        const cancelButton = screen.getByRole('button', {name: 'Cancel'})
        const saveButton = screen.getByRole('button', {name: 'Save'})

        // Assertions
        expect(cancelButton).toBeInTheDocument()
        expect(saveButton).toBeInTheDocument()

    })
})
