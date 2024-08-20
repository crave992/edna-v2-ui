import siteMetadata from "@/constants/siteMetadata";
import { faCamera } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { InputHTMLAttributes } from "react";
import { Form } from "react-bootstrap";

interface AvatarProps extends InputHTMLAttributes<HTMLInputElement> {
  size: number;
  imageSrc: string;
  name?: string;
  edit:boolean;
  alt?: string;
}

export default function Avatar({ size, imageSrc, name, edit, alt }: AvatarProps) {
  return (
    <div className="account_profile justify-content-between align-items-center">
      <div className="userDetailsMain">
        <div className="userAvatar" style={{ width: `${size}px`, height: `${size}px` }}>
          {imageSrc && <Image
            alt={alt || siteMetadata.title}
            width={size}
            height={size}
            src={imageSrc}
          />}
          {
           edit && (
            <div className="edit_avatar">
              <Form.Label htmlFor={name}>
                <FontAwesomeIcon icon={faCamera} size="1x" />
              </Form.Label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}