
export default interface SpecialFeeListDto {
    id: number;
    name: string;
    description: string;
    pricePerUnit: number;
    createdOn: Date;
    updatedOn: Date;
}

export interface SpecialFeeListResponseDto {
    totalRecord: number;
    specialFeeList: SpecialFeeListDto[];
}
