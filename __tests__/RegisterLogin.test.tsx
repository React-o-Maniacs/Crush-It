import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Auth from '../pages/auth';
import axios from 'axios';
import { signIn, SignInResponse } from 'next-auth/react';

jest.mock('axios');
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
  getSession: jest.fn(() => Promise.resolve({ user: { name: 'Test User', email: 'test@example.com' } })),
}));


describe('Auth Component', () => {
  const email = 'test@example.com';
  const password = 'password';
  
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Registration', () => {
    it('should handle registration', async () => {
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue({ data: {} });
      const { getByLabelText } = render(<Auth />);
      fireEvent.click(screen.getByText(/create an account/i));
      fireEvent.change(screen.getByLabelText(/email\/username/i), { target: { value: email } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: password } });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
      expect(axios.post).toHaveBeenCalledWith('/api/register', { email, password });
    });

    // Additional tests related to registration
  });

  describe('Login', () => {
    it('should handle login', async () => {
      const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;

      // Mock the signIn function to resolve successfully
      mockedSignIn.mockResolvedValue({ ok: true } as SignInResponse);

      // Render the Auth component
      render(<Auth />);
            
      // Fill in the email field
      fireEvent.change(screen.getByLabelText(/email\/username/i), { target: { value: email } });

      // Fill in the password field
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });

      // Submit the login form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      // Wait for signIn to be called and assert it was called correctly
      await waitFor(() => expect(signIn).toHaveBeenCalledTimes(1));
      expect(signIn).toHaveBeenCalledWith('credentials', { email, password, callbackUrl: '/' });
    });

    // Additional tests related to login
  });

  // Any other tests related to the Auth component
});
