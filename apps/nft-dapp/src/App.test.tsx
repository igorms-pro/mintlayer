import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app container', () => {
    render(<App />);
    
    const container = screen.getByTestId('app-container');
    expect(container).toBeInTheDocument();
  });

  it('renders the app title', () => {
    render(<App />);
    
    const title = screen.getByTestId('app-title');
    expect(title).toBeInTheDocument();
  });

  it('applies correct styling classes to container', () => {
    render(<App />);
    
    const container = screen.getByTestId('app-container');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center');
  });

  it('applies correct styling classes to title', () => {
    render(<App />);
    
    const title = screen.getByTestId('app-title');
    expect(title).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
  });
}); 