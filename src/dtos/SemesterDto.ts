export default interface SemesterDto {
    id: number;
    name: string;
    year: number;
    startDate: Date | null;
    endDate: Date | null;
    createdOn: Date;
    updatedOn: Date;
}