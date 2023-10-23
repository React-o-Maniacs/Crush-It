import Input from "@/components/Input";
import EmailIcon from '../public/sms.svg';
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState('');

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
    </>
  );
}

export default Auth;