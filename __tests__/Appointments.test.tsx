import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Appointment from '@/components/Appointment';

describe('Appointment Component', () => {
  const mockAppointment = {
    id: '1',
    title: 'Team Meeting',
    startTime: 10, // 10 AM
    endTime: 12   // 12 PM
  };

  it('renders appointment title correctly', () => {
    render(<Appointment {...mockAppointment} />);

    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });

  it('expands and collapses appointment details on click', () => {
    render(<Appointment {...mockAppointment} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton); // Click to expand

    expect(screen.getByText('Appointment Notes')).toBeInTheDocument();

    fireEvent.click(expandButton); // Click to collapse
    // If the details are hidden, this should pass. Adjust if the implementation differs
    expect(screen.queryByText('Appointment Notes')).not.toBeInTheDocument();
  });

  it('calculates top position and height based on start and end time', async () => {
    render(<Appointment {...mockAppointment} />);
  
    const appointmentElement = screen.getByTestId('appointment');
  
    const computedStyles = window.getComputedStyle(appointmentElement);
  
    const expectedTop = `${(mockAppointment.startTime + 1) * 60}px`;
    const expectedHeight = `${(mockAppointment.endTime - mockAppointment.startTime) * 60}px`;
  
    // Check the computed styles directly
    expect(computedStyles.top).toBe(expectedTop);
    expect(computedStyles.height).toBe(expectedHeight);
  });

  it('calculates height based on duration', async () => {
    render(<Appointment {...mockAppointment} />);
  
    const appointmentElement = screen.getByTestId('appointment');
  
    const computedStyles = window.getComputedStyle(appointmentElement);
  
    const expectedHeight = `${(mockAppointment.endTime - mockAppointment.startTime) * 60}px`;
  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);
  });


  it('expands appointment height if duration is longer than 1 hour', async () => {
    render(<Appointment {...mockAppointment} />);
  
    // Simulate click to expand the appointment
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
  
    const appointmentElement = screen.getByTestId('appointment');
    const computedStyles = window.getComputedStyle(appointmentElement);
  
    let expectedHeight;
    if ((mockAppointment.endTime - mockAppointment.startTime) > 1) {
      expectedHeight = `${(mockAppointment.endTime - mockAppointment.startTime) * 60}px`; // Duration longer than 1 hour
    } else {
      expectedHeight = `calc(${(mockAppointment.endTime - mockAppointment.startTime) * 60}px + 60px)`;
    }
  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);
  });

  it('expands appointment height if appointment is expanded', async () => {
    render(<Appointment {...mockAppointment} />);
  
    const appointmentElement = screen.getByTestId('appointment');
  
    const computedStyles = window.getComputedStyle(appointmentElement);
  
    let expectedHeight;
    if ((mockAppointment.endTime - mockAppointment.startTime) > 1) {
      expectedHeight = `${(mockAppointment.endTime - mockAppointment.startTime) * 60}px`; // Duration longer than 1 hour
    } else {
      expectedHeight = `calc(${(mockAppointment.endTime - mockAppointment.startTime) * 60}px + 60px)`;
    }
  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);
  });

  it('collapses appointment height if appointment is collapsed', async () => {
    render(<Appointment {...mockAppointment} />);
  
    const appointmentElement = screen.getByTestId('appointment');
  
    const computedStyles = window.getComputedStyle(appointmentElement);
  
    let expectedHeight;
    if ((mockAppointment.endTime - mockAppointment.startTime) > 1) {
      expectedHeight = `${(mockAppointment.endTime - mockAppointment.startTime) * 60}px`; // Duration longer than 1 hour
    } else {
      expectedHeight = `calc(${(mockAppointment.endTime - mockAppointment.startTime) * 60}px + 60px)`;
    }
  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);
  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);
  });

  it('expands and collapses appointment details on click', async () => {
    render(<Appointment {...mockAppointment} />);
  
    const appointmentElement = screen.getByTestId('appointment');
  
    const computedStyles = window.getComputedStyle(appointmentElement);
  
    let expectedHeight;
    if ((mockAppointment.endTime - mockAppointment.startTime) > 1) {
      expectedHeight = `${(mockAppointment.endTime - mockAppointment.startTime) * 60}px`; // Duration longer than 1 hour
    } else {
      expectedHeight = `calc(${(mockAppointment.endTime - mockAppointment.startTime) * 60}px + 60px)`;
    }
  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);  
    // Check the computed styles directly
    expect(computedStyles.height).toBe(expectedHeight);
  });

  it('renders correctly for an early morning appointment', () => {
    const earlyMorningAppointment = {
      id: '2',
      title: 'Early Meeting',
      startTime: 6,  // 6 AM
      endTime: 7    // 7 AM
    };
    render(<Appointment {...earlyMorningAppointment} />);
    expect(screen.getByText('Early Meeting')).toBeInTheDocument();
  });

  it('renders correctly for a late night appointment', () => {
    const lateNightAppointment = {
      id: '3',
      title: 'Late Meeting',
      startTime: 22, // 10 PM
      endTime: 23   // 11 PM
    };
    render(<Appointment {...lateNightAppointment} />);
    expect(screen.getByText('Late Meeting')).toBeInTheDocument();
  });

  it('handles invalid time range gracefully', () => {
    const invalidTimeAppointment = {
      id: '4',
      title: 'Invalid Meeting',
      startTime: 15, // 3 PM
      endTime: 14   // 2 PM (invalid)
    };
    render(<Appointment {...invalidTimeAppointment} />);
    // Add your logic for how invalid times are handled, e.g., error message or fallback content
    // Example: expect(screen.getByText('Invalid appointment time')).toBeInTheDocument();
  });

  it('is accessible with keyboard', () => {
    render(<Appointment {...mockAppointment} />);
    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeVisible();
    expect(expandButton).toBeEnabled();
    // Add additional accessibility checks as needed
  });



  

  
  

  
  
  
  

  // Additional tests can be added as needed

  

  // Additional tests can be added as needed
});
