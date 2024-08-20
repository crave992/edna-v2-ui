export default interface TermsAndPolicyDto {
    hippa: string | null;
    hippaUpdateDate: Date | null;
    parentRegistration: string | null;
    parentRegistrationUpdateDate: Date | null;
    directoryCodeOfConduct: string | null;
    directoryCodeOfConductUpdateDate: Date | null;
}