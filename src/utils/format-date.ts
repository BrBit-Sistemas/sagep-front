import dayjs from 'dayjs';

export function formatDateToDDMMYYYY(date: string | Date): string {
  if (!date) return '';
  
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return '';
  
  return parsedDate.format('DD/MM/YYYY');
}

export function formatDateToYYYYMMDD(date: string | Date): string {
  if (!date) return '';
  
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return '';
  
  return parsedDate.format('YYYY-MM-DD');
}
