import { BreadcrumbContext, BreadcrumbContextValue } from "@/context/BreadcrumbContext";
import { useContext } from "react";

export const useBreadcrumbContext = (): BreadcrumbContextValue => {
    const context = useContext(BreadcrumbContext);

    if (!context) {
       throw new Error('useBreadcrumbContext must be used within a BreadcrumbContextProvider');
    }

    return context;
};