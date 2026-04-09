import React, { createContext, useContext, useState, useEffect } from 'react';
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

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [activeChannelId, setActiveChannelId] = useState(DEFAULT_CHANNEL_ID);

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
