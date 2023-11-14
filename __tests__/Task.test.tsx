import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '@/pages/index';
import Task from '@/components/Task';
import { TaskPriority, TaskStatus } from '@/components/Task';

jest.mock('next/router', () => require('next-router-mock'));


describe('Profile Page UI', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', priority: 'Top Priority' as TaskPriority, notes: 'Note 1', date: `${new Date().toLocaleDateString()}`, status: 'Not Started' as TaskStatus },
    { id: '2', title: 'Task 2', priority: 'Important' as TaskPriority, notes: 'Note 2', date: `${new Date().toLocaleDateString()}`, status: 'In Progress' as TaskStatus },
    // ... other tasks
  ];
  

  beforeEach(() => {
    // Setup global fetch mock
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTasks)
    });
  });

  it('Should have Tasks section title UI elements', async () => {
    render(<Index />);

    await waitFor(() => {
      const tasksTitle = screen.getByText('Tasks');
      const topPriority = screen.getByText('Top Priority');
      const important = screen.getByText('Important');
      const other = screen.getByText('Other');

      expect(tasksTitle).toBeInTheDocument();
      expect(topPriority).toBeInTheDocument();
      expect(important).toBeInTheDocument();
      expect(other).toBeInTheDocument();
    });
  });

  it('renders tasks and filters them by priority', async () => {
    render(<Index />);
    await waitFor(() => {
      const task1 = screen.getByText('Task 1');
      const task2 = screen.getByText('Task 2');

      expect(task1).toBeInTheDocument();
      expect(task2).toBeInTheDocument();

      // Verify tasks are sorted under the right priority
      for (const task of mockTasks) {
        expect(screen.getByText(task.title)).toBeInTheDocument();
        const taskElement = screen.getByText(task.title);
        const priorityHeading = taskElement.closest('.bg-crush-it-grey')?.querySelector('.text-xl');
        expect(priorityHeading).toHaveTextContent(task.priority);
      }
    });
  });

  describe('Task Component UI', () => {

    it('expands and collapses task details', async () => {
      render(<Task task={mockTasks[0]} />);

      const expandButton = screen.getByAltText('Expand');
      fireEvent.click(expandButton);

      expect(screen.getByText('Note 1')).toBeVisible();

      fireEvent.click(expandButton);
      // Assertions for collapsing the details can be added here
    });
  });

it('should update task status when button is clicked', async () => {
    // Mock Fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }) as any
    );

    // Render the component
    render(<Task task={mockTasks[0]} />);

    // Find the status button by alt text
    const statusButton = screen.getByAltText('Task Status');
    // Click the status button
    fireEvent.click(statusButton);

    // Wait for the status update
    await waitFor(() => {
      // Assert that fetch was called
      expect(global.fetch).toHaveBeenCalledTimes(1);
      // Assert that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/updateTaskStatus', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: mockTasks[0].id,
          newStatus: 'In Progress',
        }),
      });

    });

    // Restore original fetch implementation 
    jest.restoreAllMocks();
  });

  // Additional tests for other functionalities can be added here
});
