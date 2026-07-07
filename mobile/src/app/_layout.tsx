import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(patient)" />
          <Stack.Screen name="(doctor)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(lab)" />
          <Stack.Screen name="(pharmacy)" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
