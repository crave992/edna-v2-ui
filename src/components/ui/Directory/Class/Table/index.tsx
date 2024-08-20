import { StudentBasicDto } from '@/dtos/StudentDto';
import StatusDot from '@/components/svg/StatusDot';
import EmergencyIcon from '@/components/svg/EmergencyIcon';
import ClassAttendanceDto from '@/dtos/ClassAttendanceDto';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import UserContactDto from '@/dtos/UserContactDto';
import { useRouter } from 'next/router';
import { UserBadge } from '@/components/ui/UserBadge';
import { useFocusContext } from '@/context/FocusContext';

interface ExtendedStudentBasicDto extends StudentBasicDto {
  [key: string]: any;
}

interface TableProps {
  data: ExtendedStudentBasicDto[];
  isFetching: boolean;
  tableHeaders: { name: string; key: string; style?: string }[];
  tableRows: {
    name: string;
    key: string;
    type: string;
    style?: string;
  }[];
  setShowEmergencyInfo: Function;
  attendance: ClassAttendanceDto[];
  setSelectedUser?: Function;
}

const Table = ({
  data,
  isFetching,
  tableHeaders,
  tableRows,
  setShowEmergencyInfo,
  attendance,
  setSelectedUser,
}: TableProps) => {
  const router = useRouter();
  const { currentUserRoles } = useFocusContext();
  const getAttendanceStatus = (id: number) => {
    const status = attendance?.filter((att: ClassAttendanceDto) => att.studentId === id)[0];
    return (
      status && (
        <div
          className="tw-flex tw-space-x-xs tw-items-center tw-justify-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit tw-bg-white"
          key={`status-${status}`}
        >
          <StatusDot
            fill={
              status?.presentOrAbsent === 'Absent' ||
              status?.presentOrAbsent === 'Excuse_Absent' ||
              status?.presentOrAbsent === 'Unexcused_Absent'
                ? 'error'
                : status?.presentOrAbsent === 'Present' && status.isTardy
                ? 'warning'
                : status?.presentOrAbsent === 'Released'
                ? 'brand'
                : 'success'
            }
          />
          <span className="tw-text-sm-regular">
            {status?.presentOrAbsent === 'Absent' || status?.presentOrAbsent === 'Unexcused_Absent'
              ? status?.presentOrAbsent.replace('_Absent', '')
              : status?.presentOrAbsent === 'Excuse_Absent'
              ? status?.presentOrAbsent.replace('_Absent', 'd')
              : status?.presentOrAbsent === 'Present' && status.isTardy
              ? 'Tardy'
              : status?.presentOrAbsent === 'Released'
              ? 'Released'
              : 'Present'}
          </span>
        </div>
      )
    );
  };

  return (
    <div className="tw-bg-secondary tw-pb-xl">
      <div className="tw-min-w-[1016px] tw-mx-4xl tw-p-0 tw-border tw-border-secondary tw-border-solid tw-rounded-xl tw-overflow-hidden">
        <table className="tw-w-full tw-bg-white">
          <thead>
            <tr className="tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0">
              {tableHeaders &&
                tableHeaders.map((header, index) => {
                  return (
                    <td
                      className={`tw-py-lg first:tw-pl-4xl last:tw-pr-4xl tw-px-3xl tw-text-xs-medium tw-text-tertiary tw-bg-secondary ${
                        header.style ? header.style : ''
                      }`}
                      key={`header-${header}-${index}`}
                    >
                      {header.name}
                    </td>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item: ExtendedStudentBasicDto, itemIndex: number) => {
                return (
                  <tr
                    key={`table-row-${item.id}-${itemIndex}`}
                    className="tw-w-full tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0 hover:tw-bg-secondary last:tw-border-b-0 tw-items-center"
                  >
                    {tableRows &&
                      tableRows.map((row) => {
                        switch (row.type) {
                          case 'avatar':
                            return (
                              <td
                                className="tw-py-xl first:tw-pl-4xl tw-px-3xl"
                                key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                              >
                                <Link
                                  href={
                                    currentUserRoles?.hasAdminRoles
                                      ? `/directory/student/${item.id}`
                                      : `/student/${item.id}`
                                  }
                                  className=" tw-no-underline"
                                >
                                  <span className="tw-space-x-lg tw-flex tw-items-center tw-justify-start">
                                    <Avatar
                                      link={item.profilePicture}
                                      photoSize={40}
                                      firstName={item.firstName}
                                      lastName={item.lastName}
                                    />
                                    <span className="tw-text-sm-medium tw-text-primary tw-whitespace-nowrap">
                                      {item.name ? item.name : `${item.firstName} ${item.lastName}`}
                                    </span>
                                  </span>
                                </Link>
                              </td>
                            );
                          case 'emergency':
                            return item[row.key]?.severeAllergies || item[row.key]?.nonSevereAllergies ? (
                              <td className="tw-py-xl tw-px-3xl" key={`table-row-${item.id}-${row.name}-${itemIndex}`}>
                                <div className="tw-flex tw-items-center tw-justify-center">
                                  <button
                                    onClick={() => {
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
                                </div>
                              </td>
                            ) : (
                              <td></td>
                            );
                          case 'text':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl ${row.style ? row.style : 'tw-text-primary'}`}
                                key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                              >
                                {item[row.key]?.firstName
                                  ? `${item[row.key]?.firstName} ${item[row.key]?.lastName}`
                                  : item[row.key]}
                              </td>
                            );
                          case 'guardian':
                            return (
                              <td className="tw-py-xl tw-px-3xl" key={`table-row-${item.id}-${row.name}-${itemIndex}`}>
                                <div className="tw-flex tw-space-x-xs">
                                  {item[row.key] &&
                                    item[row.key].map(
                                      (contact: UserContactDto, index: number) =>
                                        contact.role == 'Guardian' && (
                                          <div
                                            className="tw-items-center tw-justify-center tw-cursor-pointer tw-truncate"
                                            key={index}
                                            onClick={() => {
                                              if (contact?.contact?.parentId)
                                                router.push(`/directory/parent/${contact?.contact?.parentId}`);
                                            }}
                                          >
                                            {index < 2 ? (
                                              <UserBadge
                                                firstName={contact?.contact?.firstName!}
                                                lastName={contact?.contact?.lastName!}
                                              />
                                            ) : index === 2 ? (
                                              <div className="tw-flex tw-items-center tw-justify-center tw-w-[37px] tw-h-[28px] tw-rounded-full tw-border tw-border-solid tw-border-secondary tw-bg-secondary tw-text-sm-medium tw-text-secondary">
                                                +{item[row.key].length - 2}
                                              </div>
                                            ) : null}
                                          </div>
                                        )
                                    )}
                                </div>
                              </td>
                            );
                          case 'box_status':
                            return (
                              <td
                                className="tw-py-xl tw-px-3xl last:tw-pr-4xl"
                                key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                              >
                                {getAttendanceStatus(item.id)}
                              </td>
                            );
                        }
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
