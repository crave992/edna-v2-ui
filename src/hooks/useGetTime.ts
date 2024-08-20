import { useCallback } from 'react';

export const useGetTime = () => {
  const getTime = useCallback((time: string) => {
    // Parse the date string into a Date object
    const dateObject = new Date(time);

    // Extract the hours and minutes
    let hours = dateObject.getHours() //.getUTCHours(); // Use getHours() if you want local time
    const minutes = dateObject.getMinutes()//.getUTCMinutes(); // Use getMinutes() if you want local time

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Format the minutes to always be two digits
    const minutesString = minutes.toString().padStart(2, '0');

    // Format the time as a string (H:MM AM/PM)
    const timeString = `${hours}:${minutesString} ${ampm}`;

    return timeString;
  }, []);

  return getTime;
};
