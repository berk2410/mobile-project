import signup from "./(auth)/sign-up";
import signin from "./(auth)/sign-in";
import home from "./(home)";
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default function App() {
  return (
    <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" component={home} options={{ headerShown: false}} />
          <Stack.Screen name="signin" component={signin} options={{ headerShown: false }}/>
          <Stack.Screen name="signup" component={signup} options={{ headerShown: false }}/>
          {/* <Stack.Screen name="signIn" component={signIn} options={{ headerShown: false }}/>
          <Stack.Screen name="signUp" component={signUp} options={{ headerShown: false }}/> */}
      </Stack.Navigator>
  );
}