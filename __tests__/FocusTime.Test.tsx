import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FocusTime from '@/components/FocusTime';

describe('FocusTime Component', () => {
  const mockFocusTime = {
    id: '1',
    title: 'Focus Session',
    notes: 'Work on project',
    startTime: 10, // 10 AM
    endTime: 12,   // 12 PM
    numOfPomodoroTimers: 4,
    remainingNumOfPomodoros: 0,
    date: '12/19/2023'
  };

  it('renders focus time title correctly', () => {
    render(<FocusTime {...mockFocusTime} />);

    expect(screen.getByText('Focus Session')).toBeInTheDocument();
  });

  it('expands and collapses focus time details on click', () => {
    render(<FocusTime {...mockFocusTime} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton); // Click to expand

    expect(screen.getByText('Work on project')).toBeInTheDocument();

    fireEvent.click(expandButton); // Click to collapse
    // If the details are hidden, this should pass. Adjust if the implementation differs
    expect(screen.queryByText('Work on project')).not.toBeInTheDocument();
  });

  it('calculates top position and height based on start and end time', () => {
    render(<FocusTime {...mockFocusTime} />);
  
    const focusTimeElement = screen.getByTestId('focus-time');
  
    const computedStyles = window.getComputedStyle(focusTimeElement);
  
    const expectedTop = `${(mockFocusTime.startTime + 1) * 60}px`;
    const expectedHeight = `${(mockFocusTime.endTime - mockFocusTime.startTime) * 60}px`;
  
    // Check the computed styles directly
    expect(computedStyles.top).toBe(expectedTop);
    expect(computedStyles.height).toBe(expectedHeight);
  });

  it('renders correctly for an early morning focus time', () => {
    const earlyMorningFocusTime = {
      ...mockFocusTime,
      title: 'Early Focus Session',
      startTime: 6,  // 6 AM
      endTime: 7    // 7 AM
    };
    render(<FocusTime {...earlyMorningFocusTime} />);
    expect(screen.getByText('Early Focus Session')).toBeInTheDocument();
  });

  it('renders correctly for a late night focus time', () => {
    const lateNightFocusTime = {
      ...mockFocusTime,
      title: 'Late Focus Session',
      startTime: 22, // 10 PM
      endTime: 23   // 11 PM
    };
    render(<FocusTime {...lateNightFocusTime} />);
    expect(screen.getByText('Late Focus Session')).toBeInTheDocument();
  });



  it('is accessible with keyboard', () => {
    render(<FocusTime {...mockFocusTime} />);
    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeVisible();
    expect(expandButton).toBeEnabled();
    // Add additional accessibility checks as needed
  });

  // Additional tests can be added as needed
});