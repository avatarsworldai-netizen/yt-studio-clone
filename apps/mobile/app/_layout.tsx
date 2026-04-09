import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StyleSheet } from 'react-native';
import { C } from '../constants/theme';
import { ChannelProvider } from '../contexts/ChannelContext';

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 60000, refetchOnWindowFocus: true } } });

export default function RootLayout() {
  return (
    <QueryClientProvider client={qc}>
      <ChannelProvider>
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right' }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="video/[id]" options={{ headerShown: true, headerStyle: { backgroundColor: C.white }, headerTintColor: C.text, headerTitle: 'Detalles del vídeo', headerShadowVisible: false }} />
            <Stack.Screen name="profile" options={{ headerShown: true, headerStyle: { backgroundColor: C.white }, headerTintColor: C.text, headerTitle: 'Canal', headerShadowVisible: false }} />
          </Stack>
        </View>
      </ChannelProvider>
    </QueryClientProvider>
  );
}
