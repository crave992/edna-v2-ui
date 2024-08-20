import { useEffect, useState } from 'react';

export default function SubNavbarDateTime() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  const updateDateTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = days[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const formattedHours = hours % 12 || 12;
    const datePart = `${dayOfWeek} ${month} ${getOrdinal(day)}, ${year}`;
    const timePart = `${formattedHours}:${minutes.toString().padStart(2, '0')}${amPm}`;

    setCurrentDate(datePart);
    setCurrentTime(timePart);
  };

  useEffect(() => {
    updateDateTime();
    const now = new Date();
    const millisecondsTillNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeoutId = setTimeout(() => {
      updateDateTime();
      setInterval(updateDateTime, 60000);
    }, millisecondsTillNextMinute);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="tw-text-sm-medium tw-text-secondary tw-flex tw-flex-row">
      <div>{currentDate}</div>
      <div className="tw-ml-[12px]">{currentTime}</div>
    </div>
  );
}
