import Input from "@/components/Input";
import EmailIcon from '../public/images/sms.svg';
import LockIcon from '../public/images/lock.svg';
import Image from "next/image";
import CrushItLogo from '../public/images/crush-it-logo.svg';
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [variant, setVariant] = useState('login');

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
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Failed to login!');
    }
  }, [email, password]);
  
  const validateRegister = useCallback(async () => {
    var problems = 0;
    if (!email || !password || !confirmPassword) {
      toast.error('Please enter missing fields.')
      problems = problems + 1;
    }
    if (password.length < 12) {
      toast.error('Password should be at least 12 characters long.');
      problems = problems + 1;
    }
    if (password != confirmPassword) {
      toast.error('Both password fields should match.');
      problems = problems + 1;
    }
    const conditions = [
      /[A-Z]/.test(password), // Uppercase letter
      /[a-z]/.test(password), // Lowercase letter
      /[0-9]/.test(password), // Number
      /[^A-Za-z0-9]/.test(password) // Special character (no spaces)
    ];
    const trueConditions = conditions.filter(Boolean).length;
    if (trueConditions < 2) {
      toast.error('Password should meet at least two of the following: include an uppercase letter, a lowercase letter, a number, or a special character (no spaces).');
      problems = problems + 1;
    }
    if (problems > 0) {
      return false;
    }
    else {
      return true;
    }
  }, [email, password, confirmPassword]);

  const register = useCallback(async () => {
    try {
      const noErrors = await validateRegister(email, password, confirmPassword);
      if (!noErrors) {
        return;
        // Currently, I'm not viewing for email validation since the user can choose to not submit an email for username
      }

      await axios.post('/api/register', {
        email,
        password,
        confirmPassword
      });

      toast.success('Successfully registered!');
      login();
    } catch (error) {
      toast.error('Failed to register!');
      console.log(error);
    }
  }, [email, password, confirmPassword, login]);

  return (
    <>
      <Toaster position="top-right" />
        <div className="flex">
        <div className="flex flex-1 h-screen max-w-[65%] rounded-r-[10px] bg-crush-it-black bg-cover items-center z-0">
          <div className='flex flex-1 flex-col items-center'>
            <h1 className="flex font-Fredoka font-bold text-[60px] text-white ">Crush It</h1>
            <Image src={CrushItLogo} alt='Crush It Logo' width={600} height={600}/>
          </div>
          <div className="flex h-[80%] w-[60%] z-2 mr-[-50%] shadow-2xl">
            <div className="flex bg-white rounded-[10px] flex-1 flex-col p-[10%] space-y-[5%]">
              <h1 className="flex font-bold text-[30px] text-crush-it-black">{variant === 'login' ? 'Sign In' : 'Sign Up'}</h1>
              <Input
                inputFieldClassName="flex-1 text-[16px] font-[500]"
                labelClassName="text-[14px]"
                image={EmailIcon}
                alt="Email Icon"
                label="Email/username"
                onChange={(ev: any) => setEmail(ev.target.value)}
                id="email"
                type="email"
                value={email}
              />
              <Input
                inputFieldClassName="flex-1 text-[16px] font-[500]"
                labelClassName="text-[14px]"
                image={LockIcon}
                alt="Lock Icon"
                label="Password"
                onChange={(ev: any) => setPassword(ev.target.value)}
                id="password"
                type="password"
                value={password}
              />
              {variant === 'register' && (<Input
                inputFieldClassName="flex-1 text-[16px] font-[500]"
                labelClassName="text-[14px]"
                image={LockIcon}
                alt="Lock Icon"
                label="Confirm Password"
                onChange={(ev: any) => setConfirmPassword(ev.target.value)}
                id="confirmPassword"
                type="password"
                value={confirmPassword}
              />
              )}
              <div className="flex justify-center">
                <button onClick={variant === 'login' ? login : register}
                  className="h-[60px] w-[270px] bg-gradient-to-b from-crush-it-blue to-crush-it-blue-g
                  hover:from-sky-500 hover:to-blue-600 text-white text-[18px] font-bold py-2 px-4 
                  rounded-[16px] ">{variant === 'login' ? 'Sign In' : 'Sign Up'}</button>
              </div>
              <div className="flex bg-crush-it-grey rounded-[16px] p-5 justify-center items-end">
                <p>
                  {variant === 'login' ? 'First time using Crush It? ' : 'Already have an account? '}
                  <span className='text-crush-it-blue hover:underline cursor-pointer' onClick={toggleVariant}>
                  {variant === 'login' ? 'Create an account' : 'Sign in Here!'}
                  </span> 
                </p>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </>
  );
}

export default Auth;
