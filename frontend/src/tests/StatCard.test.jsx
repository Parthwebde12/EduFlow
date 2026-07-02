import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileText } from 'lucide-react';
import StatCard from '../components/ui/Statcard';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Total Notes"
        value="10"
        icon={FileText}
        color="blue"
      />
    );
    expect(screen.getByText('Total Notes')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders optional subtitle when provided', () => {
    render(
      <StatCard
        title="Tasks Done"
        value="5/10"
        icon={FileText}
        color="green"
        subtitle="5 remaining"
      />
    );
    expect(screen.getByText('5 remaining')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(
      <StatCard
        title="Total Notes"
        value="10"
        icon={FileText}
        color="blue"
      />
    );
    // The subtitle is rendered in a <p> with text-xs and text-slate-400
    const subtitleElements = container.querySelectorAll('.text-xs.text-slate-400');
    // The card has no subtitle paragraph when subtitle prop is absent
    expect(subtitleElements.length).toBe(0);
  });

  it('applies correct background color class', () => {
    const { container } = render(
      <StatCard
        title="Total Notes"
        value="10"
        icon={FileText}
        color="blue"
      />
    );
    // The icon wrapper should have bg-blue-50
    const iconWrapper = container.querySelector('.bg-blue-50');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('renders with different color variants', () => {
    const { container, rerender } = render(
      <StatCard
        title="Resources"
        value="5"
        icon={FileText}
        color="purple"
      />
    );
    expect(container.querySelector('.bg-purple-50')).toBeInTheDocument();

    rerender(
      <StatCard
        title="Completion"
        value="80%"
        icon={FileText}
        color="orange"
      />
    );
    expect(container.querySelector('.bg-orange-50')).toBeInTheDocument();
  });

  it('falls back to blue when no color is provided', () => {
    const { container } = render(
      <StatCard
        title="Notes"
        value="3"
        icon={FileText}
      />
    );
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
  });
});
