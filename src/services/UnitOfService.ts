import { TYPES } from "@/config/types";
import { container } from "@/config/ioc";
import { injectable } from "inversify";
import IHttpService from "./interfaces/IHttpService";
import IUnitOfService from "./interfaces/IUnitOfService";
import IAccountService from "./interfaces/IAccountService";
import IUserService from "./interfaces/IUserService";
import ICountryService from "./interfaces/ICountryService";
import IStateService from "./interfaces/IStateService";
import IErrorHandlerService from "./interfaces/IErrorHandlerService";
import IOrganizationService from "./interfaces/IOrganizationService";
import IJobTitleService from "./interfaces/IJobTitleService";
import ILevelService from "./interfaces/ILevelService";
import ISemesterService from "./interfaces/ISemesterService";
import IHolidayTypeService from "./interfaces/IHolidayTypeService";
import INotificationUrgencyService from "./interfaces/INotificationUrgencyService";
import IAreaService from "./interfaces/IAreaService";
import ITopicService from "./interfaces/ITopicService";
import ILessonService from "./interfaces/ILessonService";
import ISepAreaService from "./interfaces/ISepAreaService";
import ISepLevelService from "./interfaces/ISepLevelService";
import ISepTopicService from "./interfaces/ISepTopicService";
import IStaffService from "./interfaces/IStaffService";
import IPickupDropOffConfigurationService from "./interfaces/IPickupDropOffConfigurationService";
import IUserRoleService from "./interfaces/IUserRoleService";
import IPaymentMethodService from "./interfaces/IPaymentMethodService";
import IOutsidePaymentMethodService from "./interfaces/IOutsidePaymentMethodService";
import IDateTimeService from "./interfaces/IDateTimeService";
import ISpecialFeeListService from "./interfaces/ISpecialFeeListService";
import IInvoiceConfigurationService from "./interfaces/IInvoiceConfigurationService";
import ISalaryTypeService from "./interfaces/ISalaryTypeService";
import IProgramOptionService from "./interfaces/IProgramOptionService";
import IAdditionalFeesService from "./interfaces/IAdditionalFeesService";
import IPastDueFeesService from "./interfaces/IPastDueFeesService";
import IRegistrationFeesService from "./interfaces/IRegistrationFeesService";
import IClassService from "./interfaces/IClassService";
import IEmploymentFormService from "./interfaces/IEmploymentFormService";
import IEthnicityService from "./interfaces/IEthnicityService";
import IDegreeService from "./interfaces/IDegreeService";
import ICertificateService from "./interfaces/ICertificateService";
import IBankAccountTypeService from "./interfaces/IBankAccountTypeService";
import IStaffDegreeService from "./interfaces/IStaffDegreeService";
import IStaffCertificationService from "./interfaces/IStaffCertificationService";
import IStaffEmergencyContactService from "./interfaces/IStaffEmergencyContactService";
import IStaffReferenceService from "./interfaces/IStaffReferenceService";
import IStaffProfessionalDevelopmentService from "./interfaces/IStaffProfessionalDevelopmentService";
import IStaffEmploymentHistoryService from "./interfaces/IStaffEmploymentHistoryService";
import ITermsAndPolicyService from "./interfaces/ITermsAndPolicyService";
import IParentService from "./interfaces/IParentService";
import IStudentFormService from "./interfaces/IStudentFormService";
import IEmailSettingService from "./interfaces/IEmailSettingService";
import IStudentQuestionService from "./interfaces/IStudentQuestionService";
import IEmailTemplateService from "./interfaces/IEmailTemplateService";
import IStudentAllergyService from "./interfaces/IStudentAllergyService";
import IStudentDentistService from "./interfaces/IStudentDentistService";
import IStudentImmunizationService from "./interfaces/IStudentImmunizationService";
import IStudentPhysicianService from "./interfaces/IStudentPhysicianService";
import IStudentService from "./interfaces/IStudentService";
import IStudentConsentAndQuestionForm from "./interfaces/IStudentConsentAndQuestionForm";
import IPickupDropOffParentService from "./interfaces/IPickupDropOffParentService";
import IPerformanceEvaluationSettingService from "./interfaces/IPerformanceEvaluationSettingService";
import IPerformanceEvaluationQuestionService from "./interfaces/IPerformanceEvaluationQuestionService";
import IStaffPerformanceEvaluationService from "./interfaces/IStaffPerformanceEvaluationService";
import IPickUpDropOffStudentWiseService from "./interfaces/IPickUpDropOffStudentWiseService";
import IReportService from "./interfaces/IReportService";
import IClassAssignmentService from "./interfaces/IClassAssignmentService";
import IStaffSchedulingService from "./interfaces/IStaffSchedulingService";
import IStaffTimeTrackingService from "./interfaces/IStaffTimeTracking";
import IClassAttendanceService from "./interfaces/IClassAttendanceService";
import ILessonAssignmentService from "./interfaces/ILessonAssignmentService";
import ISEPAssessmentService from "./interfaces/ISEPAssessmentService";
import IParentBabyLogService from "./interfaces/IParentBabyLogService";
import IRecordKeepingService from "./interfaces/IRecordKeepingService";
import IHolidayService from "./interfaces/IHolidayService";
import IDirectoryService from "./interfaces/IDirectoryService";
import IEventService from "./interfaces/IEventService";
import IPaymentConfigurationService from "./interfaces/IPaymentConfigurationService";
import ICurrencyCodeService from "./interfaces/ICurrencyCodeService";
import ISavedCardOrAchSrvice from "./interfaces/ISavedCardOrAchSrvice";
import IInvoiceService from "./interfaces/IInvoiceService";
import IRoleManagementService from "./interfaces/IRoleManagementService";
import IDocuSignService from "./interfaces/IDocuSignService";
import IRecurringInvoiceItemService from "./interfaces/IRecurringInvoiceItemService";
import IParentInviteService from "./interfaces/IParentInviteService";

