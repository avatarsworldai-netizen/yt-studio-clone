import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { sendEditMessage } from '../hooks/useAdminMode';

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
  if (!isAdmin) return <>{children}</>;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        sendEditMessage({ id: `${table}_${column}_${rowId}`, label, value, type, table, column, rowId });
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
