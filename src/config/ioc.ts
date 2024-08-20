import { Container } from "inversify";
import { TYPES } from "./types";

import IHttpService from "@/services/interfaces/IHttpService";
import IAccountService from "@/services/interfaces/IAccountService";
import ICountryService from "@/services/interfaces/ICountryService";
import IStateService from "@/services/interfaces/IStateService";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import IUserService from "@/services/interfaces/IUserService";
import IErrorHandlerService from "@/services/interfaces/IErrorHandlerService";
import IOrganizationService from "@/services/interfaces/IOrganizationService";
import IJobTitleService from "@/services/interfaces/IJobTitleService";
import ILevelService from "@/services/interfaces/ILevelService";
import ISemesterService from "@/services/interfaces/ISemesterService";
import IHolidayTypeService from "@/services/interfaces/IHolidayTypeService";
import INotificationUrgencyService from "@/services/interfaces/INotificationUrgencyService";
import IAreaService from "@/services/interfaces/IAreaService";
import ITopicService from "@/services/interfaces/ITopicService";
import ILessonService from "@/services/interfaces/ILessonService";
import ISepAreaService from "@/services/interfaces/ISepAreaService";
import ISepLevelService from "@/services/interfaces/ISepLevelService";
import ISepTopicService from "@/services/interfaces/ISepTopicService";
import IStaffService from "@/services/interfaces/IStaffService";
import IPickupDropOffConfigurationService from "@/services/interfaces/IPickupDropOffConfigurationService";
import IPaymentMethodService from "@/services/interfaces/IPaymentMethodService";
import IOutsidePaymentMethodService from "@/services/interfaces/IOutsidePaymentMethodService";
import ISpecialFeeListService from "@/services/interfaces/ISpecialFeeListService";
import IInvoiceConfigurationService from "@/services/interfaces/IInvoiceConfigurationService";
import IDateTimeService from "@/services/interfaces/IDateTimeService";
import InvoiceConfigurationService from "@/services/InvoiceConfigurationService";
import ISalaryTypeService from "@/services/interfaces/ISalaryTypeService";
import IProgramOptionService from "@/services/interfaces/IProgramOptionService";
import IAdditionalFeesService from "@/services/interfaces/IAdditionalFeesService";
import IPastDueFeesService from "@/services/interfaces/IPastDueFeesService";
import IRegistrationFeesService from "@/services/interfaces/IRegistrationFeesService";
import IClassService from "@/services/interfaces/IClassService";
import IEmploymentFormService from "@/services/interfaces/IEmploymentFormService";
import IEthnicityService from "@/services/interfaces/IEthnicityService";
import IDegreeService from "@/services/interfaces/IDegreeService";
import ICertificateService from "@/services/interfaces/ICertificateService";
import IBankAccountTypeService from "@/services/interfaces/IBankAccountTypeService";
import IStaffDegreeService from "@/services/interfaces/IStaffDegreeService";
import IStaffCertificationService from "@/services/interfaces/IStaffCertificationService";
import IStaffEmergencyContactService from "@/services/interfaces/IStaffEmergencyContactService";
import IStaffReferenceService from "@/services/interfaces/IStaffReferenceService";
import IStaffProfessionalDevelopmentService from "@/services/interfaces/IStaffProfessionalDevelopmentService";
import IStaffEmploymentHistoryService from "@/services/interfaces/IStaffEmploymentHistoryService";
import ITermsAndPolicyService from "@/services/interfaces/ITermsAndPolicyService";
import IParentService from "@/services/interfaces/IParentService";
import IStudentFormService from "@/services/interfaces/IStudentFormService";
import IEmailSettingService from "@/services/interfaces/IEmailSettingService";
import IStudentQuestionService from "@/services/interfaces/IStudentQuestionService";
import IEmailTemplateService from "@/services/interfaces/IEmailTemplateService";
import IStudentAllergyService from "@/services/interfaces/IStudentAllergyService";
import IStudentDentistService from "@/services/interfaces/IStudentDentistService";
import IStudentImmunizationService from "@/services/interfaces/IStudentImmunizationService";
import IStudentPhysicianService from "@/services/interfaces/IStudentPhysicianService";
import IStudentService from "@/services/interfaces/IStudentService";
import IStudentConsentAndQuestionForm from "@/services/interfaces/IStudentConsentAndQuestionForm";
import IPickupDropOffParentService from "@/services/interfaces/IPickupDropOffParentService";
import IPickUpDropOffStudentWiseService from "@/services/interfaces/IPickUpDropOffStudentWiseService";
import IPerformanceEvaluationSettingService from "@/services/interfaces/IPerformanceEvaluationSettingService";
import IPerformanceEvaluationQuestionService from "@/services/interfaces/IPerformanceEvaluationQuestionService";
import IStaffPerformanceEvaluationService from "@/services/interfaces/IStaffPerformanceEvaluationService";
import IReportService from "@/services/interfaces/IReportService";
import IClassAssignmentService from "@/services/interfaces/IClassAssignmentService";
import IStaffSchedulingService from "@/services/interfaces/IStaffSchedulingService";
import IStaffTimeTrackingService from "@/services/interfaces/IStaffTimeTracking";
import IClassAttendanceService from "@/services/interfaces/IClassAttendanceService";
import ILessonAssignmentService from "@/services/interfaces/ILessonAssignmentService";
import ISEPAssessmentService from "@/services/interfaces/ISEPAssessmentService";
import IParentBabyLogService from "@/services/interfaces/IParentBabyLogService";
import IRecordKeepingService from "@/services/interfaces/IRecordKeepingService";
import IHolidayService from "@/services/interfaces/IHolidayService";
import IDirectoryService from "@/services/interfaces/IDirectoryService";
import IEventService from "@/services/interfaces/IEventService";
import IPaymentConfigurationService from "@/services/interfaces/IPaymentConfigurationService";
import ICurrencyCodeService from "@/services/interfaces/ICurrencyCodeService";
import ISavedCardOrAchSrvice from "@/services/interfaces/ISavedCardOrAchSrvice";
import IInvoiceService from "@/services/interfaces/IInvoiceService";
import IRoleManagementService from "@/services/interfaces/IRoleManagementService";
import IDocuSignService from "@/services/interfaces/IDocuSignService";

