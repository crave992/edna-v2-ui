import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { createContext, useState } from "react";

export interface BreadcrumbType {
  label: string;
  link: string;
}

export interface BreadcrumbContextValue {
  breadcrumbs: BreadcrumbType[];
  setBreadcrumb: (breadcrumbs: BreadcrumbType[]) => void;
  pageName: string;
  setPageName: (pageName: string) => void;
}

interface BreadcrumbContextProviderProps extends CommonProps {}

export const BreadcrumbContext = createContext<
  BreadcrumbContextValue | undefined  
>(undefined);

const BreadcrumbContextProvider: NextPage<BreadcrumbContextProviderProps> = (
  props
) => {
  const [breadcrumbs, setBreadcrumb] = useState<BreadcrumbType[]>([]);
  const [pageName, setPageName] = useState<string>('Dashboard');

  const value: BreadcrumbContextValue = { breadcrumbs, setBreadcrumb, pageName, setPageName };

  return (
    <BreadcrumbContext.Provider value={value}>
      {props.children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContextProvider;
