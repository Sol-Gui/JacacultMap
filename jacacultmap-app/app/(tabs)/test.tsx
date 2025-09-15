import React, { Component } from 'react';
import Footer from '../../styles/app/footer';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Image,
  StyleSheet,
} from 'react-native';

import Novidades from './novidades';
import Configuracoes from './configuracoes';
import { ACCENTS, baseDark, baseLight, getCategoryStyles, type Category, type Event, type User } from '../../styles/app/mainPage';

// Types moved to styles/app/mainPage
const basicImageB64 = "data:image/png;base64,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";

interface AppState {
  showSidebar: boolean;
  activeCategories: string[];
  searchQuery: string;
  filteredEvents: Event[];
  userData: User | null;
  categories: Category[] | null;
  events: Event[] | null;
  loading: boolean;
  currentRoute: string; // '/home' | '/novidades' | '/configuracoes'
  screenSize: {
    width: number;
    height: number;
  };
  isDarkMode: boolean;
  accentColor: string;
}

// Themes moved to styles/app/mainPage

// ACCENTS moved to styles/app/mainPage

// Sample news data
const newsData = [
  { id: 1, title: 'Festival de Arte Moderna' },
  { id: 2, title: 'Nova Exposição no Museu' },
  { id: 3, title: 'Workshop de Fotografia' },
  { id: 4, title: 'Concerto de Música Clássica' },
  { id: 5, title: 'Teatro ao Ar Livre' },
];

// Async Data Functions
const fetchUserData = async (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Leonardo',
        email: 'negociosleonardo240108@gmail.com',
      });
    }, 500);
  });
};

const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'intelectual', name: 'Intelectual' },
        { id: 'turistico', name: 'Turístico' },
        { id: 'social', name: 'Social' },
      ]);
    }, 300);
  });
};

const fetchEvents = async (): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Evento Cultural', date: '2025-07-28', category: 'intelectual' },
        { id: 2, title: 'Tour pela Cidade', date: '2025-07-29', category: 'turistico' },
        { id: 3, title: 'Encontro Social', date: '2025-07-30', category: 'social' },
        { id: 4, title: 'Workshop de Arte', date: '2025-08-01', category: 'intelectual' },
        { id: 5, title: 'Caminhada Ecológica', date: '2025-08-02', category: 'turistico' },
        { id: 6, title: 'Festa Comunitária', date: '2025-08-03', category: 'social' },
      ]);
    }, 400);
  });
};

const searchEvents = async (query: string, events: Event[]): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = events.filter((event) => event.title.toLowerCase().includes(query.toLowerCase()));
      resolve(filtered);
    }, 200);
  });
};

// getCategoryStyles moved to styles/app/mainPage

// Reusable Components
class Header extends Component<{ onMenuPress: () => void; theme: any }> {
  render() {
    const { onMenuPress, theme } = this.props;
    return (
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>        
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <View style={[styles.menuLine, { backgroundColor: theme.text }]} />
            <View style={[styles.menuLine, { backgroundColor: theme.text }]} />
            <View style={[styles.menuLine, { backgroundColor: theme.text }]} />
          </View>
        </TouchableOpacity>
        <Image
          source={{ uri: basicImageB64 }}
          style={styles.avatar}
        />
      </View>
    );
  }
}

class SearchBar extends Component<{
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  theme: any;
}> {
  render() {
    const { value, onChangeText, onSubmit, theme } = this.props;
    return (
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>          
          <View style={styles.searchIcon}>
            <View style={[styles.searchIconCircle, { borderColor: theme.textSecondary }]} />
            <View style={[styles.searchIconHandle, { backgroundColor: theme.textSecondary }]} />
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Pesquisar"
            placeholderTextColor={theme.textSecondary}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
          />
        </View>
      </View>
    );
  }
}

class CategoryChip extends Component<{
  category: Category;
  isActive: boolean;
  onPress: () => void;
  theme: any;
}> {
  render() {
    const { category, isActive, onPress, theme } = this.props;
    const palette = getCategoryStyles(category.id);
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          {
            backgroundColor: isActive ? palette.bg : theme.card,
            borderColor: isActive ? palette.bg : theme.border,
          },
        ]}
        onPress={onPress}
      >
        <View style={[styles.categoryDot, { backgroundColor: isActive ? palette.fg : palette.fg, opacity: isActive ? 1 : 0.6 }]} />
        <Text style={{ color: isActive ? palette.fg : theme.text }}>{category.name}</Text>
      </TouchableOpacity>
    );
  }
}

