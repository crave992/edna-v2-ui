import profileOptions from '@/constants/profileOptions';
import { faCommand } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavDropdown } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useFocusContext } from '@/context/FocusContext';

export default function ProfileOptions() {
  const { pathname: currentPath } = useRouter();
  const { data: session } = useSession();
  const { currentUserRoles } = useFocusContext();

  const activateLink = (pageLink = '') =>
    currentPath.toLowerCase().startsWith(pageLink.toLowerCase()) ? '[&.active]:tw-bg-active active' : '';

  return (
    <>
      {profileOptions.map(({ id, divider, link, adminLink, icon, title, shortcut }) =>
        divider ? (
          <NavDropdown.Divider key={id} className="custom-divider" />
        ) : (
          <NavDropdown.Item
            as={Link}
            href={
              link === '/staff' && session
                ? currentUserRoles?.hasAdminRoles
                  ? `${adminLink}/${session.user.staffId}`
                  : `${link}/${session.user.staffId}`
                : link
            }
            key={id}
            className={`tw-text-sm-medium tw-text-secondary tw-px-sm tw-py-[1px] hover:tw-bg-active ${activateLink(
              link
            )}`}
          >
            <div className="tw-flex tw-justify-between tw-py-9px tw-px-10px">
              <div className="tw-flex tw-justify-start tw-space-x-md">
                {icon && (
                  <div className="tw-flex tw-items-center tw-justify-center">
                    <Image src={icon} width={16} height={16} alt={title!} priority />
                  </div>
                )}
                <div>{title}</div>
              </div>
              {shortcut && (
                <div className="tw-text-xs-regular tw-text-quarterary tw-flex tw-items-center tw-justify-center tw-space-x-xxs">
                  <FontAwesomeIcon icon={faCommand} size="xs" />
                  <div>{shortcut}</div>
                </div>
              )}
            </div>
          </NavDropdown.Item>
        )
      )}
    </>
  );
}
