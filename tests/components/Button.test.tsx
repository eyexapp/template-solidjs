import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import Button from '../../src/components/ui/Button';

describe('Button', () => {
  it('renders with text content', () => {
    render(() => <Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies the solid variant by default', () => {
    render(() => <Button>Solid</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-primary-600');
  });

  it('applies the outline variant classes', () => {
    render(() => <Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('border');
    expect(btn.className).toContain('text-primary-600');
  });

  it('fires onClick handler', () => {
    const handler = vi.fn();
    render(() => <Button onClick={handler}>Press</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('respects the disabled attribute', () => {
    render(() => <Button disabled>Nope</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
