
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '@/pages/index';

jest.mock('next/router', () => require('next-router-mock'));

describe('Arrow Icon For Month/Day/Year', () => {
  it('should render the arrow icon for going back a month', () => {
    render(<Index />);

    const arrowIcon = screen.getByAltText('Arrow Icon Previous Month');

    expect(arrowIcon).toBeVisible();
  });

  it('should render the arrow icon for going forward a month', () => {
    render(<Index />);

    const arrowIcon = screen.getByAltText('Arrow Icon Next Month');

    expect(arrowIcon).toBeVisible();
  });

  it('should render the arrow icon for going back a day', () => {
    render(<Index />);

    const arrowIcon = screen.getByAltText('Arrow Icon Previous Day');

    expect(arrowIcon).toBeVisible();
  });

  it('should render the arrow icon for going forward a day', () => {
    render(<Index />);

    const arrowIcon = screen.getByAltText('Arrow Icon Next Day');

    expect(arrowIcon).toBeVisible();
  });

  it('should render the arrow icon for going back a year', () => {
    render(<Index />);

    const arrowIcon = screen.getByAltText('Arrow Icon Previous Year');

    expect(arrowIcon).toBeVisible();
  });

  it('should render the arrow icon for going forward a year', () => {
    render(<Index />);

    const arrowIcon = screen.getByAltText('Arrow Icon Next Year');

    expect(arrowIcon).toBeVisible();
  });
});