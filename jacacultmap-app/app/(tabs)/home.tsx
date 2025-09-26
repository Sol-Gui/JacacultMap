import React, { Component } from 'react';
import Footer from '../../styles/app/footer';
import Header from '../../styles/app/header';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';

import Novidades from './novidades';
import Configuracoes from './configuracoes';
import { ACCENTS, baseDark, baseLight, getCategoryStyles, type Category, type Event, type User } from '../../styles/app/mainPage';
import { saveData, getData } from '../../services/localStorage';

interface AppState {
  showSidebar: boolean;
  activeCategories: string[];
  searchQuery: string;
  filteredEvents: Event[];
  userData: User | null;
  categories: Category[] | null;
  events: Event[] | null;
  currentRoute: string; // '/home' | '/novidades' | '/configuracoes'
  screenSize: {
    width: number;
    height: number;
  };
  isDarkMode: boolean;
  accentColor: string;
}

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

// Main App Component
class Home extends Component<{}, AppState> {
  private focusListener: any = null;

  state: AppState = {
    showSidebar: false,
    activeCategories: [],
    searchQuery: '',
    filteredEvents: [],
    userData: null,
    categories: null,
    events: null,
    currentRoute: '/home',
    screenSize: {
      width: typeof window !== 'undefined' ? window.innerWidth : 768,
      height: typeof window !== 'undefined' ? window.innerHeight : 1024,
    },
    isDarkMode: false,
    accentColor: ACCENTS.emerald,
  };

  async componentDidMount() {
    // Carrega o tema e os dados inicialmente
    await this.loadTheme();
    this.loadData();

    // Se você estiver usando navigation do React Navigation, adicione o listener aqui
    // this.focusListener = this.props.navigation?.addListener('focus', this.handleScreenFocus);
  }

  componentWillUnmount() {
    // Remove o listener se existir
    if (this.focusListener) {
      this.focusListener();
    }
  }

  componentDidUpdate(prevProps: {}, prevState: AppState) {
    // Carrega o tema sempre que a rota mudar para uma das rotas principais
    if (prevState.currentRoute !== this.state.currentRoute && 
        ['/home', '/novidades', '/configuracoes'].includes(this.state.currentRoute)) {
      this.loadTheme();
    }

    if (
      prevState.events !== this.state.events ||
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.activeCategories !== this.state.activeCategories
    ) {
      this.updateFilteredEvents();
    }
  }

  // Método chamado pelo Footer quando há mudança de rota
  handleRouteChange = (route: string) => {
    // Sempre recarrega o tema quando uma rota é acessada
    if (['/home', '/novidades', '/configuracoes'].includes(route)) {
      this.setState({ currentRoute: route }, () => {
        this.loadTheme();
      });
    }
  };

  // Método para ser chamado quando a tela receber foco (se usando React Navigation)
  handleScreenFocus = () => {
    this.loadTheme();
  };

  loadTheme = async () => {
    try {
      const saved = await getData('isDarkMode');
      if (saved !== null) {
        const isDark = saved === 'true';
        this.setState({ isDarkMode: isDark });
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      // Define um valor padrão em caso de erro
      this.setState({ isDarkMode: false });
    }
  };

  loadData = async () => {
    try {
      const [userData, categories, events] = await Promise.all([
        fetchUserData(),
        fetchCategories(),
        fetchEvents(),
      ]);
      this.setState({ userData, categories, events, filteredEvents: events });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  updateFilteredEvents = async () => {
    const { events, searchQuery, activeCategories } = this.state;
    if (!events) return;
    
    try {
      let filtered = events;
      if (searchQuery) {
        filtered = await searchEvents(searchQuery, events);
      }
      if (activeCategories.length > 0) {
        filtered = filtered.filter((event) => activeCategories.includes(event.category));
      }
      this.setState({ filteredEvents: filtered });
    } catch (error) {
      console.error('Erro ao filtrar eventos:', error);
    }
  };

  toggleCategory = (categoryId: string) => {
    this.setState((prevState) => ({
      activeCategories: prevState.activeCategories.includes(categoryId)
        ? prevState.activeCategories.filter((id) => id !== categoryId)
        : [...prevState.activeCategories, categoryId],
    }));
  };

  setDarkMode = (v: boolean) => this.setState({ isDarkMode: v });
  
  toggleDarkMode = async () => {
    const newDarkMode = !this.state.isDarkMode;
    this.setState({ isDarkMode: newDarkMode });
    
    try {
      await saveData('isDarkMode', newDarkMode.toString());
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  changeAccent = (hex: string) => this.setState({ accentColor: hex });

  navigateTo = async (route: string) => {
    // Atualiza a rota primeiro
    this.setState({ currentRoute: route });
    
    // O loadTheme será chamado automaticamente pelo componentDidUpdate
    // quando a rota for uma das rotas principais (/home, /novidades, /configuracoes)
  };

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

  renderCurrentRoute = (theme: any) => {
    const { currentRoute } = this.state;
    
    switch (currentRoute) {
      case '/home':
        return this.renderHomePage(theme);
      
      case '/novidades':
        return (
          <View style={styles.content}>
            <Novidades/>
          </View>
        );
      
      case '/configuracoes':
        return (
          <View style={styles.content}>
            <Configuracoes/>
          </View>
        );
      
      default:
        return this.renderHomePage(theme);
    }
  };

  render() {
    const { showSidebar, userData, currentRoute, isDarkMode, accentColor } = this.state;

    // Criação do tema
    const theme = isDarkMode ? { ...baseDark, primary: accentColor } : { ...baseLight, primary: accentColor };

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>        
        <Header 
          onMenuPress={() => {}} 
          theme={theme}
          isDarkMode={isDarkMode}
          onThemeToggle={this.toggleDarkMode}
        />

        <View style={styles.mainContent}>
          {this.renderCurrentRoute(theme)}
        </View>

        <Footer 
          theme={theme}
          onRouteChange={this.handleRouteChange}
        />
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  appLayout: { flex: 1, flexDirection: 'column' },
  mainContent: { flex: 1, paddingBottom: 72 },

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

export default Home;