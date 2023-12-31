import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';


interface CreateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  date: string;
  onTaskAdded?: () => Promise<void>; // Optional callback prop

}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isVisible, onClose, date, onTaskAdded }) => {
  const [title, setTaskTitle] = useState<string>('');
  const [numOfPomodoroTimers, setPomodoro] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [priority, setPriority] = useState<string>('Important');

  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') onClose();
  };


  const handleCreateTask = async () => {
    try {
      
      if (!title) {
        toast.error('Please put a title.')
        return;
      }
      
      if (!notes) {
        toast.error('Please leave a note')
        return;
      }

      if (!priority) {
        toast.error('Please select a priority.')
        return;
      }

      const taskResponse = await fetch('/api/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          numOfPomodoroTimers,
          notes,
          priority,
          date
        }),
      });
  
      if (taskResponse.ok) {
        const data = await taskResponse.json();
        toast.success('Task created successfully');
        console.log('Task created successfully:', data);
        if (onTaskAdded){
          await onTaskAdded();
        }
      } else {
        toast.error('Failed to create task.');
        console.error('Failed to create task:', taskResponse);
      }
  
      onClose();
    } catch (error) {
      toast.error('Failed to create task.');
      console.error('Failed to create task', error);
    }
  };
  

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="w-[600px] flex flex-col">
        <div className="bg-white p-6 rounded-[5px] border-crush-it-blue border-2">
          <h2>
            <span className='text-1 font-bold'>Create Task</span>
          </h2>
          <div className="my-2 flex items-center">
            <div className="mr-4">
              <label className="font-bold mb-2">Task Title: </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTaskTitle(e.target.value)}
                className='ml-2 outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1'
                required
              />
            </div>
            <div className="ml-16">
              <label className="font-bold mb-2">Pomodoro: </label>
              <input
                type="number"
                value={numOfPomodoroTimers < 0 ? 0 : numOfPomodoroTimers}
                onChange={(e) => setPomodoro(Math.max(1, Number(e.target.value)))}
                className='ml-2 outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1 w-16'
              />
            </div>
          </div>
          <div className="my-2">
            <label className="font-bold mb-2">Notes: </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className='outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1 w-full'
              required
            />
          </div>
          <div className="my-2">
            <label className="font-bold mb-2">Priority: </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className='ml-2 border-gray-400 border-[1px] rounded-[4px] p-2'
            >
              <option value="Important">Important</option>
              <option value="Top Priority">Top Priority</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              className="h-[40px] w-[120px] bg-white hover:from-sky-500 hover:to-blue-600 text-crush-it-blue text-[14px] font-bold py-1 px-2 rounded-[8px] border border-crush-it-blue mr-2"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              className="h-[40px] w-[120px] bg-gradient-to-b from-crush-it-blue to-crush-it-blue-g hover:from-sky-500 hover:to-blue-600 text-white text-[14px] font-bold py-1 px-2 rounded-[8px]"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
