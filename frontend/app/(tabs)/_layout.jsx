import { Tabs } from "expo-router";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarLabelStyle: {
          fontFamily: "mon-sb",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarLabel: "map",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "profile",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
