import Input from "@/components/Input";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState('');
  return (
    <Input
      label="Email/username"
      onChange={(ev: any) => setEmail(ev.target.value)}
      id="email"
      type="email"
      value={email}
    />
  );
}

export default Auth;