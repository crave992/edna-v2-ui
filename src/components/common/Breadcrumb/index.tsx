import { useBreadcrumbContext } from "@/hooks/useBreadcrumbContext";
import { faAnglesRight, faBarsSort } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Breadcrumb = () => {
  const { breadcrumbs, pageName } = useBreadcrumbContext();

  return (
    <>
        
        <div className="page_title">
          <h1>{pageName}</h1>

          <div className="breadcrumbs">
            <div className="breadcrumbs_link">
              <div className="breadcrumb_main">
                {breadcrumbs &&
                  breadcrumbs.map((el, index) => {
                    return (
                      <span key={index}>
                        <Link href={`${el.link}`}>
                          <span>{el.label}</span>
                        </Link>
                        <FontAwesomeIcon icon={faAnglesRight} />
                      </span>
                    );
                  })}                
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default Breadcrumb;
