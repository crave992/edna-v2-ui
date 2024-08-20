import LevelDto from "./LevelDto";

export default interface RegistrationFeesDto {
    id: number;
    applicationFee: number;
    registrationFee: number;
    taxPercentage: number;
    creditCardCharges: number;
    organizationId: number;
}
