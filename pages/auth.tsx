import Input from "@/components/Input";
import EmailIcon from '../public/images/sms.svg';
import ProfileIcon from '../public/images/profile.svg';
import LockIcon from '../public/images/lock.svg';
import Image from "next/image";
import CrushItLogo from '../public/images/crush-it-logo.svg';
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [variant, setVariant] = useState('register');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/'
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        email,
        userName,
        password
      });

      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, userName, password, login]);

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
              image={ProfileIcon}
              alt="Profile Icon"
              label="Username"
              onChange={(ev: any) => setUserName(ev.target.value)}
              id="name"
              value={userName}
            />
            <Input
              inputFieldClassName="flex-1"
              image={EmailIcon}
              alt="Email Icon"
              label="Email Address"
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
              <button onClick={variant === 'login' ? login : register}
                className="h-[60px] w-[270px] bg-gradient-to-b from-crush-it-blue to-crush-it-blue-g
                 hover:from-sky-500 hover:to-blue-600 text-white text-[18px] font-bold py-2 px-4 
                rounded-[16px] ">Sign Up</button>
            </div>
            {/* href="#" redirects to the current page, localhost:3000/auth
                change this to redirect to the login page when the page is created */}
            <div className="flex justify-center">
              <p className="h-[21px] w-[291px] text-crush-it-black">
                Already have an account? <a href="#" className="underline text-crush-it-blue hover:to-blue-600">Sign in Here!</a>
              </p>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default Auth;
