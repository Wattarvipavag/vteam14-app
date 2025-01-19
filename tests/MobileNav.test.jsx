import { render, screen } from '@testing-library/react';
import MobileNav from '../src/components/MobileNav';
import { BrowserRouter as Router } from 'react-router-dom';

describe('MobileNav Component', () => {
  it('navigates to the correct routes when clicked', () => {
    render(
      <Router>
        <MobileNav />
      </Router>
    );

    const mapLink = screen.getByText('Karta');
    expect(mapLink.closest('a')).toHaveAttribute('href', '/');

    const scanLink = screen.getByText('Skanna');
    expect(scanLink.closest('a')).toHaveAttribute('href', '/scan');

    const profileLink = screen.getByText('Profil');
    expect(profileLink.closest('a')).toHaveAttribute('href', '/profile');
  });
});
