import Link from 'next/link';
import { MenuItemsProp } from '@/constants/menuItems';
import MenuButton from '@/components/ui/MenuButton';
import { useRouter } from 'next/router';
import SubNavbarDateTime from '@/components/ui/SubNavbarDateTime';
import { useFocusContext } from '@/context/FocusContext';
import UncontrolledDropdown from '../ui/Uncontrolled/UncontrolledDropdown';

interface SubNavbarProps {
  menuItems: MenuItemsProp[];
  open: boolean;
}

const SubNavbar = ({ menuItems, open }: SubNavbarProps) => {
  const {
    pathname: currentPath,
    query: { id },
  } = useRouter();
  const { setClassId, setLevelId, classes, selectedClass, setSelectedClass } = useFocusContext();

  const handleSelectClass = (selectedClass: any) => {
    setClassId(selectedClass.id);
    setLevelId(selectedClass.levelId);
    setSelectedClass(selectedClass);
  };

  return (
    <>
      {open && (
        <div className="tw-border tw-border-x-0 tw-border-t-0 tw-border-solid tw-border-secondary">
          <div className="tw-min-w-[1016px] tw-mx-4xl tw-min-h-[52px] tw-py-sm tw-flex tw-items-center tw-space-x-md tw-justify-between ">
            <div className="tw-flex  tw-space-x-md">
              {currentPath.startsWith('/focus') && (
                <UncontrolledDropdown
                  data={classes && classes?.length > 0 ? classes : []}
                  containerClassName={`${
                    classes && classes?.length == 1 && '!tw-border-transparent !tw-cursor-default'
                  }`}
                  setSelectedItems={handleSelectClass}
                  dropdownClassName="!tw-w-[200px]"
                  selectedItems={selectedClass || null}
                  component="Class"
                  anchorRight={false}
                />
              )}
              <div className="tw-flex tw-flex-wrap tw-space-x-md">
                {menuItems &&
                  menuItems
                    .filter((item) => item.show)
                    .map((item) => (
                      <Link key={item.id} href={`${item.link}`} className="tw-no-underline">
                        <MenuButton
                          active={
                            currentPath.startsWith(item.link) || currentPath.split('/')[1] === item.id || id == item.id
                          }
                          name={item.title}
                          isSecondary={true}
                        />
                      </Link>
                    ))}
              </div>
            </div>
            <div className="tw-flex-none">
              <SubNavbarDateTime />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubNavbar;
