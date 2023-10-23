import Input from "@/components/Input";
import EmailIcon from '../public/sms.svg';
import LockIcon from '../public/lock.svg';
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState('');
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
        alt="Lock Icon"
        label="Confirm Password"
        onChange={(ev: any) => setConfirmPassword(ev.target.value)}
        id="confirmPassword"
        type="confirmPassword"
        value={confirmPassword}
      />
    </>
  );
}

export default Auth;