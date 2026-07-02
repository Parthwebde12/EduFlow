import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/Authcontext';

// Mock the api module — vi.hoisted ensures the variable is available at mock time
const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));
vi.mock('../services/api', () => ({
  default: mockApi,
}));

// Helper component to test context values
function TestConsumer() {
  const { user, loading, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading.toString()}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : 'null'}</span>
      <button data-testid="btn-login" onClick={() => login('test@example.com', 'Password123')}>
        Login
      </button>
      <button data-testid="btn-register" onClick={() => register('Test', 'test@example.com', 'Password123', 'College')}>
        Register
      </button>
      <button data-testid="btn-logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('starts with user=null and transitions loading to false when no token exists', async () => {
    renderWithProvider();
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('login() stores token in localStorage and sets user state', async () => {
    const userData = { id: '1', name: 'Test User', email: 'test@example.com' };
    mockApi.post.mockResolvedValueOnce({
      data: { token: 'test-token-123', user: userData },
    });
    // The login sets token which triggers fetchUser -> api.get('/auth/me')
    mockApi.get.mockResolvedValueOnce({
      data: { user: userData },
    });

    renderWithProvider();

    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    await userEvent.click(screen.getByTestId('btn-login'));

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual(userData);
    });
    expect(localStorage.getItem('Eduflow_token')).toBe('test-token-123');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'Password123',
    });
  });

  it('register() stores token in localStorage and sets user state', async () => {
    const userData = { id: '2', name: 'Test', email: 'test@example.com' };
    mockApi.post.mockResolvedValueOnce({
      data: { token: 'reg-token-456', user: userData },
    });
    // The register sets token which triggers fetchUser -> api.get('/auth/me')
    mockApi.get.mockResolvedValueOnce({
      data: { user: userData },
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    await userEvent.click(screen.getByTestId('btn-register'));

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual(userData);
    });
    expect(localStorage.getItem('Eduflow_token')).toBe('reg-token-456');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Test',
      email: 'test@example.com',
      password: 'Password123',
      college: 'College',
    });
  });

  it('logout() clears localStorage and sets user to null', async () => {
    const userData = { id: '1', name: 'Test User', email: 'test@example.com' };
    mockApi.post.mockResolvedValueOnce({
      data: { token: 'test-token-123', user: userData },
    });
    mockApi.get.mockResolvedValueOnce({
      data: { user: userData },
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Login first
    await userEvent.click(screen.getByTestId('btn-login'));
    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual(userData);
    });

    // Logout
    await userEvent.click(screen.getByTestId('btn-logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(localStorage.getItem('Eduflow_token')).toBeNull();
  });

  it('401 API response clears auth state and removes token', async () => {
    localStorage.setItem('Eduflow_token', 'expired-token');
    mockApi.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    renderWithProvider();

    await waitFor(() => {
      expect(localStorage.getItem('Eduflow_token')).toBeNull();
    });
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within AuthProvider'
    );
    consoleSpy.mockRestore();
  });
});
