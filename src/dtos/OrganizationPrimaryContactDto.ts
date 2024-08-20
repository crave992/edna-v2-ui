import CountryDto from "./CountryDto";
import StateDto from "./StateDto";

export interface OrganizationPrimaryContactDto {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    countryId: number;
    country: CountryDto;
    stateId: number;
    state: StateDto;
    city: string;
    zipcode: string;
}