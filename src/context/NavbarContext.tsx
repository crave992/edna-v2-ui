import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
  ReactElement,
} from 'react';

type NavbarContextProps = {
  activeSubNavId: string;
  openSubNavbar: boolean;
  setOpenSubNavbar: (openSubNavbar: boolean) => void;
  setActiveSubNavId: (activeId: string) => void;
};

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbarContext must be used within a NavbarProvider');
  }
  return context;
};

interface NavbarProviderProps {
  children: ReactNode;
}

export const NavbarProvider: FunctionComponent<NavbarProviderProps> = ({ children }): ReactElement => {
  const [openSubNavbar, setOpenSubNavbar] = useState<boolean>(false);
  const [activeSubNavId, setActiveSubNavId] = useState<string>('');

  const contextValue = {
    activeSubNavId, 
    openSubNavbar,
    setOpenSubNavbar,
    setActiveSubNavId
  };

  return <NavbarContext.Provider value={contextValue}>{children}</NavbarContext.Provider>;
};
