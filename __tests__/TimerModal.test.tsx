import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimerModal from '../components/TimerModal';

describe('TimerModal', () => {
  const onCloseMock = jest.fn();

  const task = {
    id: 1,
    title: 'Sample Task',
    description: 'This is a sample task',
  };

  const user = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  it('renders the modal when isVisible is true', () => {
    render(
      <TimerModal isVisible={true} onClose={onCloseMock} task={task} user={user} />
    );

    expect(screen.getByRole('navigation', {name: ''})).toBeInTheDocument();
  });

  it('does not render the modal when isVisible is false', () => {
    render(
      <TimerModal isVisible={false} onClose={onCloseMock} task={task} user={user} />
    );

    expect(screen.queryByTestId('timer-modal')).not.toBeInTheDocument();
  });

  it('calls the onClose function when the close button is clicked', () => {
    render(
      <TimerModal isVisible={true} onClose={onCloseMock} task={task} user={user} />
    );

    const closeButton = screen.getByRole('button', {name: 'Close Icon'})
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
