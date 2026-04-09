import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getActiveChannelForOverrides } from './useFieldOverrides';

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
        // Cross-origin iframe access blocked — do NOT assume admin mode
        _isAdmin = false;
        setIsAdmin(false);
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
      const channelId = getActiveChannelForOverrides();
      window.parent.postMessage({ type: 'EDIT_FIELD', field: { ...field, channelId } }, '*');
    } catch (e) {}
  }
}
