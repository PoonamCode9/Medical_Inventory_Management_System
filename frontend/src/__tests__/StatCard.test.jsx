import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/StatCard';
import { Package } from 'lucide-react';
import { describe, it, expect } from 'vitest';

describe('StatCard Component', () => {
  it('renders value, label, and sublabel correctly', () => {
    render(
      <StatCard 
        icon={Package} 
        value={150} 
        label="Total Items" 
        sublabel="In stock" 
        color="sky" 
      />
    );

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('renders loading skeleton when value is null', () => {
    render(
      <StatCard 
        icon={Package} 
        value={null} 
        label="Total Items" 
        sublabel="In stock" 
        color="sky" 
      />
    );

    // Should render skeleton (pulsing block) and not the label text directly if it's hidden
    // The component structure might keep the label but hide the value
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
