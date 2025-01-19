import { render, screen} from '@testing-library/react';
import Overview from '../src/pages/profile/Overview';
import { vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('react-firebase-hooks/auth', () => ({
  useSignOut: vi.fn(() => [vi.fn()]),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    NavLink: ({ children }) => <div>{children}</div>,
    useNavigate: vi.fn(),
  };
});

describe('Overview Component', () => {
  const mockSignOut = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockSignOut.mockResolvedValue(true); 
    mockNavigate.mockClear();
  });

  it('renders Overview component correctly', () => {
    render(
      <Router> {}
        <Overview />
      </Router>
    );

    expect(screen.getByText('Plånbok')).toBeInTheDocument();
    expect(screen.getByText('Historik')).toBeInTheDocument();
    expect(screen.getByText('Logga ut')).toBeInTheDocument();
  });
});