class NewsCard extends Component<{ news: typeof newsData[0]; theme: any }> {
  render() {
    const { news, theme } = this.props;
    return (
      <View style={[styles.newsCard, { backgroundColor: theme.primary }]}>        
        <Text numberOfLines={2} style={[styles.newsTitle, { color: '#fff' }]}>
          {news.title}
        </Text>
      </View>
    );
  }
}

class EventItem extends Component<{ event: Event; categoryName: string; theme: any }> {
  render() {
    const { event, categoryName, theme } = this.props;
    const cat = getCategoryStyles(event.category);
    return (
      <View style={[styles.eventItem, { backgroundColor: theme.card, borderColor: theme.border }]}>        
        <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
        <Text style={[styles.eventDate, { color: theme.textSecondary }]}>{event.date}</Text>
        <View style={[styles.eventCategory, { backgroundColor: cat.bg }]}>          
          <Text style={{ color: cat.fg, fontWeight: '600' }}>{categoryName}</Text>
        </View>
      </View>
    );
  }
}

class SideMenu extends Component<{
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onChangeAccent: (hex: string) => void;
  theme: any;
}> {
  render() {
    const { visible, user, onClose, onToggleDarkMode, isDarkMode, onChangeAccent, theme } = this.props;
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
          <View style={[styles.sidebar, { backgroundColor: theme.card, borderLeftColor: theme.border }]}>            
            {user && (
              <View style={{ flex: 1 }}>
                <View style={styles.sidebarHeader}>
                  <Text style={[styles.sidebarName, { color: theme.text }]}>{user.name}</Text>
                  <Text style={[styles.sidebarEmail, { color: theme.textSecondary }]}>{user.email}</Text>
                </View>

                <View style={styles.sidebarMenu}>
                  <TouchableOpacity style={styles.sidebarMenuItem} onPress={onToggleDarkMode}>
                    <Text style={[styles.sidebarMenuText, { color: theme.text }]}>
                      {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.sidebarMenuText, { color: theme.text, marginBottom: 8 }]}>Cor de destaque</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {Object.values(ACCENTS).map((hex) => (
                        <TouchableOpacity key={hex} onPress={() => onChangeAccent(hex)} style={[styles.accentDot, { backgroundColor: hex }]} />
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.sidebarFooter}>
                  <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.background }]}>
                    <Text style={[styles.logoutText, { color: theme.text }]}>Sair</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

// Footer moved to styles/app/footer

// Main App Component
class MobileAppInterface extends Component<{}, AppState> {
  state: AppState = {
    showSidebar: false,
    activeCategories: [],
    searchQuery: '',
    filteredEvents: [],
    userData: null,
    categories: null,
    events: null,
    loading: true,
    currentRoute: '/home',
    screenSize: {
      width: typeof window !== 'undefined' ? window.innerWidth : 768,
      height: typeof window !== 'undefined' ? window.innerHeight : 1024,
    },
    isDarkMode: false,
    accentColor: ACCENTS.emerald,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: {}, prevState: AppState) {
    if (
      prevState.events !== this.state.events ||
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.activeCategories !== this.state.activeCategories
    ) {
      this.updateFilteredEvents();
    }
  }

  loadData = async () => {
    const [userData, categories, events] = await Promise.all([
      fetchUserData(),
      fetchCategories(),
      fetchEvents(),
    ]);
    this.setState({ userData, categories, events, filteredEvents: events, loading: false });
  };

  updateFilteredEvents = async () => {
    const { events, searchQuery, activeCategories } = this.state;
    if (!events) return;
    let filtered = events;
    if (searchQuery) filtered = await searchEvents(searchQuery, events);
    if (activeCategories.length > 0) {
      filtered = filtered.filter((event) => activeCategories.includes(event.category));
    }
    this.setState({ filteredEvents: filtered });
  };

  toggleCategory = (categoryId: string) => {
    this.setState((prevState) => ({
      activeCategories: prevState.activeCategories.includes(categoryId)
        ? prevState.activeCategories.filter((id) => id !== categoryId)
        : [...prevState.activeCategories, categoryId],
    }));
  };

  setDarkMode = (v: boolean) => this.setState({ isDarkMode: v });
  toggleDarkMode = () => this.setState((prev) => ({ isDarkMode: !prev.isDarkMode }));
  changeAccent = (hex: string) => this.setState({ accentColor: hex });

  navigateTo = (route: string) => this.setState({ currentRoute: route });

  // Pages
  renderHomePage = (theme: any) => {
    const { categories, filteredEvents, searchQuery } = this.state;
    return (
      <ScrollView style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={(searchQuery) => this.setState({ searchQuery })}
          onSubmit={() => {}}
          theme={theme}
        />

        {/* Novidades (cards horizontais) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Novidades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
            {newsData.map((n) => (
              <NewsCard key={n.id} news={n} theme={theme} />
            ))}
          </ScrollView>
        </View>

        {/* Categorias */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categorias</Text>
          <View style={styles.categoriesContainer}>
            {categories?.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                isActive={this.state.activeCategories.includes(category.id)}
                onPress={() => this.toggleCategory(category.id)}
                theme={theme}
              />
            ))}
          </View>
        </View>

        {/* Eventos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Eventos</Text>
          <View style={styles.eventsContainer}>
            {filteredEvents.map((event) => {
              const categoryName = categories?.find((c) => c.id === event.category)?.name || event.category;
              return <EventItem key={event.id} event={event} categoryName={categoryName} theme={theme} />;
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  // Pages moved to separate files: Novidades and Configurações

  render() {
    const { showSidebar, userData, currentRoute, isDarkMode, accentColor } = this.state;

    const theme = {
      ...(isDarkMode ? baseDark : baseLight),
      primary: accentColor,
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>        
        <SideMenu
          visible={showSidebar}
          user={userData}
          onClose={() => this.setState({ showSidebar: false })}
          onToggleDarkMode={this.toggleDarkMode}
          isDarkMode={isDarkMode}
          onChangeAccent={this.changeAccent}
          theme={theme}
        />

        <View style={styles.mainContent}>
          <Header onMenuPress={() => this.setState({ showSidebar: true })} theme={theme} />
          {currentRoute === '/home' && this.renderHomePage(theme)}
          {currentRoute === '/novidades' && <Novidades theme={theme} />}
          {currentRoute === '/configuracoes' && (
            <Configuracoes
              theme={theme}
              isDarkMode={isDarkMode}
              accentColor={accentColor}
              onSetDarkMode={this.setDarkMode}
              onChangeAccent={this.changeAccent}
            />
          )}
        </View>

        {/* Nav fixo no rodapé */}
        <Footer theme={theme} />
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  appLayout: { flex: 1, flexDirection: 'column' },
  mainContent: { flex: 1, paddingBottom: 72 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuButton: { padding: 4 },
  menuIcon: { width: 24, height: 24, flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 3 },
  menuLine: { height: 2, borderRadius: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  searchContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, borderWidth: 1 },
  searchIcon: { width: 20, height: 20, marginRight: 8, position: 'relative' },
  searchIconCircle: { width: 14, height: 14, borderWidth: 2, borderRadius: 7, position: 'absolute' },
  searchIconHandle: { width: 6, height: 2, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: 2, right: 2, borderRadius: 1 },
  searchInput: { flex: 1, fontSize: 16 },

  content: { flex: 1, paddingBottom: 80 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, paddingHorizontal: 16 },

  // Novidades
  newsCard: { width: 220, marginRight: 16, height: 120, borderRadius: 16, padding: 16, justifyContent: 'flex-end' },
  newsTitle: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  newsRow: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },

  // Categorias
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },

  // Eventos
  eventsContainer: { flex: 1, paddingBottom: 100, paddingHorizontal: 16 },
  eventItem: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  eventTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  eventDate: { fontSize: 14, marginBottom: 8 },
  eventCategory: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },

  // Modal/Sidebar
  modalOverlay: { flex: 1, flexDirection: 'row-reverse' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: { width: 300, height: '100%', padding: 16, borderLeftWidth: 1 },
  sidebarHeader: { alignItems: 'center', marginBottom: 24 },
  sidebarName: { fontSize: 16, fontWeight: '700' },
  sidebarEmail: { fontSize: 12 },
  sidebarMenu: { marginBottom: 24 },
  sidebarMenuItem: { paddingVertical: 12, paddingHorizontal: 8 },
  sidebarMenuText: { fontSize: 14 },
  sidebarFooter: { borderTopWidth: 1, paddingTop: 16 },
  logoutButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  logoutText: { fontSize: 14 },
  accentDot: { width: 26, height: 26, borderRadius: 13, marginRight: 10, borderColor: '#fff' },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  navButton: { paddingHorizontal: 8, paddingVertical: 4 },
  navText: { fontSize: 14, fontWeight: '700' },

  // Settings styles
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    marginBottom: 12,
    borderColor: '#E5E7EB', // fallback, will be overridden by theme
    borderRadius: 8,
    backgroundColor: '#fff', // fallback, will be overridden by theme
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MobileAppInterface;
