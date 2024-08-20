import UserDto from '@/dtos/UserDto';
import React, { createContext, FunctionComponent, ReactElement, ReactNode, useState } from 'react';

interface UserContextInterface {
  user: UserDto | null;
  setUser: (user: UserDto) => void;
  updateUser: (updateUser: Partial<UserDto>) => void;
}

export const UserContext = createContext<UserContextInterface>({
  user: null,
  setUser: (_user: UserDto) => {},
  updateUser: (_updateUser: Partial<UserDto>) => {},
});

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: FunctionComponent<UserProviderProps> = ({ children }): ReactElement => {
  const [user, setUser] = useState<UserDto | null>(null);

  const updateUser = (updateUser: Partial<UserDto>) => {
    setUser((prevUser) => {
      if (!prevUser) {
        return null;
      }

      return {
        ...prevUser,
        ...updateUser,
      };
    });
  };

  const contextValue: UserContextInterface = {
    user,
    setUser,
    updateUser,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserProvider;