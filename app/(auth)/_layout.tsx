import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Accedi' }} />
      <Stack.Screen name="register" options={{ title: 'Registrati' }} />
    </Stack>
  );
}