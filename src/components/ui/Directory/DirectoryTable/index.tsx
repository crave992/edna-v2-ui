import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import StatusDot from '@/components/svg/StatusDot';
import EmergencyIcon from '@/components/svg/EmergencyIcon';
import DownArrowIcon from '@/components/svg/DownArrowIcon';
import { StaffBasicDto } from '@/dtos/StaffDto';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import { StudentBasicDto } from '@/dtos/StudentDto';
import Link from 'next/link';
import SkeletonTable from '@/components/common/Skeletons/SkeletonTable';
import { useFocusContext } from '@/context/FocusContext';
import { ParentBasicDto } from '@/dtos/ParentDto';
import { ClassDirectoryDataModel } from '@/models/ClassModel';
import Avatar from '@/components/ui/Avatar';
import ClassDto, { ClassStaffDto } from '@/dtos/ClassDto';
import { formatFileSize } from '@/utils/formatFileSize';
import { usePopover } from '@/hooks/usePopover';
import ContextMenu from '@/components/ui/ContextMenu';
import ContextMenuButton from '@/components/ui/ContextMenuButton';
import TrashIcon from '@/components/svg/TrashIcon';
import DownloadIcon from '@/components/svg/DownloadIcon';
import { CopyIcon } from '@/components/svg/CopyIcon';
import EditIcon from '@/components/svg/EditIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cloneFile, deleteFile, downloadFile, renameFile } from '@/services/api/uploadFile';
import useNotification from '@/hooks/useNotification';
import CheckCircleIcon from '@/components/svg/CheckCircle';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import DividerSVG from '@/components/svg/Divider';
import { isMobile } from 'react-device-detect';
import { UserBadge } from '@/components/ui/UserBadge';
import { useRouter } from 'next/router';
import CustomBadge from '@/components/ui/CustomBadge';
import TooltipWrapper from '@/components/ui/TooltipWrapper';

interface DirectoryTableProps<T extends StaffBasicDto | StudentBasicDto | ParentBasicDto | ClassDto> {
  isFetching: boolean;
  data: T[];
  tableHeaders: { name: string; sortable: boolean; key: string; style?: string }[];
  tableRows: {
    name: string;
    key: string;
    type: string;
    func?: Function;
    link?: string;
    bold?: boolean;
    first?: boolean;
    style?: string;
    format?: string;
    component?: string;
  }[];
  shouldApplyFilters: boolean;
  filteredItems?: FilteredItemsDto;
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (newSortBy: string, newSortDirection: 'asc' | 'desc') => void;
  setShowEmergencyInfo?: (showEmergencyInfo: boolean) => void;
  setSelectedUser?: Function;
  tableClassName?: string;
  hasContextMenu?: boolean;
  loaderWidth?: string;
}

interface genderWiseType {
  total: number;
  gender: string;
}

type TableRowItem = (StaffBasicDto | StudentBasicDto | ParentBasicDto | ClassDto) & { [key: string]: any };

