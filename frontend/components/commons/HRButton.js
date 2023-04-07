import React from 'react';
import { Button, Tooltip } from 'antd';
import AccessControl from '@components/accessControl/AccessControl';
import Link from 'next/link';

export default function HRButton({
  allowedPermissions,
  renderNoAccess,
  tooltipTitle,
  href,
  ...props
}) {
  const render = () => {
    if (href && !tooltipTitle)
      return (
        <Link href={href}>
          <Button {...props}>{props?.children}</Button>
        </Link>
      );
    else if (!href && tooltipTitle)
      return (
        <Tooltip title={tooltipTitle}>
          <Button {...props}>{props?.children}</Button>
        </Tooltip>
      );
    else if (href && tooltipTitle)
      return (
        <Link href={href}>
          <Tooltip title={tooltipTitle}>
            <Button {...props}>{props?.children}</Button>
          </Tooltip>
        </Link>
      );
    else return <Button {...props}>{props?.children}</Button>;
  };
  return (
    <AccessControl allowedPermissions={allowedPermissions} renderNoAccess={renderNoAccess}>
      {render()}
    </AccessControl>
  );
}
