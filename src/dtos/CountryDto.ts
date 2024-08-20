export default interface CountryDto {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
  status: boolean;
  locales: string;
  createdOn: Date;
  updatedOn: Date;
}
