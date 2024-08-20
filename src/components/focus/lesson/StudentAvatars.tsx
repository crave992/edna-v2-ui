import { useFocusContext } from "@/context/FocusContext";
import { StudentBasicDto } from "@/dtos/StudentDto";
import Image from "next/image";
import { useRouter } from "next/router";

type AvatarProps = {
  student: StudentBasicDto;
}

export default function StudentAvatar({ student }: AvatarProps){
  const { setStudentId } = useFocusContext();
  const router = useRouter();

  const handleSelectedStudent = () => {
    setStudentId(student.id);
    router.push('/focus/student');
  }

  return (
    <div
      className="
        tw-w-[70px]
        tw-h-[78px]
        tw-text-center
        tw-mr-[12px]
        tw-cursor-pointer
      "
      onClick={handleSelectedStudent}
    >
      {
        student.profilePicture ?
          <Image
            className={`
              tw-rounded-full
              tw-mx-auto
            `}
            src={student.profilePicture}
            alt={student.name.split(' ')[0]}
            width={56}
            height={56}
            
          /> : (
            <div className="
              tw-rounded-full
              tw-h-fill
              tw-bg-gray-300
              tw-h-[56px]
              tw-w-[56px]
              tw-text-gray-300
              tw-fill-gray-300
              tw-mx-auto
            "
            />
          )
      }
      <p className={`tw-pt-[5px]`}>{student.name.split(' ')[0]}</p>
    </div>
  );
}