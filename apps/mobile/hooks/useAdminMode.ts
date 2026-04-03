import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

let _isAdmin = false;

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(_isAdmin);

  useEffect(() => {
    if (_isAdmin) {
      setIsAdmin(true);
      return;
    }
    if (Platform.OS === 'web') {
      try {
        const inIframe = window.self !== window.top;
        if (inIframe) {
          _isAdmin = true;
          setIsAdmin(true);
        }
      } catch (e) {
        _isAdmin = true;
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
