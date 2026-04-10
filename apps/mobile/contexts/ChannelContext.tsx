import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { setActiveChannelForOverrides, reloadOverrides } from '../hooks/useFieldOverrides';

export type ChannelInfo = {
  id: string;
  name: string;
  handle: string;
  subs: string;
  avatarUrl: string | null;
};

type ChannelContextType = {
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
};

const DEFAULT_CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

const ChannelContext = createContext<ChannelContextType>({
  activeChannelId: DEFAULT_CHANNEL_ID,
  setActiveChannelId: () => {},
});

function getSavedChannel(): string {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem('activeChannelId') || DEFAULT_CHANNEL_ID; } catch {}
  }
  return DEFAULT_CHANNEL_ID;
}

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [activeChannelId, setActiveChannelIdState] = useState(getSavedChannel);

  const setActiveChannelId = (id: string) => {
    setActiveChannelIdState(id);
    if (Platform.OS === 'web') {
      try { localStorage.setItem('activeChannelId', id); } catch {}
    }
  };

  useEffect(() => {
    setActiveChannelForOverrides(activeChannelId);
    reloadOverrides();
  }, [activeChannelId]);

  return (
    <ChannelContext.Provider value={{ activeChannelId, setActiveChannelId }}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannel() {
  return useContext(ChannelContext);
}

export { DEFAULT_CHANNEL_ID };
