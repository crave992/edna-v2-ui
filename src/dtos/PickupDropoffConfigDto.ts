export default interface PickupDropoffConfigDto {
  id: number;
  minCount: number;
  maxCount: number;
  createdOn: Date;
  updatedOn: Date;
  organizationId: number;
}
