import { Tabs } from 'expo-router';
import { Calendar, LayoutDashboard, Search, User } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Palette } from '../../constants/theme';

export default function PatientLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
          borderTopColor: isDark ? Palette.borderDark : Palette.borderWarm,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: isDark ? Palette.textDarkSecondary : Palette.textWarmSecondary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'Doctors',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />

      {/* Hide nested group routes from appearing as tabs */}
      <Tabs.Screen name="(appointments)" options={{ href: null }} />
      <Tabs.Screen name="(metrics)" options={{ href: null }} />
      <Tabs.Screen name="(profile)" options={{ href: null }} />
    </Tabs>
  );
}
