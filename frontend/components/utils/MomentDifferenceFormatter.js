import { useMemo } from 'react';
import moment from 'moment';

const MomentDifferenceFormatter = ({ firstDate, secondDate, format = 'hours' }) => {
  if (!firstDate || !secondDate) return null;
  const memoizedMoment = useMemo(() => moment(firstDate).diff(moment(secondDate), format), [
    firstDate,
    secondDate,
    format,
  ]);
  return memoizedMoment;
};

export default MomentDifferenceFormatter;
