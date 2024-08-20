import DropdownBasicDto from "@/dtos/DropdownBasicDto";

export default interface IDateTimeService {
  convertToLocalDate(dateTimeOffset: Date, timezone?: string, displayTime?: boolean): string;
  convertTimeToAmPm(time: string | null): string;
  getMonths(): DropdownBasicDto[]
}
