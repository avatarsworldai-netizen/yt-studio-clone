import React from 'react';
import { Platform, Text, Image } from 'react-native';
import { sendEditMessage } from '../hooks/useAdminMode';
import { getOverride, useFieldOverrides } from '../hooks/useFieldOverrides';

type Props = {
  table: string;
  column: string;
  rowId: string;
  label: string;
  value: string | number;
  type?: 'text' | 'number' | 'image';
  isAdmin: boolean;
  children: React.ReactNode;
};

export function AE({ table, column, rowId, label, value, type = 'text', isAdmin, children }: Props) {
  useFieldOverrides(); // Subscribe to updates

  const override = getOverride(table, column, rowId);

  // If not admin, still check for overrides to show updated values
  if (override !== undefined) {
    if (type === 'image' && override) {
      // Replace image with override URL
      return replaceImageChild(children, override);
    }
    // Replace text content with override
    return replaceTextChild(children, override);
  }

  if (!isAdmin || Platform.OS !== 'web') return <>{children}</>;

  const handleClick = (e: any) => {
    e.stopPropagation();
    sendEditMessage({ id: `${table}_${column}_${rowId}`, label, value, type, table, column, rowId });
  };

  return React.createElement('span', {
    onClick: handleClick,
    style: { display: 'contents', cursor: 'pointer' },
  }, children);
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
