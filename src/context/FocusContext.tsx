import ClassDto from '@/dtos/ClassDto';
import { OrganizationBasicDto } from '@/dtos/OrganizationDto';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';

type CurrentUserRoles = {
  canUpdateLesson: boolean | undefined;
  hasSuperAdminRoles: boolean | undefined;
  hasAccountOwnerRoles: boolean | undefined;
  hasAdminRoles: boolean | undefined;
  isAdmin: boolean | undefined;
  isParent: boolean | undefined;
  isStaff: boolean | undefined;
  isAssociateGuide: boolean | undefined;
  isLeadGuide: boolean | undefined;
  isSpecialist: boolean | undefined;
  isLeadAndAssociate: boolean | undefined; //handles case where staff is both lead and associate in other classes
  staffId: number | null;
  IsNooranaAdmin: boolean | undefined;
};

type FocusContextProps = {
  studentId: number | undefined;
  lessonId: number | undefined;
  areaId: number | undefined;
  topicId: number | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  openLessonOverview: boolean;
  openAddCustomLesson: boolean;
  expanded: boolean;
  currentUserRoles: CurrentUserRoles | undefined;
  organization: OrganizationBasicDto | undefined;
  setStudentId: (studentId: number | undefined) => void;
  setLessonId: (lessonId: number | undefined) => void;
  setAreaId: (areaId: number | undefined) => void;
  setTopicId: Dispatch<SetStateAction<number | undefined>>;
  setClassId: (classId: number | undefined) => void;
  setLevelId: (levelId: number | undefined) => void;
  setOpenLessonOverview: (openLessonOverview: boolean) => void;
  setOpenAddCustomLesson: (openAddCustomLesson: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  setCurrentUserRoles: (currentUserRoles: CurrentUserRoles | undefined) => void;
  setOrganization: (currentUserRoles: OrganizationBasicDto | undefined) => void;
  openAddNoteOrMilestone: string | undefined;
  setOpenAddNoteOrMilestone: (openAddNoteOrMilestone: string | undefined) => void;
  selectedLessonState: string | undefined;
  setSelectedLessonState: (selectedLessonState: string) => void;
  openContextMenu: boolean;
  setOpenContextMenu: (openContextMenu: boolean) => void;
  selectedClass: ClassDto | undefined;
  setSelectedClass: (selectedClass: ClassDto) => void;
  classes: ClassDto[] | [];
  setClasses: (classes: ClassDto[]) => void;
  openProgress: boolean;
  setOpenProgress: (openProgress: boolean) => void;
  openedProgressTopics: string[];
  setOpenedProgressTopics: Function;
  nonFocusLevelId: number | undefined;
  nonFocusAreaId: number | undefined;
  nonFocusTopicId: number | undefined;
  setNonFocusLevelId: (nonFocusLevelId: number | undefined) => void;
  setNonFocusAreaId: (nonFocusAreaId: number | undefined) => void;
  setNonFocusTopicId: (nonFocusTopicId: number | undefined) => void;
};

const FocusContext = createContext<FocusContextProps | undefined>(undefined);

export const useFocusContext = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusContext must be used within a FocusProvider');
  }
  return context;
};

interface FocusProviderProps {
  children: ReactNode;
}

export const FocusProvider: FunctionComponent<FocusProviderProps> = ({ children }): ReactElement => {
  const [studentId, setStudentId] = useState<number | undefined>(undefined);
  const [lessonId, setLessonId] = useState<number | undefined>(undefined);
  const [areaId, setAreaId] = useState<number | undefined>(undefined);
  const [topicId, setTopicId] = useState<number | undefined>(undefined);
  const [classId, setClassId] = useState<number | undefined>(undefined);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);
  const [nonFocusLevelId, setNonFocusLevelId] = useState<number | undefined>(undefined);
  const [nonFocusAreaId, setNonFocusAreaId] = useState<number | undefined>(undefined);
  const [nonFocusTopicId, setNonFocusTopicId] = useState<number | undefined>(undefined);
  const [openLessonOverview, setOpenLessonOverview] = useState<boolean>(false);
  const [openAddCustomLesson, setOpenAddCustomLesson] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [currentUserRoles, setCurrentUserRoles] = useState<CurrentUserRoles | undefined>(undefined);
  const [organization, setOrganization] = useState<OrganizationBasicDto | undefined>(undefined);
  const [openAddNoteOrMilestone, setOpenAddNoteOrMilestone] = useState<string | undefined>(undefined);
  const [selectedLessonState, setSelectedLessonState] = useState<string | undefined>('');
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ClassDto | undefined>(undefined);
  const [classes, setClasses] = useState<ClassDto[] | []>([]);
  const [openProgress, setOpenProgress] = useState<boolean>(false);
  const [openedProgressTopics, setOpenedProgressTopics] = useState<string[]>([]);

  const contextValue = useMemo(
    () => ({
      studentId,
      lessonId,
      areaId,
      topicId,
      classId,
      levelId,
      openLessonOverview,
      openAddCustomLesson,
      expanded,
      currentUserRoles,
      organization,
      openAddNoteOrMilestone,
      selectedLessonState,
      openContextMenu,
      selectedClass,
      classes,
      openProgress,
      openedProgressTopics,
      nonFocusLevelId,
      nonFocusAreaId,
      nonFocusTopicId,
      setStudentId,
      setLessonId,
      setAreaId,
      setTopicId,
      setClassId,
      setLevelId,
      setOpenLessonOverview,
      setExpanded,
      setOpenAddCustomLesson,
      setCurrentUserRoles,
      setOrganization,
      setOpenAddNoteOrMilestone,
      setSelectedLessonState,
      setOpenContextMenu,
      setSelectedClass,
      setClasses,
      setOpenProgress,
      setOpenedProgressTopics,
      setNonFocusLevelId,
      setNonFocusAreaId,
      setNonFocusTopicId,
    }),
    [
      studentId,
      lessonId,
      areaId,
      topicId,
      classId,
      levelId,
      openLessonOverview,
      openAddCustomLesson,
      expanded,
      currentUserRoles,
      openAddNoteOrMilestone,
      selectedLessonState,
      openContextMenu,
      selectedClass,
      classes,
      openProgress,
      openedProgressTopics,
      nonFocusLevelId,
      nonFocusAreaId,
      nonFocusTopicId,
    ]
  );

  return <FocusContext.Provider value={contextValue}>{children}</FocusContext.Provider>;
};
