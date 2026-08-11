import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import EventModal from '../../components/EventModal';
import { useTheme } from '../../contexts/ThemeContext';
import { getData } from '../../services/localStorage';
import { getUserData } from '../../services/user';
import { getEvent } from '../../services/events';
import { getCategoryStyles, type Event } from '../../styles/app/mainPage';

const Favoritos: React.FC = () => {
  const { theme, isDarkMode, toggleDarkMode, isLoading } = useTheme();
  const [favoritedEvents, setFavoritedEvents] = useState<Event[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [userToken, setUserToken] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    loadFavoritedEvents();
  }, []);

  // Recarregar favoritos sempre que a aba for focada
  useFocusEffect(
    React.useCallback(() => {
      loadFavoritedEvents();
    }, [])
  );

  const loadFavoritedEvents = async () => {
    try {
      setLoading(true);
      const token = await getData('userToken');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado para ver seus eventos favoritos');
        setLoading(false);
        return;
      }

      setUserToken(token);
      const user = await getUserData(token) as any;
      setUserData(user);

      const favoritedIds = user.userData?.favoritedEventsById || [];

      if (favoritedIds.length === 0) {
        setFavoritedEvents([]);
        setLoading(false);
        return;
      }

      // Buscar detalhes de cada evento favoritado
      const eventsPromises = favoritedIds.map((id: number) => getEvent(id));
      const events = await Promise.all(eventsPromises);

      setFavoritedEvents(events.filter((event: any) => event !== null));
    } catch (error) {
      console.error('Erro ao carregar eventos favoritados:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus eventos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
    // Recarregar a lista de favoritos quando a modal for fechada
    loadFavoritedEvents();
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    const hora = String(date.getHours()).padStart(2, "0");
    const minuto = String(date.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}h`;
  };

  const renderEventCard = (event: Event) => {
    const categoryStyle = getCategoryStyles(event.event_type);
    const categoryName = event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1);

    let eventImage = 'https://picsum.photos/300/200?random=event';
    try {
      if (event.event_image_header?.imageBase64 && event.event_image_header.imageBase64 !== "NO-IMAGE") {
        eventImage = `${event.event_image_header.imageBase64}`;
      } else if (event.event_image_header.imageBase64) {
        eventImage = "data:image/png;base64,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"
      }
    } catch (err) {
      // Usar imagem padrão em caso de erro
    }

    return (
      <TouchableOpacity
        key={event.id}
        className="overflow-hidden rounded-xl border shadow-md"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
        onPress={() => openEventModal(event)}
      >
        <Image
          source={{ uri: eventImage }}
          className="h-40 w-full"
          resizeMode="cover"
        />

        <View className="p-4">
          <Text className="mb-2 text-lg font-bold leading-6" style={{ color: theme.text }} numberOfLines={2}>
            {event.title}
          </Text>

          <Text className="mb-3 text-sm leading-5" style={{ color: theme.textSecondary }} numberOfLines={3}>
            {event.description}
          </Text>

          <Text className="mb-3 text-xs" style={{ color: theme.textSecondary }}>
            {formatDateTime(event.date)}
          </Text>

          <View className="self-start rounded-full px-3 py-1.5" style={{ backgroundColor: categoryStyle.bg }}>
            <Text className="text-xs font-semibold" style={{ color: categoryStyle.fg }}>
              {categoryName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <Header
        onMenuPress={() => setSidebarVisible(true)}
        theme={theme}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
      />

      <ScrollView className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 md:px-8">
        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold" style={{ color: theme.text }}>Meus Favoritos</Text>
          <Text className="text-base" style={{ color: theme.textSecondary }}>
            {favoritedEvents.length} evento{favoritedEvents.length !== 1 ? 's' : ''} favoritado{favoritedEvents.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {loading ? (
          <View className="items-center justify-center py-10">
            <Text className="text-base" style={{ color: theme.textSecondary }}>
              Carregando seus eventos favoritos...
            </Text>
          </View>
        ) : favoritedEvents.length === 0 ? (
          <View className="items-center justify-center px-5 py-16">
            <Text className="mb-3 text-center text-xl font-bold" style={{ color: theme.text }}>
              Nenhum evento favoritado
            </Text>
            <Text className="text-center text-base leading-6" style={{ color: theme.textSecondary }}>
              Explore eventos na página inicial e adicione aos seus favoritos
            </Text>
          </View>
        ) : (
          <View className="gap-4 pb-24">
            {favoritedEvents.map(renderEventCard)}
          </View>
        )}
      </ScrollView>

      <Footer theme={theme} />

      <EventModal
        visible={modalVisible}
        onClose={closeEventModal}
        event={selectedEvent}
        theme={theme}
        userData={userData}
        userToken={userToken}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        theme={theme}
      />
    </View>
  );
};

export default Favoritos;
