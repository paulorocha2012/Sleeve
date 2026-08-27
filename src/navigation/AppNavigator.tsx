import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "../screens/LoginScreen";
import HomeFeedScreen from "../screens/HomeFeedScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AlbumDetailScreen from "../screens/AlbumDetailScreen";
import NewReviewScreen from "../screens/NewReviewScreen";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  AlbumDetail: { albumMbid: string };
  NewReview: { albumMbid: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();

// Tabs principais: Feed (Home), Buscar álbuns, Perfil do usuário.
function MainTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Home" component={HomeFeedScreen} />
      <Tabs.Screen name="Search" component={SearchScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

// Stack raiz: Login -> Tabs principais -> telas empilhadas (detalhe do álbum, nova avaliação).
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Login">
        <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <RootStack.Screen name="AlbumDetail" component={AlbumDetailScreen} options={{ title: "Álbum" }} />
        <RootStack.Screen name="NewReview" component={NewReviewScreen} options={{ title: "Avaliar" }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
