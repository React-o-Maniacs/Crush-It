import Input from "@/components/Input";
import EmailIcon from '../public/images/sms.svg';
import LockIcon from '../public/images/lock.svg';
import Image from "next/image";
import CrushItLogo from '../public/images/crush-it-logo.svg';
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 h-screen max-w-[65%] rounded-r-[10px] bg-crush-it-black bg-cover items-center z-0">
        <div className='flex flex-1 flex-col items-center'>
          <h1 className="flex font-normal text-[90px] text-white ">Crush It</h1>
          <Image src={CrushItLogo} alt='Crush It Logo' width={600} height={600}/>
        </div>
        <div className="flex h-[80%] w-[60%] z-2 mr-[-50%] shadow-2xl">
          <div className="flex bg-white rounded-[10px] flex-1 flex-col p-[10%] space-y-[5%]">
            <h1 className="flex font-bold text-[60px] text-crush-it-black">Sign Up</h1>
            <Input
              inputFieldClassName="flex-1"
              image={EmailIcon}
              alt="Email Icon"
              label="Email/username"
              onChange={(ev: any) => setEmail(ev.target.value)}
              id="email"
              type="email"
              value={email}
            />
            <Input
              inputFieldClassName="flex-1"
              image={LockIcon}
              alt="Lock Icon"
              label="Password"
              onChange={(ev: any) => setPassword(ev.target.value)}
              id="password"
              type="password"
              value={password}
            />
            <Input
              inputFieldClassName="flex-1"
              image={LockIcon}
              alt="Lock Icon"
              label="Confirm Password"
              onChange={(ev: any) => setConfirmPassword(ev.target.value)}
              id="confirmPassword"
              type="password"
              value={confirmPassword}
            />
            <div className="flex justify-center">
              <button className="h-[60px] w-[270px] bg-gradient-to-b from-crush-it-blue to-crush-it-blue-g hover:from-sky-500 hover:to-blue-600 text-white text-[18px] font-bold py-2 px-4 rounded-[16px] ">Sign Up</button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default Auth;
