import CountryDto from "./CountryDto";
import StateDto from "./StateDto";

export interface StudentDentistDto {
  studentId: number;
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipcode: string;
  countryId: number;
  country: CountryDto;
  stateId: number;
  state: StateDto;
  primaryInsuranceCenter: string;
  policyNumber: string;
  createdOn: Date;
  updatedOn: Date;
}
