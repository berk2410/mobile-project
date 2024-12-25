import { tokenCache } from './cache';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack
          screenOptions={{
            headerShown: false, // Ensures the header is visible
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
          {/* Add more screens and titles as needed */}
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
