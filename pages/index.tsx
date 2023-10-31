import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import ProfileAvatar from "../components/ProfileAvatar";
import useCurrentUser from "@/hooks/useCurrentUser";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default function Home() {
  const { data: user } = useCurrentUser();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-green-500">Hello World</h1>
          <ProfileAvatar name={user?.email_username} />
        </div>
      </div>
    </div>
  )
}
