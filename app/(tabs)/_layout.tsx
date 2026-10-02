import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { Navigator } = createMaterialTopTabNavigator();

export const TopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
          textTransform: "none",
        },
        tabBarIndicatorStyle: { backgroundColor: colors.tint },
        tabBarStyle: {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: "auto", minWidth: 100 },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: "Accounts" }} />
      <TopTabs.Screen name="transactions" options={{ title: "Transactions" }} />
      <TopTabs.Screen
        name="budget"
        options={{
          title: "Budget",
        }}
      />
      <TopTabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <TopTabs.Screen name="profile" options={{ title: "Profile" }} />
      <TopTabs.Screen name="settings" options={{ title: "Settings" }} />
    </TopTabs>
  );
}
