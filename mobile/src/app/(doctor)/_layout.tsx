import { Tabs } from 'expo-router';
import { Calendar, LayoutDashboard, User, Users } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Palette } from '../../constants/theme';

export default function DoctorLayout() {
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
          title: 'Queue',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: 'Patients',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
