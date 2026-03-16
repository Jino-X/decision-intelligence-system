import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const { useSession } = jest.requireMock('next-auth/react') as {
  useSession: jest.Mock;
};

describe('Navbar', () => {
  it('renders brand logo', () => {
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Navbar />);
    expect(screen.getByText('OS')).toBeInTheDocument();
  });

  it('shows Sign in and Get Started when unauthenticated', () => {
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Navbar />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('shows user name when authenticated', () => {
    useSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Alice', email: 'alice@example.com', image: null },
        expires: '2099-01-01',
      },
      status: 'authenticated',
    });
    render(<Navbar />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows nav links when authenticated', () => {
    useSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Alice', email: 'alice@example.com', image: null },
        expires: '2099-01-01',
      },
      status: 'authenticated',
    });
    render(<Navbar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });
});
