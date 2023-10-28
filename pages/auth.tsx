import Input from "@/components/Input";
import EmailIcon from '../public/sms.svg';
import LockIcon from '../public/lock.svg';
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 h-screen max-w-[65%] rounded-r-[10px] bg-crush-it-black bg-cover items-center z-0">
        <div className='flex flex-1 flex-col items-center'>

        </div>
        <div className="flex h-[80%] w-[60%] z-2 mr-[-50%]">
          <div className="flex bg-white rounded-[10px] flex-1 flex-col p-[10%] space-y-[5%]">
            
          </div>
        </div>
      </div> 
    </div>
  );
}

export default Auth;
