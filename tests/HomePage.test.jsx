import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';


vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../src/components/MobileNav', () => ({
  default: () => <div data-testid="mobile-nav">Mock MobileNav</div>,
}));

describe('HomePage Component', () => {
  it('redirects to /login if the user is not authenticated', () => {
    const navigateMock = vi.fn();
    vi.mocked(useAuthState).mockReturnValue([null]);
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(<HomePage />);
  });

  it('renders the HomePage when the user is authenticated', () => {
    const navigateMock = vi.fn();
    vi.mocked(useAuthState).mockReturnValue([{ uid: '123' }]);
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(<HomePage />);
  });
});
