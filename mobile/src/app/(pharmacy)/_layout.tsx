import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { LayoutDashboard, Pill, Package } from 'lucide-react-native';

export default function PharmacyLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = '#10b981'; 

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
          title: 'Pharmacy',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
