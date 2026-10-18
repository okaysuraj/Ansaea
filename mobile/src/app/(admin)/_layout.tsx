import { Tabs } from 'expo-router';
import { LayoutDashboard } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = '#ef4444'; // distinct color for admin

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#0F172A' : '#ffffff',
          borderTopColor: isDark ? '#334155' : '#e2e8f0',
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
