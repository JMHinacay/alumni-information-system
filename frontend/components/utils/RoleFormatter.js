import { useMemo } from 'react';
import { roleFormatter } from 'utils/constantFormatters';

const RoleFormatter = ({ value }) => {
  const memoizedRole = useMemo(() => roleFormatter(value), [value]);
  return memoizedRole;
};

export default RoleFormatter;
