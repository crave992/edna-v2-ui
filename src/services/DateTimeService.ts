import { injectable } from "inversify";
import IDateTimeService from "./interfaces/IDateTimeService";
import DropdownBasicDto from "@/dtos/DropdownBasicDto";

@injectable()
export default class DateTimeService implements IDateTimeService {

    constructor() {
    }
    convertToLocalDate(dateTimeOffset: Date, timezone?: string, displayTime?: boolean): string {

        if (!timezone) {

            if (typeof window !== 'undefined') {
                const savedTimeZone = localStorage.getItem("utz") || "";
                if (!savedTimeZone) {
                    timezone = "America/New_York";
                } else {
                    timezone = savedTimeZone;
                }
            }
        }

        // Parse the DateTimeOffset string and extract the relevant components
        const dateTime = new Date(dateTimeOffset as unknown as string);
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
        const day = dateTime.getDate();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const seconds = dateTime.getSeconds();

        // Create a new Date object using the DateTimeOffset components
        const date = new Date(year, month - 1, day, hours, minutes, seconds);

        // Convert the date to the user's timezone
        const localDateString = date.toLocaleString('en-US', {
            timeZone: timezone,
            dateStyle: "long",
            timeStyle: "medium"
        });

        const formattedDateString = displayTime ? localDateString.replace(' at', ',') : localDateString.split('at')[0];
        return formattedDateString;
    }

    convertTimeToAmPm(time: string | null): string {
        if (!time)
            return "";

        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));

        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        const formattedTime = date.toLocaleTimeString([], options);
        return formattedTime;
    }

    getMonths(): DropdownBasicDto[] {
        const months: DropdownBasicDto[] = [{
            value: 1,
            label: "January"
        },
        {
            value: 2,
            label: "February"
        },
        {
            value: 3,
            label: "March"
        },
        {
            value: 4,
            label: "April"
        },
        {
            value: 5,
            label: "May"
        },
        {
            value: 6,
            label: "June"
        },
        {
            value: 7,
            label: "July"
        },
        {
            value: 8,
            label: "August"
        },
        {
            value: 9,
            label: "September"
        },
        {
            value: 10,
            label: "October"
        },
        {
            value: 11,
            label: "November"
        },
        {
            value: 12,
            label: "December"
        },
        ];
        return months;
    }
}
