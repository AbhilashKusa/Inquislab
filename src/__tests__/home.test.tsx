import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the main heading "Building something new"', () => {
    render(<HomePage />);
    expect(screen.getByText(/building/i)).toBeInTheDocument();
    expect(screen.getByText(/something new/i)).toBeInTheDocument();
  });

  it('renders the "COMING SOON" status indicator', () => {
    render(<HomePage />);
    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
  });

  it('renders the green dot indicator', () => {
    render(<HomePage />);
    const dot = document.querySelector('.dot');
    expect(dot).toBeInTheDocument();
  });

  it('does not display any description text', () => {
    render(<HomePage />);
    expect(screen.queryByText(/refineries/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/chemical plants/i)).not.toBeInTheDocument();
  });
});
