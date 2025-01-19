import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
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

vi.mock('../src/components/Map', () => ({
  default: () => <div data-testid="map">Mock Map</div>,
}));

vi.mock('../src/components/Spinner', () => ({
  default: () => <div data-testid="spinner">Mock Spinner</div>,
}));

global.navigator.geolocation = {
  watchPosition: vi.fn((success) => success({ coords: { latitude: 1, longitude: 1 } })),
  clearWatch: vi.fn(),
};

describe('HomePage Component', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it('redirects to /login if the user is not authenticated', async () => {
    vi.mocked(useAuthState).mockReturnValue([null]);

    render(<HomePage />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login');
    });
  });

  it('renders the HomePage when the user is authenticated', async () => {
    vi.mocked(useAuthState).mockReturnValue([{ uid: '123' }]);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('map')).toBeInTheDocument();
    });
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
  });

  it('renders a Spinner until geolocation is available', async () => {
    vi.mocked(useAuthState).mockReturnValue([{ uid: '123' }]);

    global.navigator.geolocation = {
      watchPosition: vi.fn((success, error) => error({ message: 'Geolocation failed' })),
      clearWatch: vi.fn(),
    };

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('renders the Map once geolocation data is available', async () => {
    vi.mocked(useAuthState).mockReturnValue([{ uid: '123' }]);

    global.navigator.geolocation = {
      watchPosition: vi.fn((success) => success({ coords: { latitude: 1, longitude: 1 } })),
      clearWatch: vi.fn(),
    };

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('map')).toBeInTheDocument();
    });
  });
});
