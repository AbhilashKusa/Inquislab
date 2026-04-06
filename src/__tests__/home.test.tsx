import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the lab name', () => {
    render(<HomePage />);
    expect(screen.getByText('InquisLabs Research')).toBeInTheDocument();
  });

  it('renders the core question', () => {
    render(<HomePage />);
    expect(screen.getByText('What does curiosity do to humanity?')).toBeInTheDocument();
  });

  it('renders the response line', () => {
    render(<HomePage />);
    expect(screen.getByText('It builds, questions, and redefines what’s possible.')).toBeInTheDocument();
  });

  it('renders the philosophy', () => {
    render(<HomePage />);
    expect(screen.getByText(/A relentless search for what/i)).toBeInTheDocument();
    expect(screen.getByText('matters')).toBeInTheDocument();
  });
});
