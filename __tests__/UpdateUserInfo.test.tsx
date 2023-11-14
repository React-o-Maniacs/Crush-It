import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Profile from '../pages/profile';
import { useSession, SessionContextValue } from 'next-auth/react';
import { NextRouter, useRouter } from 'next/router';

// Create type-safe mocks
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(),
}));

jest.mock('next/router', () => ({
  ...jest.requireActual('next/router'),
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useCurrentUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Profile Component', () => {
  const user = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { name: 'Test User', email: 'test@example.com' } } } as SessionContextValue);
    require('../hooks/useCurrentUser').default.mockReturnValue({ data: user });

    (useRouter as jest.Mock).mockReturnValue({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    } as unknown as NextRouter);

    // Mock console.error to prevent error output in test results
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore the original console.error function
    (console.error as jest.Mock).mockRestore();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should update user information', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'User info updated successfully' }),
        ok: true,
      }) as Promise<Response>
    );

    render(<Profile />);

    fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'currentPassword1234' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword12345' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newPassword12345' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3)); // One for user info, one for password, one for pomodoro settings
    expect(global.fetch).toHaveBeenCalledWith('/api/changePassword', expect.anything());
  });

  it('should update pomodoro settings', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Pomodoro settings saved' }),
        ok: true,
      }) as Promise<Response>
    );

    render(<Profile />);

    fireEvent.change(screen.getByLabelText('Pomodoro (minutes)'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Short Break (minutes)'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Long Break (minutes)'), { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2)); // One for user info, one for pomodoro settings
    expect(global.fetch).toHaveBeenCalledWith('/api/pomodoroSettings', expect.anything());
  });
});