@injectable()
export default class UnitOfService implements IUnitOfService {
  public HttpService: IHttpService;
  public AccountService: IAccountService;
  public UserService: IUserService;
  public CountryService: ICountryService;
  public StateService: IStateService;
  public ErrorHandlerService: IErrorHandlerService;
  public OrganizationService: IOrganizationService;
  public JobTitleService: IJobTitleService;
  public LevelService: ILevelService;
  public SemesterService: ISemesterService;
  public HolidayTypeService: IHolidayTypeService;
  public NotificationUrgencyService: INotificationUrgencyService;
  public AreaService: IAreaService;
  public TopicService: ITopicService;
  public LessonService: ILessonService;
  public SepAreaService: ISepAreaService;
  public SepLevelService: ISepLevelService;
  public SepTopicService: ISepTopicService;
  public StaffService: IStaffService;
  public PickupDropOffConfigurationService: IPickupDropOffConfigurationService;
  public UserRoleService: IUserRoleService;
  public PaymentMethodService: IPaymentMethodService;
  public OutsidePaymentMethodService: IOutsidePaymentMethodService;
  public DateTimeService: IDateTimeService;
  public SpecialFeeListService: ISpecialFeeListService;
  public InvoiceConfigurationService: IInvoiceConfigurationService;
  public SalaryTypeService: ISalaryTypeService;
  public ProgramOptionService: IProgramOptionService;
  public AdditionalFeesService: IAdditionalFeesService;
  public PastDueFeesService: IPastDueFeesService;
  public RegistrationFeesService: IRegistrationFeesService;
  public ClassService: IClassService;
  public EmploymentFormService: IEmploymentFormService;
  public EthnicityService: IEthnicityService;
  public DegreeService: IDegreeService;
  public CertificateService: ICertificateService;
  public BankAccountTypeService: IBankAccountTypeService;
  public StaffDegreeService: IStaffDegreeService;
  public StaffCertificationService: IStaffCertificationService;
  public StaffEmergencyContactService: IStaffEmergencyContactService;
  public StaffReferenceService: IStaffReferenceService;
  public StaffProfessionalDevelopmentService: IStaffProfessionalDevelopmentService;
  public StaffEmploymentHistoryService: IStaffEmploymentHistoryService;
  public TermsAndPolicyService: ITermsAndPolicyService;
  public ParentService: IParentService;
  public StudentFormService: IStudentFormService;
  public EmailSettingService: IEmailSettingService;
  public StudentQuestionService: IStudentQuestionService;
  public EmailTemplateService: IEmailTemplateService;
  public StudentAllergyService: IStudentAllergyService;
  public StudentDentistService: IStudentDentistService;
  public StudentImmunizationService: IStudentImmunizationService;
  public StudentPhysicianService: IStudentPhysicianService;
  public StudentService: IStudentService;
  public ParentInviteService: IParentInviteService;
  public StudentConsentAndQuestionForm: IStudentConsentAndQuestionForm;
  public PickupDropoffParentService: IPickupDropOffParentService;
  public PerformanceEvaluationSettingService: IPerformanceEvaluationSettingService;
  public PerformanceEvaluationQuestionService: IPerformanceEvaluationQuestionService;
  public StaffPerformanceEvaluationService: IStaffPerformanceEvaluationService;
  public PickUpDropOffStudentWiseService: IPickUpDropOffStudentWiseService;
  public ReportService: IReportService;
  public ClassAssignmentService: IClassAssignmentService;
  public StaffSchedulingService: IStaffSchedulingService;
  public StaffTimeTrackingService: IStaffTimeTrackingService;
  public ClassAttendanceService: IClassAttendanceService;
  public LessonAssignmentService: ILessonAssignmentService;
  public SEPAssessmentService: ISEPAssessmentService;
  public ParentBabyLogService: IParentBabyLogService;
  public RecordKeepingService: IRecordKeepingService;
  public HolidayService: IHolidayService;
  public DirectoryService: IDirectoryService;
  public EventService: IEventService;
  public PaymentConfigurationService: IPaymentConfigurationService;
  public CurrencyCodeService: ICurrencyCodeService;
  public SavedCardOrAchSrvice: ISavedCardOrAchSrvice;
  public InvoiceService: IInvoiceService;
  public RoleManagementService: IRoleManagementService;
  public DocuSignService: IDocuSignService;  public RecurringInvoiceItemService: IRecurringInvoiceItemService;

