import { render, screen } from '@testing-library/react';
import CareersPage from '../app/careers/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('CareersPage', () => {
  it('renders the "CAREERS" tag', () => {
    render(<CareersPage />);
    expect(screen.getByText('CAREERS')).toBeInTheDocument();
  });

  it('renders the "Projects" heading', () => {
    render(<CareersPage />);
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<CareersPage />);
    expect(screen.getByText(/explore our current projects/i)).toBeInTheDocument();
  });

  it('renders the Industrial Automation project card', () => {
    render(<CareersPage />);
    expect(screen.getByText('Industrial Automation')).toBeInTheDocument();
  });

  it('renders project card with "PROJECT 01" label', () => {
    render(<CareersPage />);
    expect(screen.getByText('PROJECT 01')).toBeInTheDocument();
  });

  it('renders "Hiring" status on project card', () => {
    render(<CareersPage />);
    expect(screen.getByText('Hiring')).toBeInTheDocument();
  });

  it('links to industrial automation project page', () => {
    render(<CareersPage />);
    const link = screen.getByRole('link', { name: /industrial automation/i });
    expect(link).toHaveAttribute('href', '/careers/industrial-automation');
  });
});
