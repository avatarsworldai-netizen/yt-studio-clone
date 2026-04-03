import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        setIsAdmin(window.self !== window.top);
      } catch (e) {
        setIsAdmin(true);
      }
    }
  }, []);

  return isAdmin;
}

export function sendEditMessage(field: {
  id: string;
  label: string;
  value: string | number;
  type: string;
  table: string;
  column: string;
  rowId: string;
}) {
  if (Platform.OS === 'web') {
    try {
      window.parent.postMessage({ type: 'EDIT_FIELD', field }, '*');
    } catch (e) {}
  }
}
