import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../src/components/LoginForm';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import { useSignInWithGithub } from 'react-firebase-hooks/auth';
import axios from 'axios';

vi.mock('react-firebase-hooks/auth', () => ({
  useSignInWithGithub: vi.fn(),
  useAuthState: vi.fn(() => [{ uid: '12345' }, false]),
}));

vi.mock('axios');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    useNavigate: vi.fn(),
  };
});

describe('LoginForm Component', () => {
  const mockSignInWithGithub = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockSignInWithGithub.mockResolvedValue({
      user: {
        uid: '12345',
        displayName: 'Test User',
        email: 'testuser@test.com',
        photoURL: 'https://test.com/photo.jpg',
      },
    });

    useSignInWithGithub.mockReturnValue([mockSignInWithGithub, null, null, false]);

    axios.get.mockResolvedValue({
      data: {
        user: {
          role: 'admin',
        },
      },
    });

    axios.post.mockResolvedValue({
      data: {
        user: {
          role: 'admin',
          name: 'Test User',
          email: 'testuser@test.com',
          profileImage: 'https://test.com/photo.jpg',
        },
      },
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders login form correctly', () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );

    expect(screen.getByText('Logga in!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Lösenord')).toBeInTheDocument();
    expect(screen.getByText('Logga In')).toBeInTheDocument();
    expect(screen.getByText('Logga in med GitHub')).toBeInTheDocument();
  });

  it('triggers GitHub login when GitHub button is clicked', async () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );

    fireEvent.click(screen.getByText('Logga in med GitHub'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          oauthId: '12345',
          name: 'Test User',
          email: 'testuser@test.com',
          profileImage: 'https://test.com/photo.jpg',
        })
      );

      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('does not trigger GitHub login on failure', async () => {
    mockSignInWithGithub.mockRejectedValue(new Error('GitHub login failed'));

    render(
      <Router>
        <LoginForm />
      </Router>
    );

    fireEvent.click(screen.getByText('Logga in med GitHub'));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
