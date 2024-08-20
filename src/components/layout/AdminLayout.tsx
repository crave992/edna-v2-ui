import { NextPage } from 'next';
import React, { ReactNode, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NextNavbar from './Navbar';
import UserDto from '@/dtos/UserDto';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: NextPage<AdminLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (session && session?.user) {
      setUser(session?.user);
    }
  }, [session]);

  return (
    <div className="dashboard_wrapper tw-overflow-hidden" id="colorMode">
      <NextNavbar user={user as UserDto} />
      <main className={`${router.pathname.split('/')[1] === 'focus' ? 'tw-bg-secondary' : 'tw-bg-primary'}`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
