import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../pages/DashboardPage';

// Mock the API module — vi.hoisted for hoist-safe variables
const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock('../services/api', () => ({
  default: mockApi,
}));

// Mock the AuthContext
const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock('../context/Authcontext', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockDashboardData = {
  data: {
    stats: {
      totalNotes: 12,
      totalResources: 8,
      completedTasks: 15,
      totalTasks: 20,
      pendingTasks: 5,
      taskCompletionRate: 75,
      tasksByStatus: { todo: 2, inProgress: 3, done: 15 },
    },
    recentActivity: {
      notes: [
        { _id: 'n1', title: 'Math Notes', subject: 'Mathematics', createdAt: '2026-06-15T10:00:00Z' },
        { _id: 'n2', title: 'Physics Notes', subject: 'Physics', createdAt: '2026-06-14T10:00:00Z' },
      ],
      upcomingTasks: [
        {
          _id: 't1',
          title: 'Submit Assignment',
          priority: 'high',
          dueDate: '2026-07-05T10:00:00Z',
        },
      ],
    },
  },
};

const emptyDashboardData = {
  data: {
    stats: {
      totalNotes: 0,
      totalResources: 0,
      completedTasks: 0,
      totalTasks: 0,
      pendingTasks: 0,
      taskCompletionRate: 0,
      tasksByStatus: { todo: 0, inProgress: 0, done: 0 },
    },
    recentActivity: {
      notes: [],
      upcomingTasks: [],
    },
  },
};

function renderDashboard() {
  return render(<DashboardPage />);
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    });
  });

  it('shows loading spinner on initial render', () => {
    mockApi.get.mockReturnValue(new Promise(() => {}));
    const { container } = renderDashboard();
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders stat cards with correct values after data loads', async () => {
    mockApi.get.mockResolvedValueOnce(mockDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument();
    });
    expect(screen.getByText('Total Notes')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('15/20')).toBeInTheDocument();
    expect(screen.getByText('Tasks Done')).toBeInTheDocument();
    // 75% appears twice (in greeting section + stat card), use getAllByText
    const completionRates = screen.getAllByText('75%');
    expect(completionRates.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('shows greeting with user first name', async () => {
    mockApi.get.mockResolvedValueOnce(mockDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/, Test!/)).toBeInTheDocument();
    });
  });

  it('shows pending tasks message when there are pending tasks', async () => {
    mockApi.get.mockResolvedValueOnce(mockDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/You have 5 pending tasks/)).toBeInTheDocument();
    });
  });

  it('shows task completion rate bar when rate > 0', async () => {
    mockApi.get.mockResolvedValueOnce(mockDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Task completion rate')).toBeInTheDocument();
    });
    // 75 appears in both the rate text and the StatCard value
    const all75Pct = screen.getAllByText('75%');
    expect(all75Pct.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "No notes yet" when notes array is empty', async () => {
    mockApi.get.mockResolvedValueOnce(emptyDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No notes yet. Upload your first note!')).toBeInTheDocument();
    });
  });

  it('shows "No upcoming tasks this week!" when tasks array is empty', async () => {
    mockApi.get.mockResolvedValueOnce(emptyDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No upcoming tasks this week!')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully without crashing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockApi.get.mockRejectedValueOnce(new Error('Network error'));
    renderDashboard();

    await waitFor(() => {
      // Should render default zeros instead of crashing
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });

    // All stat cards should show zeroed values without crashing
    expect(screen.getByText('Total Notes')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Tasks Done')).toBeInTheDocument();
    // Check that the greeting (which depends on user, not API) still renders
    expect(screen.getByText(/, Test!/)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('renders recent notes and upcoming tasks sections after data loads', async () => {
    mockApi.get.mockResolvedValueOnce(mockDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Recent Notes')).toBeInTheDocument();
    });
    expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();
    expect(screen.getByText('Math Notes')).toBeInTheDocument();
    expect(screen.getByText('Physics Notes')).toBeInTheDocument();
    expect(screen.getByText('Submit Assignment')).toBeInTheDocument();
  });

  it('shows task overview section when tasks exist', async () => {
    mockApi.get.mockResolvedValueOnce(mockDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Task Overview')).toBeInTheDocument();
    });
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('hides task overview section when totalTasks is 0', async () => {
    mockApi.get.mockResolvedValueOnce(emptyDashboardData);
    renderDashboard();

    await waitFor(() => {
      expect(screen.queryByText('Task Overview')).not.toBeInTheDocument();
    });
  });
});
