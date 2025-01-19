import { render, screen } from '@testing-library/react';
import ProfileHeader from '../src/components/ProfileHeader';
import { vi } from 'vitest';
import { useAuthState } from 'react-firebase-hooks/auth';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

describe('ProfileHeader Component', () => {
  it('renders user profile image and display name', () => {
    const mockUser = {
      displayName: 'John Doe',
      photoURL: 'https://example.com/photo.jpg',
    };
    useAuthState.mockReturnValue([mockUser]);

    render(<ProfileHeader />);

    const profileImage = screen.getByRole('img');
    expect(profileImage).toHaveAttribute('src', mockUser.photoURL);

    const displayName = screen.getByText(mockUser.displayName);
    expect(displayName).toBeInTheDocument();
  });
});
