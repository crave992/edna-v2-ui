import CountryDto from "./CountryDto";

export default interface StateDto {
  id: number;
  countryId: number;
  code: string;
  name: string;
  country: CountryDto;
}

export interface StateListResponseDto {
  totalRecord: number;
  states: StateDto[];
}
