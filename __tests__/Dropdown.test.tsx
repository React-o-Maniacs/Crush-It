
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from '@/components/Dropdown';

test('renders dropdown component with options', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const onChange = jest.fn();
  
    const { getByText } = render(<Dropdown options={options} onChange={onChange} selectedOption={''} />);
    
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });
  
  test('calls onChange when an option is selected', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const onChange = jest.fn();
  
    const { getByText } = render(<Dropdown options={options} onChange={onChange} selectedOption={''} />);
    
    fireEvent.click(screen.getByText('Option 2'));
  
    expect(onChange).toHaveBeenCalledWith('Option 2');
  });
