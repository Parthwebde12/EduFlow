import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileText } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No notes found"
        description="Upload your first note to get started"
      />
    );
    expect(screen.getByText('No notes found')).toBeInTheDocument();
    expect(screen.getByText('Upload your first note to get started')).toBeInTheDocument();
  });

  it('renders action button when action prop is provided', () => {
    const actionBtn = <button data-testid="action-btn">Add Note</button>;
    render(
      <EmptyState
        icon={FileText}
        title="No notes found"
        description="Upload your first note"
        action={actionBtn}
      />
    );
    expect(screen.getByTestId('action-btn')).toHaveTextContent('Add Note');
  });

  it('does not render action area when action is not provided', () => {
    const { container } = render(
      <EmptyState
        icon={FileText}
        title="No notes found"
        description="Upload your first note"
      />
    );
    // The action is rendered as a child of the container div
    // When no action is provided, there are exactly 3 children
    // (icon wrapper, h3, p) - no button should exist
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('fires action onClick handler when action button is clicked', () => {
    const onClick = vi.fn();
    const actionBtn = (
      <button data-testid="action-btn" onClick={onClick}>
        Add Note
      </button>
    );
    render(
      <EmptyState
        icon={FileText}
        title="No notes found"
        description="Upload your first note"
        action={actionBtn}
      />
    );
    fireEvent.click(screen.getByTestId('action-btn'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
