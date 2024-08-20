import { InputHTMLAttributes, useState } from 'react';
import ClassAttendanceDto from '@/dtos/ClassAttendanceDto';
import StudentAvatar from '@/components/focus/student/StudentAvatar';
import StatusDot from '@/components/svg/StatusDot';

interface StudentUpdateData {
  classId: number;
  studentId: number;
  attendanceDate: string;
  presenceType: string;
  action: string;
  isTardy: boolean;
}

interface StudentStatus extends InputHTMLAttributes<HTMLInputElement> {
  attendant: ClassAttendanceDto;
  classId: number;
  studentsToSave: Array<StudentUpdateData>;
  setStudentsToSave: Function;
  handleSave?: Function;
}

export default function StudentStatus({
  attendant,
  classId,
  studentsToSave,
  setStudentsToSave,
  handleSave,
}: StudentStatus) {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const getStatus = (attendant: any) => {
    const found = findStudent(attendant);
    const student = found !== -1 ? studentsToSave[found] : attendant;
    if (!student.isTardy && (student.presentOrAbsent === '' || student.presenceType === '')) {
      return 'Set Status';
    } else if ((student.presentOrAbsent === 'Present' || student.presenceType === 'Present') && !student.isTardy) {
      return 'Present';
    } else if (student.presentOrAbsent === 'Excuse_Absent' || student.presenceType === 'Excuse_Absent') {
      return 'Excused';
    } else if (student.presentOrAbsent === 'Unexcused_Absent' || student.presenceType === 'Unexcused_Absent') {
      return 'Unexcused';
    } else if (student.presentOrAbsent === 'Released' || student.presenceType === 'Released') {
      return 'Released';
    } else if (student.isTardy) {
      return 'Tardy';
    }
  };

  const findStudent = (attendant: ClassAttendanceDto) => {
    return studentsToSave.findIndex((el) => el.studentId === attendant.studentId);
  };

  const changeStatus = async (attendant: ClassAttendanceDto) => {
    let isTardy = false;
    let presenceType = 'Present';
    let action = 'present_absent';
    const found = studentsToSave.findIndex((el) => el.studentId === attendant.studentId);
    let student = found !== -1 ? studentsToSave[found] : attendant;
    let students: any = studentsToSave.length < 1 ? [] : JSON.parse(JSON.stringify(studentsToSave));

    switch (getStatus(student)) {
      case 'Present':
        isTardy = true;
        presenceType = 'Present';
        action = 'tardy';
        break;
      case 'Tardy':
        isTardy = false;
        presenceType = 'Unexcused_Absent';
        break;
      case 'Unexcused':
        isTardy = false;
        presenceType = 'Excuse_Absent';
        break;
      case 'Excused':
        isTardy = false;
        presenceType = 'Released';
        break;
      case 'Released':
        isTardy = false;
        break;
    }

    //pass a blank attendance date so the api will save the current date time.
    var params = {
      classId,
      studentId: student.studentId,
      attendanceDate: '',
      presenceType,
      action,
      isTardy,
    };

    if (found === -1) {
      students.push(params);
      await setStudentsToSave(students);
    } else {
      students[found] = params;
      await setStudentsToSave(students);
    }

    if (handleSave) handleSave(students);
  };

  const getStatusColor = (attendant: ClassAttendanceDto) => {
    switch (getStatus(attendant)) {
      case 'Present':
        return 'success';
      case 'Tardy':
        return 'warning';
      case 'Excused':
        return 'error';
      case 'Unexcused':
        return 'error';
      case 'Released':
        return 'brand';
      default:
        return 'error';
    }
  };

  return (
    <div className="tw-pt-8 tw-pb-8 tw-border-0 tw-border-b tw-border-secondary tw-border-solid">
      <div
        className="tw-cursor-pointer tw-flex tw-direction-row tw-justify-between tw-items-center"
        key={attendant.studentId}
      >
        <div className="tw-no-underline !tw-text-secondary tw-min-w-0">
          <StudentAvatar
            key={attendant.studentId}
            attendant={attendant}
            student={undefined}
            selected={false}
            setSelected={() => setSelectedStudent(attendant.studentId)}
            direction="row"
            photoSize={40}
          />
        </div>
        <button
          className={`tw-rounded-md tw-border-secondary tw-border tw-shadow-sm tw-border-solid tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center hover:tw-bg-primary-hover
          ${getStatus(attendant) !== 'Set Status' ? 'tw-bg-secondary tw-w-[146px] tw-px-4' : 'tw-bg-white tw-w-[94px]'}
          `}
          onClick={() => changeStatus(attendant)}
        >
          {getStatus(attendant) !== 'Set Status' && (
            <div className="tw-py-md tw-pr-xl tw-border-0 tw-border-r tw-border-solid tw-border-secondary tw-w-[26px]">
              <StatusDot fill={getStatusColor(attendant)} />
            </div>
          )}
          <div className={`tw-grow ${getStatus(attendant) !== 'Set Status' ? 'tw-pl-xl' : 'tw-py-md tw-px-md'}`}>
            {getStatus(attendant)}
          </div>
        </button>
      </div>
    </div>
  );
}