import IRecurringInvoiceItemService from "@/services/interfaces/IRecurringInvoiceItemService";

import HttpService from "@/services/HttpService";
import AccountService from "@/services/AccountService";
import UnitOfService from "@/services/UnitOfService";
import UserService from "@/services/UserService";
import CountryService from "@/services/CountryService";
import StateService from "@/services/StateService";
import ErrorHandlerService from "@/services/ErrorHandlerService";
import OrganizationService from "@/services/OrganizationService";
import JobTitleService from "@/services/JobTitleService";
import LevelService from "@/services/LevelService";
import SemesterService from "@/services/SemesterService";
import HolidayTypeService from "@/services/HolidayTypeService";
import NotificationUrgencyService from "@/services/NotificationUrgencyService";
import AreaService from "@/services/AreaService";
import TopicService from "@/services/TopicService";
import LessonService from "@/services/LessonService";
import SepAreaService from "@/services/SepAreaService";
import SepLevelService from "@/services/SepLevelService";
import SepTopicService from "@/services/SepTopicService";
import StaffService from "@/services/StaffService";
import PickupDropOffConfigurationService from "@/services/PickupDropOffConfigurationService";
import PaymentMethodService from "@/services/PaymentMethodService";
import OutsidePaymentMethodService from "@/services/OutsidePaymentMethodService";
import IUserRoleService from "@/services/interfaces/IUserRoleService";
import UserRoleService from "@/services/UserRoleService";
import DateTimeService from "@/services/DateTimeService";
import SpecialFeeListService from "@/services/SpecialFeeListService";
import SalaryTypeService from "@/services/SalaryTypeService";
import ProgramOptionService from "@/services/ProgramOptionService";
import AdditionalFeesService from "@/services/AdditionalFeesService";
import PastDueFeesService from "@/services/PastDueFeesService";
import RegistrationFeesService from "@/services/RegistrationFeesService";
import ClassService from "@/services/ClassService";
import EmploymentFormService from "@/services/EmploymentFormService";
import EthnicityService from "@/services/EthnicityService";
import DegreeService from "@/services/DegreeService";
import CertificateService from "@/services/CertificateService";
import BankAccountTypeService from "@/services/BankAccountTypeService";
import StaffDegreeService from "@/services/StaffDegreeService";
import StaffCertificationService from "@/services/StaffCertificationService";
import StaffEmergencyContactService from "@/services/StaffEmergencyContactService";
import StaffReferenceService from "@/services/StaffReferenceService";
import StaffProfessionalDevelopmentService from "@/services/StaffProfessionalDevelopmentService";
import StaffEmploymentHistoryService from "@/services/StaffEmploymentHistoryService";
import TermsAndPolicyService from "@/services/TermsAndPolicyService";
import ParentService from "@/services/ParentService";
import StudentFormService from "@/services/StudentFormService";
import EmailSettingService from "@/services/EmailSettingService";
import StudentQuestionService from "@/services/StudentQuestionService";
import EmailTemplateService from "@/services/EmailTemplateService";
import StudentAllergyService from "@/services/StudentAllergyService";
import StudentDentistService from "@/services/StudentDentistService";
import StudentImmunizationService from "@/services/StudentImmunizationService";
import StudentPhysicianService from "@/services/StudentPhysicianService";
import StudentService from "@/services/StudentService";
import StudentConsentAndQuestionForm from "@/services/StudentConsentAndQuestionForm";
import PickupDropoffParentService from "@/services/PickupDropoffParentService";
import PerformanceEvaluationSettingService from "@/services/PerformanceEvaluationSettingService";
import PerformanceEvaluationQuestionService from "@/services/PerformanceEvaluationQuestionService";
import StaffPerformanceEvaluationService from "@/services/StaffPerformanceEvaluationService";
import PickUpDropOffStudentWiseService from "@/services/PickUpDropOffStudentWiseService";
import ReportService from "@/services/ReportService";
import ClassAssignmentService from "@/services/ClassAssignmentService";
import StaffSchedulingService from "@/services/StaffSchedulingService";
import StaffTimeTrackingService from "@/services/StaffTimeTrackingService";
import ClassAttendanceService from "@/services/ClassAttendanceService";
import LessonAssignmentService from "@/services/LessonAssignmentService";
import ParentBabyLogService from "@/services/ParentBabyLogService";
import SEPAssessmentService from "@/services/SEPAssessmentService";
import RecordKeepingService from "@/services/RecordKeepingService";
import HolidayService from "@/services/HolidayService";
import DirectoryService from "@/services/DirectoryService";
import EventService from "@/services/EventService";
import PaymentConfigurationService from "@/services/PaymentConfigurationService";
import CurrencyCodeService from "@/services/CurrencyCodeService";
import SavedCardOrAchSrvice from "@/services/SavedCardOrAchSrvice";
import InvoiceService from "@/services/InvoiceService";
import RoleManagementService from "@/services/RoleManagementService";
import DocuSignService from "@/services/DocuSignService";
import RecurringInvoiceItemService from "@/services/RecurringInvoiceItemService";
import IParentInviteService from "@/services/interfaces/IParentInviteService";
import ParentInviteService from "@/services/ParentInviteService";

