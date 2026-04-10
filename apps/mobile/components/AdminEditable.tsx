import React from 'react';
import { Platform, Text, Image } from 'react-native';
import { sendEditMessage } from '../hooks/useAdminMode';
import { getOverride, useFieldOverrides, getActiveChannelForOverrides, areOverridesReady } from '../hooks/useFieldOverrides';

type Props = {
  table: string;
  column: string;
  rowId: string;
  label: string;
  value: string | number;
  type?: 'text' | 'number' | 'image';
  isAdmin: boolean;
  /** If true, don't prefix rowId with channelId — for direct DB edits */
  direct?: boolean;
  children: React.ReactNode;
};

export function AE({ table, column, rowId, label, value, type = 'text', isAdmin, direct, children }: Props) {
  useFieldOverrides(); // Subscribe to updates

  const override = getOverride(table, column, rowId);

  // Determine what to render: overridden content or original
  let content = children;
  if (override !== undefined) {
    if (type === 'image' && override) {
      content = replaceImageChild(children, override);
    } else {
      content = replaceTextChild(children, override);
    }
  }

  // If not admin or not web, just show content (with or without override)
  if (!isAdmin || Platform.OS !== 'web') return <>{content}</>;

  // Always wrap with click handler in admin mode, even after override
  const currentValue = override !== undefined ? override : value;
  const ch = getActiveChannelForOverrides();
  const scopedRowId = (ch && !direct) ? `${ch}_${rowId}` : rowId;
  const handleClick = (e: any) => {
    e.stopPropagation();
    sendEditMessage({ id: `${table}_${column}_${scopedRowId}`, label, value: currentValue, type, table, column, rowId: scopedRowId });
  };

  return React.createElement('span', {
    onClick: handleClick,
    style: { display: 'contents', cursor: 'pointer' },
  }, content);
}

// Replace text content in children
function replaceTextChild(children: React.ReactNode, newValue: string): React.ReactElement {
  if (!React.isValidElement(children)) return <>{children}</>;

  const child = children as React.ReactElement<any>;

  // If it's a Text component, replace its children
  if (child.type === Text || (child.props && typeof child.props.children === 'string')) {
    return React.cloneElement(child, {}, newValue);
  }

  // Otherwise return as-is with override
  return React.cloneElement(child, {}, newValue);
}

// Replace image source in children
function replaceImageChild(children: React.ReactNode, newUrl: string): React.ReactElement {
  if (!React.isValidElement(children)) return <>{children}</>;

  const child = children as React.ReactElement<any>;

  if (child.type === Image) {
    return React.cloneElement(child, { source: { uri: newUrl } });
  }

  return <>{children}</>;
}
