import LevelDto from "./LevelDto";

export default interface AdditionalFeeDto {
    id: number;
    levelId: number;
    name: string;
    fees: number;
    level:LevelDto
}

export interface AdditionalFeeResponseDto {
    totalRecord: number;
    additionalFees: AdditionalFeeDto[];
}