const DirectoryTable = <T extends StaffBasicDto | StudentBasicDto | ParentBasicDto | ClassDto>({
  isFetching,
  data,
  tableHeaders,
  tableRows,
  shouldApplyFilters,
  filteredItems,
  searchTerm,
  sortBy,
  sortDirection,
  onSortChange,
  setShowEmergencyInfo,
  setSelectedUser,
  tableClassName,
  hasContextMenu,
  loaderWidth = 'calc(100vw - 64px)',
}: DirectoryTableProps<T>) => {
  const queryClient = useQueryClient();
  const notify = useNotification;
  const { setStudentId } = useFocusContext();
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<TableRowItem | null>(null);
  const [sortHeader, setSortHeader] = useState({ header: '', sort: '', key: '' });
  const { referenceElement, setReferenceElement, popperElement, setPopperElement, popOverStyles, popOverAttributes } =
    usePopover();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const router = useRouter();

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(data);
      return;
    }

    const searchData = data?.filter(
      (item: StaffBasicDto | StudentBasicDto | ParentBasicDto | ClassDto) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ('email' in item && item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(searchData);
  }, [data, searchTerm]);

  useEffect(() => {
    if (filteredData) {
      let filteredDataCopy = JSON.parse(JSON.stringify(filteredData));

      filteredDataCopy.sort((a: T, b: T) => {
        const aValue = a[sortHeader.key as keyof T];
        const bValue = b[sortHeader.key as keyof T];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortHeader.sort === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (aValue instanceof Date && bValue instanceof Date) {
          return sortHeader.sort === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        } else {
          return false;
        }
      });
      setFilteredData(filteredDataCopy);
    }
  }, [sortHeader]);

  const handleHeaderClick = (headerKey: string) => {
    if (headerKey === sortBy) {
      onSortChange(headerKey, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(headerKey, 'asc');
    }
  };

  const handleAvatarWithFunction = (event: React.MouseEvent<HTMLElement>, callBack: Function, item: TableRowItem) => {
    event.preventDefault();
    callBack(item);
  };

  const handleOpenContextMenu = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    item: TableRowItem
  ) => {
    event.preventDefault();
    if (isMobile && 'touches' in event && event.touches && event.touches.length === 2) {
      const touch = event.touches[0];
      const windowHeight = window.innerHeight;
      const menuHeight = 200;
      const clickY = touch.clientY + window.scrollY;
      const spaceBelow = windowHeight - clickY;
      const topPosition = spaceBelow > menuHeight ? clickY : Math.max(clickY - menuHeight, 0);
      const leftPosition = touch.clientX;
      setContextMenuPosition({ top: topPosition, left: leftPosition });
      setReferenceElement(event.currentTarget);
      setDownloadFileName(item.fileName + '.' + item.fileType);
      setSelectedItemId(item.id);
      setIsPopoverOpen(true);
    } else if (isMobile && !isPopoverOpen) {
      return;
    } else {
      const windowHeight = window.innerHeight;
      const menuHeight = 200;
      const clickY = ('touches' in event ? event.touches[0].clientY : event.clientY) + window.scrollY;
      const spaceBelow = windowHeight - clickY;
      const topPosition = spaceBelow > menuHeight ? clickY : Math.max(clickY - menuHeight, 0);
      const leftPosition = 'touches' in event ? event.touches[0].clientX : event.clientX;
      setContextMenuPosition({ top: topPosition, left: leftPosition });
      setDownloadFileName(item.fileName + '.' + item.fileType);
      setSelectedItemId(item.id);
      setIsPopoverOpen(true);
    }
  };

  const cloneFileMutation = useMutation(
    async ({ id, type }: { id: number; type: string }) => {
      return await cloneFile(id, type);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['student']);
        notify('File duplicated', <CheckCircleIcon />);
        setIsPopoverOpen(false);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const deleteFileMutation = useMutation(
    async ({ id, type }: { id: number; type: string }) => {
      return await deleteFile(id, type);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['student']);
        notify(
          'File deleted',
          <div className="tw-flex tw-rounded-full tw-w-[32px] tw-h-[32px] tw-bg-[#C6D4E2] tw-justify-center tw-items-center">
            <TrashIcon />
          </div>
        );
        setIsPopoverOpen(false);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const downloadFileMutation = useMutation(
    async ({ id, type, fileName }: { id: number; type: string; fileName: string }) => {
      return await downloadFile(id, type, fileName);
    },
    {
      onSuccess: (_, variables) => {
        notify('File downloaded', <CheckCircleIcon />);
        setIsPopoverOpen(false);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const editFileNameMutation = useMutation(
    async ({ id, type, fileName }: { id: number; type: string; fileName: string }) => {
      return await renameFile(id, type, fileName);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['student']);
        setIsEditName(false);
        notify('File renamed', <CheckCircleIcon />);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  return (
    <div className="tw-max-w-full">
      <table className="tw-table-auto tw-w-full tw-max-w-full">
        <thead
          className={`tw-bg-secondary tw-border-y tw-border-x-0 tw-border-secondary tw-border-solid ${tableClassName}`}
        >
          <tr className="tw-mx-4xl">
            {tableHeaders &&
              tableHeaders.map((header, index) => {
                return (
                  <th
                    className={`tw-truncate tw-py-lg first:tw-pl-4xl tw-px-3xl ${
                      header.sortable && 'tw-cursor-pointer'
                    } ${header.style ? header.style : ''}`}
                    onClick={() => header.sortable && handleHeaderClick(header.key)}
                    key={`header-${header}-${index}`}
                  >
                    <div className="tw-text-xs-medium tw-text-tertiary tw-inline-block">{header.name}</div>
                    {header.sortable && header.key === sortBy && (
                      <span
                        className={`tw-inline-block tw-cursor-pointer tw-ml-md tw-transform tw-transition-all tw-duration-500 tw-ease-in-out ${
                          sortDirection === 'asc' ? 'tw-rotate-180' : ''
                        }`}
                      >
                        <DownArrowIcon />
                      </span>
                    )}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {!isFetching &&
            filteredData &&
            filteredData.length > 0 &&
            filteredData.map((item: TableRowItem, itemIndex) => {
              return (
                <>
                  <tr
                    className="tw-mx-4xl tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0 hover:tw-bg-secondary tw-group"
                    key={`rowItem-${item.name}-${itemIndex}`}
                    onContextMenu={(event) => handleOpenContextMenu(event, item)}
                    onTouchStart={(event) => {
                      handleOpenContextMenu(event, item);
                    }}
                    ref={setReferenceElement}
                  >
                    {tableRows &&
                      tableRows.map((row) => {
                        switch (row.type) {
                          case 'name':
                            return (
                              <td className="tw-py-xl first:tw-pl-4xl tw-px-3xl">
                                {isEditName && selectedItemId == item.id ? (
                                  <div className="tw-w-full">
                                    <input
                                      type="text"
                                      name="name"
                                      defaultValue={item.name ? item.name : item.fileName}
                                      className="tw-border-0 tw-bg-secondary tw-w-full tw-text-sm-regular tw-text-tertiary"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const inputValue = (e.target as HTMLInputElement).value;
                                          editFileNameMutation.mutateAsync({
                                            id: selectedItemId!,
                                            type: 'student',
                                            fileName: inputValue,
                                          });
                                        }
                                      }}
                                      onBlur={(e) =>
                                        editFileNameMutation.mutateAsync({
                                          id: selectedItemId!,
                                          type: 'student',
                                          fileName: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={`tw-text-sm-medium tw-text-primary tw-whitespace-nowrap tw-text-center ${
                                      row.style ? row.style : ''
                                    }`}
                                  >
                                    {item.name ? item.name : item.fileName}
                                  </div>
                                )}
                              </td>
                            );
                          case 'avatar':
                            return (
                              <td className="tw-py-xl first:tw-pl-4xl tw-px-3xl tw-flex">
                                <Link
                                  className="tw-flex tw-items-center tw-no-underline"
                                  href={row.link ? `${row.link}/${item.id}` : '#'}
                                  onClick={(e) =>
                                    row.func ? handleAvatarWithFunction(e, row.func, item) : () => false
                                  }
                                >
                                  <div className="tw-flex tw-space-x-lg tw-items-center">
                                    <Avatar
                                      link={
                                        item.contact
                                          ? item.contact.profilePhoto
                                          : item.profilePicture
                                          ? item.profilePicture
                                          : item.profilePhoto
                                      }
                                      photoSize={40}
                                      alt={item.name}
                                      firstName={item.firstName ?? item.contact.firstName}
                                      lastName={item.lastName ?? item.contact.lastName}
                                    />
                                    <div className="tw-text-sm-medium tw-text-primary">
                                      {item.name //remove truncate to fix tw-truncate
                                        ? item.name
                                        : item.contact
                                        ? `${item.contact.firstName} ${item.contact.lastName}`
                                        : `${item.firstName} ${item.lastName}`}
                                    </div>
                                  </div>
                                </Link>
                              </td>
                            );
                          case 'emergency':
                            return item[row.key]?.severeAllergies || item[row.key]?.nonSevereAllergies ? (
                              <td className="tw-py-xl tw-px-3xl tw-text-center">
                                <button
                                  onClick={() => {
                                    setStudentId(item.id);
                                    if (setSelectedUser) setSelectedUser(item);
                                    if (setShowEmergencyInfo) setShowEmergencyInfo(true);
                                  }}
                                  className="tw-border-transparent tw-bg-transparent"
                                >
                                  <EmergencyIcon
                                    color={
                                      item[row.key]?.severeAllergies
                                        ? 'error'
                                        : item[row.key]?.nonSevereAllergies
                                        ? 'gray'
                                        : undefined
                                    }
                                  />
                                </button>
                              </td>
                            ) : (
                              <td></td>
                            );
                          case 'text':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl tw-text-center ${row.first ? 'first:tw-pl-4xl' : ''} ${
                                  row.style ? row.style : ''
                                } ${row.format == 'uppercase' && 'tw-uppercase'}`}
                              >
                                <div className="tw-text-sm-regular tw-text-tertiary tw-truncate">{item[row.key]}</div>
                              </td>
                            );
                          case 'email':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl tw-text-center ${row.first ? 'first:tw-pl-4xl' : ''} ${
                                  row.style ? row.style : ''
                                }`}
                              >
                                <a
                                  className="tw-text-md-normal tw-text-primary hover:tw-text-md-medium hover:tw-text-primary"
                                  href={`mailto:${row.key == 'contact' ? item[row.key].email : item[row.key]}`}
                                >
                                  {row.key == 'contact' ? item[row.key].email : item[row.key]}
                                </a>
                              </td>
                            );
                          case 'phone':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl tw-text-center ${row.first ? 'first:tw-pl-4xl' : ''} ${
                                  row.style ? row.style : ''
                                }`}
                              >
                                {row.key == 'contact' &&
                                item[row.key].phone !== null &&
                                item[row.key].phone !== 'null' ? (
                                  item[row.key].phone
                                ) : item[row.key].phone !== null && item[row.key].phone !== 'null' ? (
                                  <a
                                    className="tw-text-md-normal tw-text-primary hover:tw-text-md-medium hover:tw-text-primary"
                                    href={`tel:${row.key == 'contact' ? item[row.key].phone : item[row.key]}`}
                                  >
                                    {row.key == 'contact' ? item[row.key].phone : item[row.key]}
                                  </a>
                                ) : (
                                  <span className="tw-text-md-normal tw-text-primary">-</span>
                                )}
                              </td>
                            );
                          case 'primary':
                            return (
                              <td
                                className={`tw-p-xl ${row.first ? 'first:tw-pl-4xl' : ''} ${
                                  row.style ? row.style : ''
                                }`}
                              >
                                <Link
                                  className={`tw-no-underline tw-cursor-pointer tw-block tw-text-primary tw-text-sm-medium hover:tw-text-primary 
                                 ${
                                   item['classStaff'] && item['classStaff'].length > 1 ? 'tw-flex-col' : 'tw-text-left'
                                 }`}
                                  href={row.link ? `${row.link}/${item.id}` : '#'}
                                  onClick={(e) =>
                                    row.func ? handleAvatarWithFunction(e, row.func, item) : () => false
                                  }
                                >
                                  <div className={``}>
                                    {item[row.key]?.firstName
                                      ? `${item[row.key]?.firstName} ${item[row.key]?.lastName}`
                                      : item[row.key]}
                                  </div>
                                </Link>
                              </td>
                            );
                          case 'lead':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl tw-space-y-md ${row.style ? row.style : ''} ${
                                  item[row.key] && item[row.key].length > 1 ? '' : ''
                                }`}
                              >
                                {item[row.key] && item[row.key].length > 0 ? (
                                  item[row.key].map((staff: ClassStaffDto, index: number) => {
                                    return (
                                      staff.type === Number(1) && (
                                        <div
                                          className="tw-flex tw-items-start tw-justify-start tw-cursor-pointer"
                                          key={`row-${item.name}-${index}-${itemIndex}`}
                                          onClick={() => {
                                            router.push(`/directory/staff/${staff.id}`);
                                          }}
                                        >
                                          <UserBadge firstName={staff?.firstName!} lastName={staff?.lastName!} height={'tw-h-auto'} />
                                        </div>
                                      )
                                    );
                                  })
                                ) : (
                                  <div> </div>
                                )}
                              </td>
                            );
                          case 'associate-specialist':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl tw-space-y-md ${row.style ? row.style : ''} ${
                                  item[row.key] && item[row.key].length > 1 ? '' : 'tw-text-left'
                                }`}
                              >
                                {item[row.key] && item[row.key].length > 0 ? (
                                  item[row.key].map((staff: ClassStaffDto, index: number) => {
                                    return (
                                      staff.type !== 1 && (
                                        // <div
                                        //   className="tw-flex tw-items-start tw-justify-start tw-cursor-pointer tw-truncate"
                                        //   key={`row-${item.name}-${index}-${itemIndex}`}
                                        //   onClick={() => {
                                        //     router.push(`/directory/staff/${item.id}`);
                                        //   }}
                                        // >
                                        //   <UserBadge firstName={staff?.firstName!} lastName={staff?.lastName!} />
                                        // </div>
                                        <div
                                          className="tw-flex tw-truncate"
                                          key={`row-${item.name}-${index}-${itemIndex}`}
                                        >
                                          {`${staff.firstName} ${staff.lastName}`}
                                        </div>
                                      )
                                    );
                                  })
                                ) : (
                                  <div> </div>
                                )}
                              </td>
                            );
                          case 'attendance':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl ${row.style ? row.style : ''} ${
                                  item['classStaff'] && item['classStaff'].length > 1
                                    ? 'tw-text-left'
                                    : 'tw-text-center'
                                }`}
                              >
                                {item[row.key] && item[row.key].length ? item[row.key].length : ''}
                              </td>
                            );
                          case 'attendance_status':
                            let fill;
                            switch (item[row.key]) {
                              case 'Present':
                                if (item.isTardy) fill = 'warning';
                                else fill = 'success';
                                break;
                              case 'Tardy':
                                fill = 'warning';
                                break;
                              case 'Absent':
                              case 'Excuse Absent':
                              case 'Unexcused Absent':
                                fill = 'error';
                                break;
                              case 'Released':
                                fill = 'brand';
                                break;
                              case 'Not_Marked':
                                fill = 'error';
                                break;
                              default:
                                fill = 'brand';
                            }

                            return (
                              <>
                                {item[row.key] ? (
                                  <td className="tw-py-xl tw-px-3xl tw-text-center">
                                    <div className="tw-flex tw-items-center tw-text-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit tw-space-x-sm">
                                      <StatusDot fill={fill} />
                                      <div>
                                        {item[row.key] == 'Excuse Absent'
                                          ? 'Excused'
                                          : item[row.key] == 'Unexcused Absent'
                                          ? 'Unexcused'
                                          : item[row.key] == 'Not_Marked'
                                          ? 'Absent'
                                          : item[row.key] == 'Present' && item.isTardy
                                          ? 'Tardy'
                                          : item[row.key]}
                                      </div>
                                    </div>
                                  </td>
                                ) : (
                                  <td></td>
                                )}
                              </>
                            );
                          case 'capacity':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl directory-column ${row.style ? row.style : ''} ${
                                  item['classStaff'] && item['classStaff'].length > 1 ? 'tw-flex-col' : 'tw-text-left'
                                }`}
                              >
                                <div className="tw-text-sm-regular tw-text-tertiary">
                                  {item.genderWiseCount
                                    ? item.genderWiseCount.reduce(
                                        (acc: number, obj: genderWiseType) => acc + obj.total,
                                        0
                                      )
                                    : ''}{' '}
                                  / {item[row.key]}
                                </div>
                              </td>
                            );
                          case 'date':
                            const format = row.format ? row.format : 'MM/DD/YY';
                            return (
                              <td
                                className={`first:tw-pl-4xl tw-py-xl tw-px-3xl tw-text-center ${
                                  row.style ? row.style : ''
                                } ${row.bold && '!tw-text-sm-medium !tw-text-primary'}
                                ${row.func ? 'tw-cursor-pointer' : ''}`}
                                onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                                  row.func ? handleAvatarWithFunction(e, row.func, item) : () => false
                                }
                              >
                                <div className="tw-text-sm-regular tw-text-tertiary">
                                  {item[row.key]
                                    ? dayjs(row.key == 'contact' ? item[row.key].createdOn : item[row.key]).format(
                                        format
                                      )
                                    : ''}
                                </div>
                              </td>
                            );
                          case 'box':
                            return (
                              <td className={`tw-py-xl tw-px-3xl tw-text-center ${row.style ? row.style : ''}`}>
                                <div className="empty:tw-hidden tw-text-center tw-justify-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit bg-white tw-text-sm-regular tw-text-secondary">
                                  {item[row.key].name || item[row.key] || ''}
                                </div>
                              </td>
                            );
                          case 'level':
                            return (
                              <td
                                className={`${
                                  item['classStaff'] && item['classStaff'].length > 1 ? 'tw-flex-col' : 'tw-items-left'
                                }`}
                              >
                                {item[row.key] ? (
                                  <div className={`tw-py-xl tw-px-3xl tw-text-center ${row.style ? row.style : ''}`}>
                                    <div className="empty:tw-hidden tw-text-center tw-justify-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit tw-bg-white">
                                      {item[row.key]?.class?.levelName || item?.level?.name || item[row.key] || ''}
                                    </div>
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </td>
                            );
                          case 'class':
                            return (
                              <td className={`tw-py-xl tw-px-3xl tw-text-center ${row.style || ''}`}>
                                {Array.isArray(item[row.key]) ? (
                                  <div className={`tw-text-center ${row.style || ''}`}>
                                    {item[row.key].map((classItem: ClassDirectoryDataModel, index: number) => (
                                      <div key={index}>{classItem.name}</div>
                                    ))}
                                  </div>
                                ) : item[row.key]?.class?.name ? (
                                  <div>{item[row.key]?.class?.name}</div>
                                ) : (
                                  <div></div>
                                )}
                              </td>
                            );
                          case 'box_status':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl ${
                                  item['classStaff'] && item['classStaff'].length > 1
                                    ? 'tw-text-left'
                                    : 'tw-text-center'
                                } ${row.style ? row.style : ''}`}
                              >
                                <div className="tw-space-x-xs tw-items-center tw-justify-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit tw-bg-white tw-flex">
                                  <StatusDot fill={item[row.key] ? 'success' : 'error'} />
                                  <span className="tw-text-sm-regular tw-text-secondary">
                                    {item[row.key] ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </td>
                            );
                          case 'box_boolean':
                            return (
                              <td className={`tw-py-xl tw-px-3xl tw-text-center ${row.style ? row.style : ''}`}>
                                <div className="tw-space-x-xs tw-items-center tw-justify-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit">
                                  <StatusDot fill={item[row.key] ? 'success' : 'error'} />
                                  <span className="tw-text-sm-regular tw-text-tertiary">
                                    {item[row.key] ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </td>
                            );
                          case 'array':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl ${row.style ? row.style : ''} ${
                                  item[row.key]?.length > 1 ? 'tw-flex-col' : 'tw-text-left'
                                }`}
                              >
                                {item[row.key]
                                  ? item[row.key].map((key: StudentBasicDto | StaffBasicDto | ParentBasicDto) => {
                                      return (
                                        <div key={key.id} className="tw-text-sm-regular tw-text-tertiary tw-truncate">
                                          {key.name}
                                        </div>
                                      );
                                    })
                                  : ''}
                              </td>
                            );
                          case 'fileSize':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl tw-text-center ${row.first ? 'first:tw-pl-4xl' : ''} ${
                                  row.style ? row.style : ''
                                }`}
                              >
                                <div className="tw-text-sm-regular tw-text-tertiary">
                                  {formatFileSize(Number(item[row.key]))}
                                </div>
                              </td>
                            );
                          case 'avatar_badge':
                            const avatarBadgeData =
                              item[row.key].length > 0 && item[row.key].length === 1 ? item[row.key][0] : item[row.key];
                            let extra: string[] = [];
                            if (item[row.key].length > 1) {
                              return (
                                <td
                                  className="tw-py-xl tw-px-3xl tw-flex-nowrap tw-space-x-xs tw-flex"
                                  key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                                >
                                  {item[row.key].map((staff: any, index: number) => {
                                    if (index > 1) {
                                      extra.push(staff.name ? staff.name : staff.firstName + ' ' + staff.lastName);
                                      return;
                                    }
                                    return (
                                      <Link
                                        href={`/directory/${row.component && item[row.component]}/${item.id}`}
                                        onClick={(event) => event.stopPropagation()}
                                        className="tw-no-underline"
                                        key={`table-badge-${item.id}-${row.name}-${itemIndex}`}
                                      >
                                        <CustomBadge
                                          size="lg"
                                          type="pill-color"
                                          color="gray"
                                          icon="avatar"
                                          avatarImg={staff.profilePicture}
                                          containerClassName={
                                            'tw-w-fit tw-space-x-xs tw-flex tw-items-center tw-pl-sm tw-pr-lg'
                                          }
                                        >
                                          {staff.name ? staff.name : staff.firstName + ' ' + staff.lastName}
                                        </CustomBadge>
                                      </Link>
                                    );
                                  })}
                                  {extra.length > 0 && (
                                    <TooltipWrapper text={extra.join('<br/>')}>
                                      <CustomBadge
                                        size="lg"
                                        type="pill-color"
                                        color="gray"
                                        key={`table-badge-extra-${item.id}-${row.name}-${itemIndex}`}
                                      >
                                        +{extra.length}
                                      </CustomBadge>
                                    </TooltipWrapper>
                                  )}
                                </td>
                              );
                            } else if (item[row.key].length === 1) {
                              return (
                                <td
                                  className="tw-py-xl tw-px-3xl"
                                  key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                                >
                                  <Link
                                    href={`/directory/${row.component && item[row.component]}/${item.id}`}
                                    onClick={(event) => event.stopPropagation()}
                                    className="tw-no-underline"
                                  >
                                    <CustomBadge
                                      size="lg"
                                      type="pill-color"
                                      color="gray"
                                      icon="avatar"
                                      avatarImg={avatarBadgeData.profilePicture}
                                      containerClassName={
                                        'tw-w-fit tw-space-x-xs tw-flex tw-items-center tw-pl-sm tw-pr-lg'
                                      }
                                    >
                                      {avatarBadgeData.name
                                        ? avatarBadgeData.name
                                        : avatarBadgeData.firstName + ' ' + avatarBadgeData.lastName}
                                    </CustomBadge>
                                  </Link>
                                </td>
                              );
                            } else {
                              return <td></td>;
                            }
                        }
                      })}
                    {isPopoverOpen && hasContextMenu && (
                      <ContextMenu
                        onClose={() => setIsPopoverOpen(false)}
                        popperRef={setPopperElement}
                        popperElementRef={popperElement}
                        popperStyle={{
                          position: 'absolute',
                          top: `${contextMenuPosition.top}px`,
                          left: `${contextMenuPosition.left + 20}px`,
                        }}
                        popperAttributes={popOverAttributes.popper}
                        parentRef={referenceElement}
                      >
                        <ContextMenuButton
                          title="Edit Name"
                          icon={<EditIcon stroke="#667085" size="16" />}
                          onClick={() => {
                            setIsEditName(true);
                            setIsPopoverOpen(false);
                          }}
                        />
                        <ContextMenuButton
                          title="Duplicate"
                          icon={cloneFileMutation.isLoading ? <LoadingSpinner width={16} /> : <CopyIcon />}
                          onClick={() => cloneFileMutation.mutateAsync({ id: selectedItemId!, type: 'student' })}
                        />
                        <div className="tw-flex tw-items-center">
                          <DividerSVG />
                        </div>
                        <ContextMenuButton
                          title="Download"
                          icon={downloadFileMutation.isLoading ? <LoadingSpinner width={16} /> : <DownloadIcon />}
                          onClick={() =>
                            downloadFileMutation.mutateAsync({
                              id: selectedItemId!,
                              type: 'student',
                              fileName: downloadFileName,
                            })
                          }
                        />
                        <ContextMenuButton
                          title="Delete"
                          icon={
                            deleteFileMutation.isLoading ? (
                              <LoadingSpinner width={16} />
                            ) : (
                              <TrashIcon color="fg-quarterary" size="16" />
                            )
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            deleteFileMutation.mutateAsync({ id: selectedItemId!, type: 'student' });
                          }}
                        />
                      </ContextMenu>
                    )}
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
      {isFetching ? (
        <div className="tw-mx-4xl" style={{ width: loaderWidth }}>
          <SkeletonTable />
        </div>
      ) : !filteredData || filteredData.length === 0 ? (
        <div className="tw-flex tw-items-center tw-justify-center tw-text-md-semibold tw-text-secondary tw-pt-lg">
          No data available!
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default DirectoryTable;
