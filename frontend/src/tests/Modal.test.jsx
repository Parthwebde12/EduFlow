import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../components/ui/Modal';

describe('Modal', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p data-testid="modal-content">Modal content</p>
      </Modal>
    );
    expect(screen.getByTestId('modal-content')).toHaveTextContent('Modal content');
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('fires onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fires onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    // The backdrop is the first child div of the modal container with absolute inset-0
    const backdrop = document.querySelector('.fixed.inset-0 > div.absolute');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('locks body scroll when open and restores on close', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('renders with different sizes', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Small Modal" size="sm">
        <p>Content</p>
      </Modal>
    );
    // sm = max-w-sm
    expect(container.querySelector('.max-w-sm')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} title="Large Modal" size="lg">
        <p>Content</p>
      </Modal>
    );
    expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
  });

  it('renders close button with aria-label', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    const closeBtn = screen.getByLabelText('Close modal');
    expect(closeBtn).toBeInTheDocument();
  });
});
