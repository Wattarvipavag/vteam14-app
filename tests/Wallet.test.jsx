import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Wallet from '../src/pages/profile/Wallet';
import axios from 'axios';
import { vi } from 'vitest';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('axios');
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

describe('Wallet Component', () => {
  const mockUser = {
    _id: '1',
    uid: 'test-uid',
    balance: 100,
  };

  const mockGithubUser = {
    uid: 'test-uid',
    accessToken: 'test-access-token',
  };

  beforeEach(() => {
    useAuthState.mockReturnValue([mockGithubUser]);

    axios.get.mockClear();
    axios.post.mockClear();

    axios.get.mockResolvedValue({
      data: { user: mockUser },
    });
    
    axios.post.mockResolvedValue({});
  });

  it('updates the balance when money is added', async () => {
    render(
      <Router> {}
        <Wallet />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const input = screen.getByPlaceholderText('Ange summa');
    const button = screen.getByText('Lägg till pengar');

    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(button);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    const balanceElement = screen.getByText('150');
    const currencyElement = screen.getByText('kr');

    expect(balanceElement).toBeInTheDocument();
    expect(currencyElement).toBeInTheDocument();
  });

  it('does not update balance if no money is entered', async () => {
    render(
      <Router> {}
        <Wallet />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const input = screen.getByPlaceholderText('Ange summa');
    const button = screen.getByText('Lägg till pengar');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(0));

    const balanceElement = screen.getByText('100');
    const currencyElement = screen.getByText('kr');

    expect(balanceElement).toBeInTheDocument();
    expect(currencyElement).toBeInTheDocument();
  });

  it('renders loading state when user data is being fetched', async () => {

    axios.get.mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve({ data: { user: mockUser } }), 500)));

    render(
      <Router> {}
        <Wallet />
      </Router>
    );

    expect(screen.queryByText('100kr')).not.toBeInTheDocument();

    const balanceElement = await screen.findByText('100');
    const currencyElement = await screen.findByText('kr');
    
    expect(balanceElement).toBeInTheDocument();
    expect(currencyElement).toBeInTheDocument();
  });
});
