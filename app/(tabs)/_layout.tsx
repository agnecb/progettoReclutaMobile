import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext'; // Continuiamo a usarlo, ma non lo dichiariamo più qui
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();

  // logica di protezione: se l'utente non è loggato, viene rimandato alla pagina di accesso
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.onPrimary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.onPrimary,
      tabBarInactiveTintColor: colors.textSecondary,
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.background, borderTopWidth: 0.2, borderTopColor: colors.textSecondary, paddingTop: 2 },
    }}>

      <Tabs.Screen name="home" options={{
        title: 'Home',
        //tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
        ),
      }} />
      <Tabs.Screen name="likes" options={{
        title: 'Likes',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
        ),
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
        ),
      }} />
      {/* TAB NASCOSTE */}
      <Tabs.Screen
        name="post"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="user"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile/edit"
        options={{ href: null }}
      />
    </Tabs>
  );
}