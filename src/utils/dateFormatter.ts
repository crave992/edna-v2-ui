export const parseDate = (input: string, format: string = 'yyyy-mm-dd'): Date => {
  const parts: RegExpMatchArray | null = input.match(/(\d+)/g);
  if (!parts) {
    throw new Error("Invalid date input");
  }
  
  let i = 0;
  const fmt: { [key: string]: number } = {};
  
  // extract date-part indexes from the format
  format.replace(/(yyyy|dd|mm)/g, (part: string): string => {
    fmt[part] = i++;
    return '';
  });

  return new Date(
    parseInt(parts[fmt['yyyy']], 10), 
    parseInt(parts[fmt['mm']], 10) - 1, 
    parseInt(parts[fmt['dd']], 10)
  );
};


export const formatDate = (inputDate: Date, format?: string): any => {
  if (!inputDate) {
    return '';
  }

  const date = new Date(inputDate);
  //const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date);
  const year = format && format.includes('YYYY') ? 'YYYY' : 'YY';

  return format !== undefined
    ? format
        .replace(year, year === 'YYYY' ? date.getFullYear().toString() : date.getFullYear().toString().substr(-2))
        .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('DD', date.getDate().toString().padStart(2, '0'))
        .replace('hh', date.getHours().toString().padStart(2, '0'))
        .replace('mm', date.getMinutes().toString().padStart(2, '0'))
        .replace('a', date.getHours() >= 12 ? 'pm' : 'am')
    : formattedDate
        .replace('YYYY', date.getFullYear().toString())
        .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('DD', date.getDate().toString().padStart(2, '0'))
        .replace('hh', date.getHours().toString().padStart(2, '0'))
        .replace('mm', date.getMinutes().toString().padStart(2, '0'))
        .replace('a', date.getHours() >= 12 ? 'pm' : 'am');
};
