import LevelDto from "./LevelDto";

export default interface PastDueFeeDto {
    id: number;
    dueFrom: number;
    uptoDate: number;
    dueFee: number;
    feeType: string;
}

