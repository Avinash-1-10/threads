import { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';

const useFormattedDate = (timestamp) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Parse the timestamp to a Date object
    const date = parseISO(timestamp);

    // Format the date as dd/mm/yy
    const newFormattedDate = format(date, 'dd/MM/yy');

    // Set the formatted date in state
    setFormattedDate(newFormattedDate);
  }, [timestamp]);

  return formattedDate;
};

export default useFormattedDate;
