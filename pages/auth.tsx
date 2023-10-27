import Input from "@/components/Input";
import EmailIcon from '../public/sms.svg';
import LockIcon from '../public/lock.svg';
import SignUpIcon from '../public/signup.svg';
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <>
      <Input
        image={EmailIcon}
        alt="Email Icon"
        label="Email/username"
        onChange={(ev: any) => setEmail(ev.target.value)}
        id="email"
        type="email"
        value={email}
      />
      <Input
        image={LockIcon}
        alt='Lock Icon'
        label="Password"
        onChange={(ev: any) => setPassword(ev.target.value)}
        id='password'
        type='password'
        value={password}
      />
      <Input
        image={LockIcon}
        alt="Lock Icon"
        label="Confirm Password"
        onChange={(ev: any) => setConfirmPassword(ev.target.value)}
        id="confirmPassword"
        type="confirmPassword"
        value={confirmPassword}
      />
      <button
        onClick={() => {
            {/* For testing */}
            console.log("Sign Up Clicked");
          }
        }
        style={{
          fontSize: '18px',
          width: '270px',
          height: '60px',
          top: '582px',
          left: '922px',
          borderRadius: '16px',
          color: '#FFFFFF',
          background: 'linear-gradient(180deg, #6284FF 0%, #4B6DE9 100%)'
        }}
      >
        Sign up
      </button>
      <button
        onClick={() => {
            {/* For testing */}
            console.log("Sign In Clicked");
          }
        }
        style={{
          display: 'flex',
          fontSize: '16px',
          width: '291px',
          height: '21px',
          top: '884px',
          left: '912px',
          color: '#6284FF'
        }}
      >
        Sign in Here!
      </button>
    </>
  );
}

export default Auth;
