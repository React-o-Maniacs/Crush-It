/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import CreateTaskModal from '@/components/CreateTaskModal';
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('Create Task Modal UI', () => {
    it('Should render Create Task header', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);

        // Assertions
        const createTaskTitle = screen.getByText('Create Task');


        expect(createTaskTitle).toBeInTheDocument();

    });

    it('Should render title input', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);

        // Assertions
        const taskTitleLabel = screen.getByText('Task Title:');

        expect(taskTitleLabel).toBeInTheDocument();

    });

    it('Should render pomodoro input', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);

        // Assertions

        const pomodoroLabel = screen.getByText('Pomodoro:');

        expect(pomodoroLabel).toBeInTheDocument();

    });

    it('Should render notes input', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);

        // Assertions

        const notesLabel = screen.getByText('Notes:');

        expect(notesLabel).toBeInTheDocument();

    });

    it('Should render priority input', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);

        // Assertions

        const priorityLabel = screen.getByText('Priority:');

        expect(priorityLabel).toBeInTheDocument();

    });

    it('Should render cancel and create buttons', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);

        // Assertions

        const cancelButton = screen.getByText('Cancel');
        const createButton = screen.getByText('Create');


        expect(cancelButton).toBeInTheDocument();
        expect(createButton).toBeInTheDocument();
    });

    it('Should close modal when clicking Cancel button', () => {
        // Arrange
        const onCloseMock = jest.fn();
        const isVisible = true;
        const date = '2023-11-11';

        // Actions
        render(<CreateTaskModal isVisible={isVisible} onClose={onCloseMock} date={date} />);
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        // Assertions
        expect(onCloseMock).toHaveBeenCalled();
    });

});