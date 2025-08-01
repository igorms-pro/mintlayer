import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KilnCard } from '@/components/nft/KilnCard';

describe('KilnCard Component', () => {
  it('renders Kiln card with logo and branding', () => {
    render(<KilnCard />);

    // Check for main branding elements
    expect(screen.getByAltText('Kiln')).toBeInTheDocument();
    expect(screen.getByAltText('Verified')).toBeInTheDocument();
    expect(screen.getByText('KILN')).toBeInTheDocument();
    expect(screen.getByText('@Kiln')).toBeInTheDocument();
  });

  it('displays the company description', () => {
    render(<KilnCard />);

    expect(screen.getByText(/Hundreds of companies use Kiln/)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<KilnCard />);

    // Check for social media links (they should be present based on constants)
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(1); // At least website + social links
  });

  it('renders website link with correct structure', () => {
    render(<KilnCard />);

    // Check for the main website link
    const websiteLink = screen.getByRole('link', { name: /Website Go to/i });
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('target', '_blank');
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has proper styling classes', () => {
    render(<KilnCard />);

    const card = screen.getByText('KILN').closest('div')?.parentElement?.parentElement?.parentElement;
    expect(card).toHaveClass('bg-white', 'border', 'border-grey-secondary');
  });
}); 