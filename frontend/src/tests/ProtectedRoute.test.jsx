import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../components/layout/ProtectedRoute';

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock('../context/Authcontext', () => ({
  useAuth: () => mockUseAuth(),
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/protected"
            element={<div data-testid="protected-content">Protected Content</div>}
          />
        </Route>
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('renders Outlet when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1', name: 'Test' }, loading: false });
    renderProtectedRoute();
    expect(screen.getByTestId('protected-content')).toHaveTextContent('Protected Content');
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is null and loading is false', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderProtectedRoute();
    expect(screen.getByTestId('login-page')).toHaveTextContent('Login Page');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('shows LoadingSpinner while loading is true', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    const { container } = renderProtectedRoute();
    // LoadingSpinner renders a div with animate-spin class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
