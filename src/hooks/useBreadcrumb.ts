import { useEffect } from "react";
import { useBreadcrumbContext } from "./useBreadcrumbContext";
import { BreadcrumbType } from "@/context/BreadcrumbContext";

interface Breadcrumbprops {
    pageName: string,
    breadcrumbs: BreadcrumbType[]
}

const useBreadcrumb = (props: Breadcrumbprops) => {

    const { setBreadcrumb, setPageName } = useBreadcrumbContext();

    useEffect(() => {
        setPageName(props.pageName);
        setBreadcrumb(props.breadcrumbs);
    }, []);

}

export default useBreadcrumb;