import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DecisionForm } from '@/components/dashboard/DecisionForm';

const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

describe('DecisionForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all three decision type tabs', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByText('Job Switch')).toBeInTheDocument();
    expect(screen.getByText('Relocation')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders the title input', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText('Decision Title')).toBeInTheDocument();
  });

  it('renders the context textarea', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText('Describe Your Situation')).toBeInTheDocument();
  });

  it('shows salary fields for Job Switch tab by default', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText('Current Salary ($/yr)')).toBeInTheDocument();
    expect(screen.getByLabelText('New Salary ($/yr)')).toBeInTheDocument();
  });

  it('shows location fields when Relocation tab is clicked', async () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    await userEvent.click(screen.getByText('Relocation'));
    await waitFor(() => {
      expect(screen.getByLabelText('Current City')).toBeInTheDocument();
      expect(screen.getByLabelText('Target City')).toBeInTheDocument();
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={true} />);
    expect(screen.getByText('Analyzing with AI...')).toBeInTheDocument();
  });

  it('disables submit button while loading', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={true} />);
    const button = screen.getByRole('button', { name: /analyzing/i });
    expect(button).toBeDisabled();
  });

  it('shows validation error when title is too short', async () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    const titleInput = screen.getByLabelText('Decision Title');
    await userEvent.type(titleInput, 'Hi');
    fireEvent.click(screen.getByText('Analyze My Decision'));
    await waitFor(() => {
      expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
    });
  });

  it('renders priority toggle buttons', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByText('Career growth')).toBeInTheDocument();
    expect(screen.getByText('Work-life balance')).toBeInTheDocument();
  });

  it('renders lifestyle factor buttons', () => {
    render(<DecisionForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByText('Remote work')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
  });
});