  constructor(
    httpService = container.get<IHttpService>(TYPES.IHttpService),
    accountService = container.get<IAccountService>(TYPES.IAccountService),
    userService = container.get<IUserService>(TYPES.IUserService),
    countryService = container.get<ICountryService>(TYPES.ICountryService),
    stateService = container.get<IStateService>(TYPES.IStateService),
    errorHandlerService = container.get<IErrorHandlerService>(
      TYPES.IErrorHandlerService
    ),
    organizationService = container.get<IOrganizationService>(
      TYPES.IOrganizationService
    ),
    jobTitleService = container.get<IJobTitleService>(TYPES.IJobTitleService),
    levelService = container.get<ILevelService>(TYPES.ILevelService),
    semesterService = container.get<ISemesterService>(TYPES.ISemesterService),
    holidayTypeService = container.get<IHolidayTypeService>(
      TYPES.IHolidayTypeService
    ),
    notificationUrgencyService = container.get<INotificationUrgencyService>(
      TYPES.INotificationUrgencyService
    ),
    areaService = container.get<IAreaService>(TYPES.IAreaService),
    topicService = container.get<ITopicService>(TYPES.ITopicService),
    lessonService = container.get<ILessonService>(TYPES.ILessonService),
    sepAreaService = container.get<ISepAreaService>(TYPES.ISepAreaService),
    sepLevelService = container.get<ISepLevelService>(TYPES.ISepLevelService),
    sepTopicService = container.get<ISepTopicService>(TYPES.ISepTopicService),
    staffService = container.get<IStaffService>(TYPES.IStaffService),
    pickupDropOffConfiguration = container.get<IPickupDropOffConfigurationService>(
      TYPES.IPickupDropOffConfigurationService
    ),
    paymentMethodService = container.get<IPaymentMethodService>(
      TYPES.IPaymentMethodService
    ),
    userRoleService = container.get<IUserRoleService>(TYPES.IUserRoleService),
    outsidePaymentMethodService = container.get<IOutsidePaymentMethodService>(
      TYPES.IOutsidePaymentMethodService
    ),
    dateTimeService = container.get<IDateTimeService>(TYPES.IDateTimeService),
    specialFeeListService = container.get<ISpecialFeeListService>(
      TYPES.ISpecialFeeListService
    ),
    invoiceConfigurationService = container.get<IInvoiceConfigurationService>(
      TYPES.IInvoiceConfigurationService
    ),
    salaryTypeService = container.get<ISalaryTypeService>(
      TYPES.ISalaryTypeService
    ),
    programOptionService = container.get<IProgramOptionService>(
      TYPES.IProgramOptionService
    ),
    additionalFeesService = container.get<IAdditionalFeesService>(
      TYPES.IAdditionalFeesService
    ),
    pastDueFeesService = container.get<IPastDueFeesService>(
      TYPES.IPastDueFeesService
    ),
    registrationFeesService = container.get<IRegistrationFeesService>(
      TYPES.IRegistrationFeesService
    ),
    classService = container.get<IClassService>(TYPES.IClassService),
    employmentFormService = container.get<IEmploymentFormService>(
      TYPES.IEmploymentFormService
    ),
    ethnicityService = container.get<IEthnicityService>(
      TYPES.IEthnicityService
    ),
    degreeService = container.get<IDegreeService>(TYPES.IDegreeService),
    certificateService = container.get<ICertificateService>(
      TYPES.ICertificateService
    ),
    bankAccountTypeService = container.get<IBankAccountTypeService>(
      TYPES.IBankAccountTypeService
    ),
    staffDegreeService = container.get<IStaffDegreeService>(
      TYPES.IStaffDegreeService
    ),
    staffCertificationService = container.get<IStaffCertificationService>(
      TYPES.IStaffCertificationService
    ),
    staffEmergencyContactService = container.get<IStaffEmergencyContactService>(
      TYPES.IStaffEmergencyContactService
    ),
    staffReferenceService = container.get<IStaffReferenceService>(
      TYPES.IStaffReferenceService
    ),
    staffProfessionalDevelopmentService = container.get<IStaffProfessionalDevelopmentService>(
      TYPES.IStaffProfessionalDevelopmentService
    ),
    staffEmploymentHistoryService = container.get<IStaffEmploymentHistoryService>(
      TYPES.IStaffEmploymentHistoryService
    ),
    termsAndPolicyService = container.get<ITermsAndPolicyService>(
      TYPES.ITermsAndPolicyService
    ),
    parentService = container.get<IParentService>(TYPES.IParentService),
    studentFormService = container.get<IStudentFormService>(
      TYPES.IStudentFormService
    ),
    emailSettingService = container.get<IEmailSettingService>(
      TYPES.IEmailSettingService
    ),
    studentQuestionService = container.get<IStudentQuestionService>(
      TYPES.IStudentQuestionService
    ),
    emailTemplateService = container.get<IEmailTemplateService>(
      TYPES.IEmailTemplateService
    ),
    studentAllergyService = container.get<IStudentAllergyService>(
      TYPES.IStudentAllergyService
    ),
    studentDentistService = container.get<IStudentDentistService>(
      TYPES.IStudentDentistService
    ),
    studentImmunizationService = container.get<IStudentImmunizationService>(
      TYPES.IStudentImmunizationService
    ),
    studentPhysicianService = container.get<IStudentPhysicianService>(
      TYPES.IStudentPhysicianService
    ),
    studentService = container.get<IStudentService>(TYPES.IStudentService),
    parentInviteService = container.get<IParentInviteService>(TYPES.IParentInviteService),
    studentConsentAndQuestionForm = container.get<IStudentConsentAndQuestionForm>(
      TYPES.IStudentConsentAndQuestionForm
    ),
    pickupDropoffParentService = container.get<IPickupDropOffParentService>(
      TYPES.IPickupDropOffParentService
    ),
    performanceEvaluationSettingService = container.get<IPerformanceEvaluationSettingService>(
      TYPES.IPerformanceEvaluationSettingService
    ),
    performanceEvaluationQuestionService = container.get<IPerformanceEvaluationQuestionService>(
      TYPES.IPerformanceEvaluationQuestionService
    ),
    staffPerformanceEvaluationService = container.get<IStaffPerformanceEvaluationService>(
      TYPES.IStaffPerformanceEvaluationService
    ),
    pickUpDropOffStudentWiseService = container.get<IPickUpDropOffStudentWiseService>(
      TYPES.IPickUpDropOffStudentWiseService
    ),
    reportService = container.get<IReportService>(TYPES.IReportService),
    classAssignmentService = container.get<IClassAssignmentService>(
      TYPES.IClassAssignmentService
    ),
    staffSchedulingService = container.get<IStaffSchedulingService>(
      TYPES.IStaffSchedulingService
    ),
    staffTimeTrackingService = container.get<IStaffTimeTrackingService>(
      TYPES.IStaffTimeTrackingService
    ),
    classAttendanceService = container.get<IClassAttendanceService>(
      TYPES.IClassAttendanceService
    ),
    lessonAssignmentService = container.get<ILessonAssignmentService>(
      TYPES.ILessonAssignmentService
    ),
    sepAssessmentService = container.get<ISEPAssessmentService>(
      TYPES.ISEPAssessmentService
    ),
    parentBabyLogService = container.get<IParentBabyLogService>(
      TYPES.IParentBabyLogService
    ),
    recordKeepingService = container.get<IRecordKeepingService>(
      TYPES.IRecordKeepingService
    ),
    holidayService = container.get<IHolidayService>(
      TYPES.IHolidayService
    ),
    directoryService = container.get<IDirectoryService>(
      TYPES.IDirectoryService
    ),
    eventService = container.get<IEventService>(
      TYPES.IEventService
    ),
    paymentConfigurationService = container.get<IPaymentConfigurationService>(
      TYPES.IPaymentConfigurationService
    ),
    currencyCodeService = container.get<ICurrencyCodeService>(
      TYPES.ICurrencyCodeService
    ),
    savedCardOrAchSrvice = container.get<ISavedCardOrAchSrvice>(
      TYPES.ISavedCardOrAchSrvice
    ),
    invoiceService = container.get<IInvoiceService>(
      TYPES.IInvoiceService
    ),
    roleManagementService = container.get<IRoleManagementService>(
      TYPES.IRoleManagementService
    ),
    docuSignService = container.get<IDocuSignService>(
      TYPES.IDocuSignService
    ),
    recurringInvoiceItemService = container.get<IRecurringInvoiceItemService>(
      TYPES.IRecurringInvoiceItemService
    )
  ) {
    this.HttpService = httpService;
    this.AccountService = accountService;
    this.UserService = userService;
    this.CountryService = countryService;
    this.StateService = stateService;
    this.ErrorHandlerService = errorHandlerService;
    this.OrganizationService = organizationService;
    this.JobTitleService = jobTitleService;
    this.LevelService = levelService;
    this.SemesterService = semesterService;
    this.HolidayTypeService = holidayTypeService;
    this.NotificationUrgencyService = notificationUrgencyService;
    this.AreaService = areaService;
    this.TopicService = topicService;
    this.LessonService = lessonService;
    this.SepAreaService = sepAreaService;
    this.SepLevelService = sepLevelService;
    this.SepTopicService = sepTopicService;
    this.StaffService = staffService;
    this.PickupDropOffConfigurationService = pickupDropOffConfiguration;
    this.UserRoleService = userRoleService;
    this.PaymentMethodService = paymentMethodService;
    this.OutsidePaymentMethodService = outsidePaymentMethodService;
    this.DateTimeService = dateTimeService;
    this.SpecialFeeListService = specialFeeListService;
    this.InvoiceConfigurationService = invoiceConfigurationService;
    this.SalaryTypeService = salaryTypeService;
    this.ProgramOptionService = programOptionService;
    this.AdditionalFeesService = additionalFeesService;
    this.PastDueFeesService = pastDueFeesService;
    this.RegistrationFeesService = registrationFeesService;
    this.ClassService = classService;
    this.EmploymentFormService = employmentFormService;
    this.EthnicityService = ethnicityService;
    this.DegreeService = degreeService;
    this.CertificateService = certificateService;
    this.BankAccountTypeService = bankAccountTypeService;
    this.StaffDegreeService = staffDegreeService;
    this.StaffCertificationService = staffCertificationService;
    this.StaffEmergencyContactService = staffEmergencyContactService;
    this.StaffReferenceService = staffReferenceService;
    this.StaffProfessionalDevelopmentService =
      staffProfessionalDevelopmentService;
    this.StaffEmploymentHistoryService = staffEmploymentHistoryService;
    this.TermsAndPolicyService = termsAndPolicyService;
    this.ParentService = parentService;
    this.StudentFormService = studentFormService;
    this.EmailSettingService = emailSettingService;
    this.StudentQuestionService = studentQuestionService;
    this.EmailTemplateService = emailTemplateService;
    this.StudentAllergyService = studentAllergyService;
    this.StudentDentistService = studentDentistService;
    this.StudentImmunizationService = studentImmunizationService;
    this.StudentPhysicianService = studentPhysicianService;
    this.StudentService = studentService;
    this.ParentInviteService = parentInviteService;
    this.StudentConsentAndQuestionForm = studentConsentAndQuestionForm;
    this.PickupDropoffParentService = pickupDropoffParentService;
    this.PerformanceEvaluationSettingService =
      performanceEvaluationSettingService;
    this.PerformanceEvaluationQuestionService =
      performanceEvaluationQuestionService;
    this.StaffPerformanceEvaluationService = staffPerformanceEvaluationService;
    this.PickUpDropOffStudentWiseService = pickUpDropOffStudentWiseService;
    this.ReportService = reportService;
    this.ClassAssignmentService = classAssignmentService;
    this.StaffSchedulingService = staffSchedulingService;
    this.StaffTimeTrackingService = staffTimeTrackingService;
    this.ClassAttendanceService = classAttendanceService;
    this.LessonAssignmentService = lessonAssignmentService;
    this.SEPAssessmentService = sepAssessmentService;
    this.ParentBabyLogService = parentBabyLogService;
    this.RecordKeepingService = recordKeepingService;
    this.HolidayService = holidayService;
    this.DirectoryService = directoryService;
    this.EventService = eventService;
    this.PaymentConfigurationService = paymentConfigurationService;
    this.CurrencyCodeService = currencyCodeService;
    this.SavedCardOrAchSrvice = savedCardOrAchSrvice;
    this.InvoiceService = invoiceService;
    this.RoleManagementService = roleManagementService;
    this.DocuSignService = docuSignService;
    this.RecurringInvoiceItemService = recurringInvoiceItemService;
  }
}
