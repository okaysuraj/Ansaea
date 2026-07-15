import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { LayoutDashboard, FlaskConical, ClipboardList } from 'lucide-react-native';

export default function LabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = '#0ea5e9'; 

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
          title: 'Lab',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Tests',
          tabBarIcon: ({ color }) => <FlaskConical size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
