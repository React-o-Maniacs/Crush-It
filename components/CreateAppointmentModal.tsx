import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';


interface CreateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialDate: string;
  onAppointmentAdded?: () => Promise<void>; // Optional callback prop

}

const CreateAppointmentModal: React.FC<CreateTaskModalProps> = ({ isVisible, onClose, initialDate, onAppointmentAdded }) => {
  const [title, setAppointmentTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [date, setDate] = useState<string>(initialDate); // Initialize with today's date
  const [formattedDate, setFormattedDate] = useState<string>('');
  console.log(initialDate)
  const [isRecurring, setIsRecurring] = useState(false);




  useEffect(() => {
    if (initialDate) {
      setFormattedDate(formatDateForDisplay(initialDate));
      setDate(initialDate);
    }
  }, [initialDate]);


  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') onClose();
  };

const formatDateForDisplay = (date: string) => {
  const [month, day, year] = date.split('/');
  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
};

  const handleCreateAppointment = async () => {
    try {
      
      if (!title) {
        toast.error('Please put a title.')
        return;
      }
      
      if (!startTime) {
        toast.error('Please leave a start time')
        return;
      }

      if (!endTime) {
        toast.error('Please leave an end time')
        return;
      }

      if (!date) {
        toast.error('Please select a date');
        return;
      }

      const inputDate = formattedDate; // Use formattedDate here
      const [yyyy, mm, dd] = inputDate.split('-');
      const dateToSubmit = `${parseInt(mm)}/${parseInt(dd)}/${parseInt(yyyy)}`; // Format it as "mm-d-yyyy"
      console.log(dateToSubmit);
      
      
      if (startTime >= endTime) {
        toast.error('End time should be greater than start time');
        return;
      }

      const appointmentResponse = await fetch('/api/createAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          startTime,
          endTime,
          date: dateToSubmit, // Use the formatted date here
          recurring: isRecurring,
        }),
      });
  
      if (appointmentResponse.ok) {
        const data = await appointmentResponse.json();
        toast.success('Appointment created successfully');
        console.log('Appointment created successfully:', data);
        if (onAppointmentAdded){
          await onAppointmentAdded();
        }
      } else {
        toast.error('Failed to create appointment.');
        console.error('Failed to create appointment:', appointmentResponse);
      }
  
      onClose();
    } catch (error) {
      toast.error('Failed to create appointment.');
      console.error('Failed to create appointment', error);
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
            <span className='text-1 font-bold'>Create Appointment</span>
          </h2>
          <div className="my-2 flex">
            <div className="mr-4">
              <label className="font-bold mb-2">Appointment Title: </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setAppointmentTitle(e.target.value)}
                className='ml-2 outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1'
                required
              />
            </div>
            <div className="ml-16">
              <label className="font-bold mb-2">Start Time: </label>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(Math.max(1, Number(e.target.value)))}
                className='ml-2 outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1 w-16'
              />
            </div>
            <div className="ml-16">
              <label className="font-bold mb-2">End Time: </label>
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(Math.max(1, Number(e.target.value)))}
                className='ml-2 outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1 w-16'
              />
            </div>
            
          </div>
          <div className="flex justify-center">
            <div className="mb-2">
              <label className="font-bold mb-2">Date: </label>
              <input
                type="date"
                value={formattedDate}
                onChange={(e) => {
                  setFormattedDate(e.target.value);
                  const [year, month, day] = e.target.value.split('-');
                  setDate(`${month}-${day}-${year}`); // Store it in the "mm-d-yyyy" format
                }}
                className="ml-2 outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1"
                required
              />
            </div>
            <div className="my-2 ml-4">
              <label className="font-bold mb-2">Recurring Appointment: </label>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
            </div>
          </div>



          {/* <div className="my-2">
            <label className="font-bold mb-2">Notes: </label>
            <textarea
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              rows={5}
              className='outline-crush-it-blue hover:rounded-[1px] border-gray-400 border-[1px] rounded-[2px] p-2 text-1 w-full'
              required
            />
          </div> */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              className="h-[40px] w-[120px] bg-white hover:from-sky-500 hover:to-blue-600 text-crush-it-blue text-[14px] font-bold py-1 px-2 rounded-[8px] border border-crush-it-blue mr-2"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAppointment}
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

export default CreateAppointmentModal;
