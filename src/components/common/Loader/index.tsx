import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import styles from "./index.module.css";
import { Image } from "react-bootstrap";

interface LoaderProps extends CommonProps {
  message?: string;
}

const Loader: NextPage<LoaderProps> = (props) => {
  return (
    <>
      <div className={styles.ajaxloader}>
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN_PATH}/images/loader.gif`}
          className="img-fluid"
          alt="loader"
        />
      </div>
    </>
  );
};

export default Loader;
