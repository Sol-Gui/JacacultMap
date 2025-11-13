import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' },
        headerShown: false,
        // Apenas estas configurações essenciais
        animation: 'none',
      }}
    >
      <Tabs.Screen 
        name="home"
        options={{
          animation: 'none',
        }}
      />
      <Tabs.Screen 
        name="favoritos"
        options={{
          animation: 'none',
        }}
      />
      <Tabs.Screen 
        name="calendario"
        options={{
          animation: 'none',
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          animation: 'none',
        }}
      />
      <Tabs.Screen 
        name="interests"
        options={{
          animation: 'none',
        }}
      />
    </Tabs>
  );
}