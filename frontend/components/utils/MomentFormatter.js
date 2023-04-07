import { useMemo } from 'react';
import moment from 'moment';

const MomentFormatter = ({ value = new Date(), format = 'dddd, MMMM D, YYYY, h:mm A' }) => {
  const memoizedMoment = useMemo(() => moment(value).format(format), [value, format]);
  return memoizedMoment;
};

export default MomentFormatter;
