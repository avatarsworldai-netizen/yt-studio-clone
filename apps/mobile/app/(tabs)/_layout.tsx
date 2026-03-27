import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

function HeaderRight() {
  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerIcon}>
        <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerIcon}>
        <MaterialCommunityIcons name="magnify" size={22} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={{ uri: 'https://picsum.photos/seed/avatar/200/200' }}
          style={styles.headerAvatar}
        />
      </TouchableOpacity>
    </View>
  );
}

function HeaderLeft() {
  return (
    <View style={styles.headerLeft}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png' }}
        style={styles.ytLogo}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: COLORS.tabBarBg,
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          height: 49,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarActiveTintColor: COLORS.tabBarActive,
        tabBarInactiveTintColor: COLORS.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'Studio',
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: 'Content',
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'play-box-multiple' : 'play-box-multiple-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'chart-box' : 'chart-box-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="comments"
        options={{
          title: 'Comments',
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'comment-text' : 'comment-text-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="revenue"
        options={{
          title: 'Earn',
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'currency-usd-circle' : 'currency-usd-circle-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginRight: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerIcon: {
    padding: 2,
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceElevated,
  },
  ytLogo: {
    width: 28,
    height: 20,
    marginRight: 4,
  },
});