const container = new Container();

container.bind<IHttpService>(TYPES.IHttpService).to(HttpService);
container.bind<IAccountService>(TYPES.IAccountService).to(AccountService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<ICountryService>(TYPES.ICountryService).to(CountryService);
container.bind<IStateService>(TYPES.IStateService).to(StateService);
container
  .bind<IErrorHandlerService>(TYPES.IErrorHandlerService)
  .to(ErrorHandlerService);
container
  .bind<IOrganizationService>(TYPES.IOrganizationService)
  .to(OrganizationService);
container.bind<IJobTitleService>(TYPES.IJobTitleService).to(JobTitleService);
container.bind<ILevelService>(TYPES.ILevelService).to(LevelService);
container.bind<ISemesterService>(TYPES.ISemesterService).to(SemesterService);
container
  .bind<IHolidayTypeService>(TYPES.IHolidayTypeService)
  .to(HolidayTypeService);
container
  .bind<INotificationUrgencyService>(TYPES.INotificationUrgencyService)
  .to(NotificationUrgencyService);
container.bind<IAreaService>(TYPES.IAreaService).to(AreaService);
container.bind<ITopicService>(TYPES.ITopicService).to(TopicService);
container.bind<ILessonService>(TYPES.ILessonService).to(LessonService);
container.bind<ISepAreaService>(TYPES.ISepAreaService).to(SepAreaService);
container.bind<ISepLevelService>(TYPES.ISepLevelService).to(SepLevelService);
container.bind<ISepTopicService>(TYPES.ISepTopicService).to(SepTopicService);
container.bind<IStaffService>(TYPES.IStaffService).to(StaffService);
container
  .bind<IPickupDropOffConfigurationService>(
    TYPES.IPickupDropOffConfigurationService
  )
  .to(PickupDropOffConfigurationService);
container.bind<IUserRoleService>(TYPES.IUserRoleService).to(UserRoleService);

container
  .bind<IPaymentMethodService>(TYPES.IPaymentMethodService)
  .to(PaymentMethodService);
container
  .bind<IOutsidePaymentMethodService>(TYPES.IOutsidePaymentMethodService)
  .to(OutsidePaymentMethodService);
container.bind<IDateTimeService>(TYPES.IDateTimeService).to(DateTimeService);
container
  .bind<ISpecialFeeListService>(TYPES.ISpecialFeeListService)
  .to(SpecialFeeListService);
container
  .bind<IInvoiceConfigurationService>(TYPES.IInvoiceConfigurationService)
  .to(InvoiceConfigurationService);
container
  .bind<ISalaryTypeService>(TYPES.ISalaryTypeService)
  .to(SalaryTypeService);
container
  .bind<IProgramOptionService>(TYPES.IProgramOptionService)
  .to(ProgramOptionService);
container
  .bind<IAdditionalFeesService>(TYPES.IAdditionalFeesService)
  .to(AdditionalFeesService);
container
  .bind<IPastDueFeesService>(TYPES.IPastDueFeesService)
  .to(PastDueFeesService);
container
  .bind<IRegistrationFeesService>(TYPES.IRegistrationFeesService)
  .to(RegistrationFeesService);
container.bind<IClassService>(TYPES.IClassService).to(ClassService);
container
  .bind<IEmploymentFormService>(TYPES.IEmploymentFormService)
  .to(EmploymentFormService);
container.bind<IEthnicityService>(TYPES.IEthnicityService).to(EthnicityService);
container.bind<IDegreeService>(TYPES.IDegreeService).to(DegreeService);
container
  .bind<ICertificateService>(TYPES.ICertificateService)
  .to(CertificateService);
container
  .bind<IBankAccountTypeService>(TYPES.IBankAccountTypeService)
  .to(BankAccountTypeService);
container
  .bind<IStaffDegreeService>(TYPES.IStaffDegreeService)
  .to(StaffDegreeService);
container
  .bind<IStaffCertificationService>(TYPES.IStaffCertificationService)
  .to(StaffCertificationService);
container
  .bind<IStaffEmergencyContactService>(TYPES.IStaffEmergencyContactService)
  .to(StaffEmergencyContactService);
container
  .bind<IStaffReferenceService>(TYPES.IStaffReferenceService)
  .to(StaffReferenceService);
container
  .bind<IStaffProfessionalDevelopmentService>(
    TYPES.IStaffProfessionalDevelopmentService
  )
  .to(StaffProfessionalDevelopmentService);
container
  .bind<IStaffEmploymentHistoryService>(TYPES.IStaffEmploymentHistoryService)
  .to(StaffEmploymentHistoryService);
container
  .bind<ITermsAndPolicyService>(TYPES.ITermsAndPolicyService)
  .to(TermsAndPolicyService);
container.bind<IParentService>(TYPES.IParentService).to(ParentService);
container
  .bind<IStudentFormService>(TYPES.IStudentFormService)
  .to(StudentFormService);
container
  .bind<IEmailSettingService>(TYPES.IEmailSettingService)
  .to(EmailSettingService);
container
  .bind<IStudentQuestionService>(TYPES.IStudentQuestionService)
  .to(StudentQuestionService);
container
  .bind<IEmailTemplateService>(TYPES.IEmailTemplateService)
  .to(EmailTemplateService);

container
  .bind<IStudentAllergyService>(TYPES.IStudentAllergyService)
  .to(StudentAllergyService);
container
  .bind<IStudentDentistService>(TYPES.IStudentDentistService)
  .to(StudentDentistService);
container
  .bind<IStudentImmunizationService>(TYPES.IStudentImmunizationService)
  .to(StudentImmunizationService);
container
  .bind<IStudentPhysicianService>(TYPES.IStudentPhysicianService)
  .to(StudentPhysicianService);
container.bind<IStudentService>(TYPES.IStudentService).to(StudentService);
container.bind<IParentInviteService>(TYPES.IParentInviteService).to(ParentInviteService);
container
  .bind<IStudentConsentAndQuestionForm>(TYPES.IStudentConsentAndQuestionForm)
  .to(StudentConsentAndQuestionForm);
container
  .bind<IPickupDropOffParentService>(TYPES.IPickupDropOffParentService)
  .to(PickupDropoffParentService);
container
  .bind<IPerformanceEvaluationSettingService>(
    TYPES.IPerformanceEvaluationSettingService
  )
  .to(PerformanceEvaluationSettingService);
container
  .bind<IPerformanceEvaluationQuestionService>(
    TYPES.IPerformanceEvaluationQuestionService
  )
  .to(PerformanceEvaluationQuestionService);
container
  .bind<IStaffPerformanceEvaluationService>(
    TYPES.IStaffPerformanceEvaluationService
  )
  .to(StaffPerformanceEvaluationService);
container
  .bind<IPickUpDropOffStudentWiseService>(
    TYPES.IPickUpDropOffStudentWiseService
  )
  .to(PickUpDropOffStudentWiseService);

container.bind<IReportService>(TYPES.IReportService).to(ReportService);
container
  .bind<IClassAssignmentService>(TYPES.IClassAssignmentService)
  .to(ClassAssignmentService);
container
  .bind<IStaffSchedulingService>(TYPES.IStaffSchedulingService)
  .to(StaffSchedulingService);
container
  .bind<IStaffTimeTrackingService>(TYPES.IStaffTimeTrackingService)
  .to(StaffTimeTrackingService);

  container.bind<IParentBabyLogService>(TYPES.IParentBabyLogService).to(ParentBabyLogService);

container.bind<IClassAttendanceService>(TYPES.IClassAttendanceService).to(ClassAttendanceService);
container.bind<ILessonAssignmentService>(TYPES.ILessonAssignmentService).to(LessonAssignmentService);
container.bind<ISEPAssessmentService>(TYPES.ISEPAssessmentService).to(SEPAssessmentService);
container.bind<IRecordKeepingService>(TYPES.IRecordKeepingService).to(RecordKeepingService);
container.bind<IHolidayService>(TYPES.IHolidayService).to(HolidayService);
container.bind<IDirectoryService>(TYPES.IDirectoryService).to(DirectoryService);
container.bind<IEventService>(TYPES.IEventService).to(EventService);
container.bind<IPaymentConfigurationService>(TYPES.IPaymentConfigurationService).to(PaymentConfigurationService);
container.bind<ICurrencyCodeService>(TYPES.ICurrencyCodeService).to(CurrencyCodeService);
container.bind<ISavedCardOrAchSrvice>(TYPES.ISavedCardOrAchSrvice).to(SavedCardOrAchSrvice);
container.bind<IInvoiceService>(TYPES.IInvoiceService).to(InvoiceService);
container.bind<IRoleManagementService>(TYPES.IRoleManagementService).to(RoleManagementService);
container.bind<IDocuSignService>(TYPES.IDocuSignService).to(DocuSignService);
container.bind<IRecurringInvoiceItemService>(TYPES.IRecurringInvoiceItemService).to(RecurringInvoiceItemService);

container.bind<IUnitOfService>(TYPES.IUnitOfService).to(UnitOfService);
export { container };
