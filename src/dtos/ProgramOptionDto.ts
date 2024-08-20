import LevelDto from "./LevelDto";

export default interface ProgramOptionDto {
    id: number;
    levelId: number;
    name: string;
    timeSchedule: string;
    fees: number;
    level:LevelDto;
    order:number;
}

export interface ProgramOptionResponseDto {
    totalRecord: number;
    programOptions: ProgramOptionDto[];
}
