import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, Modal, Image, Dimensions } from 'react-native';
import Header from '../../styles/app/header';
import Footer from '../../styles/app/footer';
import Sidebar from '../../styles/app/sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { getData } from '../../services/localStorage';
import { getUserData } from '../../services/user';
import { getLimitedEvents } from '../../services/events';
import { type Event } from '../../styles/app/mainPage';
import { Ionicons } from '@expo/vector-icons';

const Calendario: React.FC = () => {
  const { theme, isDarkMode, toggleDarkMode, isLoading } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [favoritedEvents, setFavoritedEvents] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [eventsModalVisible, setEventsModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar eventos
      const eventsData = await getLimitedEvents(100, 1) as any;
      if (eventsData?.events) {
        setEvents(eventsData.events);
      }

      // Carregar eventos favoritados
      const token = await getData('userToken');
      if (token) {
        const userData = await getUserData(token) as any;
        const favoritedIds = userData.userData?.favoritedEventsById || [];
        setFavoritedEvents(favoritedIds);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do calendário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os eventos');
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventDateStr = eventDate.toISOString().split('T')[0];
      return eventDateStr === dateStr;
    });
  };

  const hasFavoritedEventOnDate = (date: Date) => {
    const eventsOnDate = getEventsForDate(date);
    return eventsOnDate.some(event => favoritedEvents.includes(event.id));
  };

  const showEventsForDate = (date: Date) => {
    const eventsOnDate = getEventsForDate(date);
    setSelectedDate(date);
    setSelectedDateEvents(eventsOnDate);
    setEventsModalVisible(true);
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
    const isFavorited = favoritedEvents.includes(event.id);
    
    let eventImage = 'https://picsum.photos/300/200?random=event';
    try {
      if (event.event_image_header?.imageBase64 && event.event_image_header.imageBase64 !== "NO-IMAGE") {
        eventImage = `data:image/png;base64,${event.event_image_header.imageBase64}`;
      } else if (event.event_image_header.imageBase64) {
        eventImage = "data:image/jpeg;base64,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"
      }
    } catch (err) {
      // Usar imagem padrão em caso de erro
    }

    return (
      <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image
          source={{ uri: eventImage }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <Text style={[styles.eventTitle, { color: theme.text }]} numberOfLines={2}>
              {event.title}
            </Text>
            {isFavorited && (
              <Ionicons name="heart" size={20} color="#ff4757" />
            )}
          </View>
          
          <Text style={[styles.eventDescription, { color: theme.textSecondary }]} numberOfLines={3}>
            {event.description}
          </Text>
          
          <Text style={[styles.eventTime, { color: theme.textSecondary }]}>
            {formatDateTime(event.date)}
          </Text>
          
          <Text style={[styles.eventLocation, { color: theme.textSecondary }]}>
            📍 {event.location?.name || 'Local não informado'}
          </Text>
        </View>
      </View>
    );
  };

  const renderCalendarMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <View key={`${year}-${month}`} style={[styles.monthCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {/* Cabeçalho dos dias da semana */}
        <View style={styles.weekHeader}>
          {dayNames.map(day => (
            <Text key={day} style={[styles.dayHeader, { color: theme.textSecondary }]}>
              {day}
            </Text>
          ))}
        </View>

        {/* Dias do mês */}
        <View style={styles.daysContainer}>
          {/* Espaços vazios para os primeiros dias */}
          {Array.from({ length: startingDayOfWeek }, (_, i) => (
            <View key={`empty-${i}`} style={[styles.dayCell, { opacity: 0 }]} />
          ))}
          
          {/* Dias do mês */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const currentDate = new Date(year, month, day);
            const eventsOnDate = getEventsForDate(currentDate);
            const hasFavorited = hasFavoritedEventOnDate(currentDate);
            const isToday = currentDate.toDateString() === new Date().toDateString();

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isToday && { backgroundColor: theme.primary, borderRadius: 100 },
                  hasFavorited && { backgroundColor: '#ff4757', borderRadius: 100 },
                  eventsOnDate.length > 0 && !hasFavorited && !isToday && { backgroundColor: theme.primary + '40', borderRadius: 100 }
                ]}
                onPress={() => {
                  if (eventsOnDate.length > 0) {
                    showEventsForDate(currentDate);
                  }
                }}
              >
                <Text style={[
                  styles.dayText,
                  { color: theme.text },
                  (isToday || hasFavorited) && { color: '#fff' },
                  eventsOnDate.length > 0 && !hasFavorited && !isToday && { color: theme.primary }
                ]}>
                  {day}
                </Text>
                {eventsOnDate.length > 0 && (
                  <View style={[
                    styles.eventDot,
                    { backgroundColor: hasFavorited ? '#fff' : theme.primary }
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legenda */}
        <View style={styles.legend}>
          <View style={[styles.legendItem, styles.legendLeft]}>
            <View style={[styles.legendColor, { backgroundColor: theme.primary }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Hoje</Text>
          </View>
          <View style={[styles.legendItem, styles.legendCenter]}>
            <View style={[styles.legendColor, { backgroundColor: '#ff4757' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Favoritos</Text>
          </View>
          <View style={[styles.legendItem, styles.legendRight]}>
            <View style={[styles.legendColor, { backgroundColor: '#2d5016' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Disponíveis</Text>
          </View>
        </View>
      </View>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getMonthName = (month: number) => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[month];
  };

  if (isLoading) {
    return null; // ou um loading spinner
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        onMenuPress={() => setSidebarVisible(true)} 
        theme={theme}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
      />
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Calendário de Eventos</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Visualize todos os eventos disponíveis
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Carregando calendário...
            </Text>
          </View>
        ) : (
          <View style={styles.calendarContainer}>
            {/* Navegação do Mês */}
            <View style={[styles.monthNavigation, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity
                onPress={() => navigateMonth('prev')}
                style={[styles.navButton, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Text style={[styles.currentMonthTitle, { color: theme.text }]}>
                {getMonthName(currentMonth)} {currentYear}
              </Text>
              
              <TouchableOpacity
                onPress={() => navigateMonth('next')}
                style={[styles.navButton, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Calendário do Mês Atual */}
            {renderCalendarMonth(currentYear, currentMonth)}
          </View>
        )}
      </ScrollView>
      <Footer theme={theme} />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        theme={theme}
      />

      {/* Modal de Eventos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventsModalVisible}
        onRequestClose={() => setEventsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            {/* Header do Modal */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {selectedDate && selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
              <TouchableOpacity
                onPress={() => setEventsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Lista de Eventos */}
            <ScrollView style={styles.eventsList}>
              {selectedDateEvents.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    Nenhum evento disponível nesta data
                  </Text>
                </View>
              ) : (
                selectedDateEvents.map(renderEventCard)
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  calendarContainer: {
    gap: 20,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentMonthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: '600',
    width: '13.5%',
    textAlign: 'center',
    paddingVertical: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  dayCell: {
    width: '13.5%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendLeft: {
    justifyContent: 'flex-start',
  },
  legendCenter: {
    justifyContent: 'center',
  },
  legendRight: {
    justifyContent: 'flex-end',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    textTransform: 'capitalize',
  },
  closeButton: {
    padding: 5,
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Estilos dos Cards de Eventos
  eventCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
  },
});

export default Calendario;