import React, { Component } from 'react';
import Footer from '../../styles/app/footer';
import Header from '../../styles/app/header';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';

import Novidades from './novidades';
import Configuracoes from './configuracoes';
import { ACCENTS, baseDark, baseLight, getCategoryStyles, type Category, type Event, type User } from '../../styles/app/mainPage';
import { saveData, getData } from '../../services/localStorage';
import { getLimitedEvents, getEvent } from '../../services/events';
import { styles } from '../../styles/home';

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
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isLoading: boolean;
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

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); // meses começam em 0
  const ano = date.getFullYear();

  const hora = String(date.getHours()).padStart(2, "0");

  return `${dia}/${mes}/${ano} às ${hora}h`;
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
        <Text style={[styles.categoryText, {color: isActive ? palette.fg : theme.text }]}>{category.name}</Text>
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
  state = {
    modalVisible: false
  };

  toggleModal = () => {
    this.setState(prev => ({ modalVisible: !prev.modalVisible }));
  };

  render() {
    const { event, categoryName, theme } = this.props;
    const { modalVisible } = this.state;
    const categoryStyle = getCategoryStyles(event.event_type);

    return (
      <>
        <TouchableOpacity 
          style={[
            styles.eventItem, 
            { backgroundColor: '#0f7661ff' }
          ]}
          onPress={this.toggleModal}
        >        
          <Text 
          style={[styles.eventTitle]}
          numberOfLines={2}
          ellipsizeMode='tail'>{event.title}</Text>
          <Text 
          style={[styles.eventDescription]}
          numberOfLines={3}
          ellipsizeMode='tail'>{event.description}</Text>
          <Text style={[styles.eventDate]}>{formatDateTime(event.date)}</Text>
          <View style={[styles.eventCategory, { backgroundColor: categoryStyle.bg }]}>          
            <Text style={[styles.categoryText, { color: categoryStyle.fg }]}>{categoryName}</Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>{event.title}</Text>
                <TouchableOpacity onPress={this.toggleModal}>
                  <Text style={[styles.closeButton, { color: theme.text }]}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Descrição:</Text>
                <Text style={[styles.modalText, { color: theme.text }]}>{event.description}</Text>
                
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Categoria:</Text>
                <Text style={[styles.modalText, { color: theme.text }]}>{categoryName}</Text>
                
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Data:</Text>
                <Text style={[styles.modalText, { color: theme.text }]}>{formatDateTime(event.date)}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

// Add this interface near the top of the file with other interfaces
interface EventsResponse {
  events: Event[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
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
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    isLoading: false,
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
      const { currentPage, itemsPerPage } = this.state;
      const [userData, categories, eventsData] = await Promise.all([
        fetchUserData(),
        fetchCategories(),
        getLimitedEvents(itemsPerPage, currentPage) as Promise<EventsResponse>
      ]);

      if (eventsData?.events) {
        this.setState({
          userData,
          categories,
          events: eventsData.events,
          filteredEvents: eventsData.events,
          totalPages: eventsData.pagination.totalPages,
          currentPage: eventsData.pagination.page
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  handlePageChange = async (newPage: number) => {
    try {
      this.setState({ isLoading: true });
      const { itemsPerPage } = this.state;
      
      const eventsData = await getLimitedEvents(itemsPerPage, newPage) as EventsResponse;
      
      if (eventsData?.events) {
        this.setState({
          currentPage: eventsData.pagination.page,
          events: eventsData.events,
          filteredEvents: eventsData.events,
          totalPages: eventsData.pagination.totalPages,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error changing page:', error);
      this.setState({ isLoading: false });
    }
  };

  updateFilteredEvents = async () => {
    const { events, searchQuery, activeCategories } = this.state;
    if (!events) return;
    
    try {
      let filtered = [...events]; // Create a copy of the array
      
      if (searchQuery) {
        filtered = filtered.filter((event) => 
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (activeCategories.length > 0) {
        filtered = filtered.filter((event) => 
          activeCategories.includes(event.event_type)
        );
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
      currentPage: 1 // Reset to first page when filtering
    }), () => {
      this.updateFilteredEvents();
    });
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
    const { categories, filteredEvents, currentPage, totalPages } = this.state;

    return (
      <ScrollView style={styles.content}>
        <SearchBar
          value={this.state.searchQuery}
          onChangeText={(searchQuery) => {
            this.setState({ searchQuery, currentPage: 1 }, () => {
              this.updateFilteredEvents();
            });
          }}
          onSubmit={() => this.updateFilteredEvents()}
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
              const categoryName = categories?.find((c) => c.id === event.event_type)?.name || event.event_type; // Mudando de category para event_type
              return <EventItem key={event.id} event={event} categoryName={categoryName} theme={theme} />;
            })}

            {/* Pagination Controls */}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  { 
                    backgroundColor: theme.card,
                    opacity: currentPage <= 1 ? 0.5 : 1 
                  }
                ]}
                onPress={() => currentPage > 1 && this.handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <Text style={[styles.pageButtonText, { color: theme.text }]}>Anterior</Text>
              </TouchableOpacity>

              <Text style={[styles.pageText, { color: theme.text }]}>
                Página {currentPage} de {totalPages || 1}
              </Text>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  { 
                    backgroundColor: theme.card,
                    opacity: currentPage >= totalPages ? 0.5 : 1 
                  }
                ]}
                onPress={() => currentPage < totalPages && this.handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <Text style={[styles.pageButtonText, { color: theme.text }]}>Próxima</Text>
              </TouchableOpacity>
            </View>
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

export default Home;