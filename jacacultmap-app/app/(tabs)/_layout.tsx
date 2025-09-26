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
        name="novidades"
        options={{
          animation: 'none',
        }}
      />
      <Tabs.Screen 
        name="configuracoes"
        options={{
          animation: 'none',
        }}
      />
    </Tabs>
  );
}