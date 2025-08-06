import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';

// Types
interface Category {
  id: string;
  name: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  category: string;
}

interface User {
  name: string;
  email: string;
}

interface AppState {
  showSidebar: boolean;
  activeCategories: string[];
  searchQuery: string;
  filteredEvents: Event[];
  userData: User | null;
  categories: Category[] | null;
  events: Event[] | null;
  loading: boolean;
  currentRoute: string;
  screenSize: {
    width: number;
    height: number;
  };
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
        email: 'negociosleonardo240108@gmail.com'
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
        { id: 'social', name: 'Social' }
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
        { id: 6, title: 'Festa Comunitária', date: '2025-08-03', category: 'social' }
      ]);
    }, 400);
  });
};

const searchEvents = async (query: string, events: Event[]): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 200);
  });
};

// Reusable Components
class Header extends Component<{ onMenuPress: () => void }> {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onMenuPress} style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine}></View>
            <View style={styles.menuLine}></View>
            <View style={styles.menuLine}></View>
          </View>
        </TouchableOpacity>
        <View style={styles.avatar}>
          <View style={styles.avatarInner}>
            <View style={styles.avatarDot}></View>
          </View>
        </View>
      </View>
    );
  }
}

class SearchBar extends Component<{
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}> {
  render() {
    const { value, onChangeText, onSubmit } = this.props;
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <View style={styles.searchIconCircle}></View>
            <View style={styles.searchIconHandle}></View>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholderTextColor="#9CA3AF"
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
}> {
  render() {
    const { category, isActive, onPress } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isActive && styles.categoryChipActive
        ]}
        onPress={onPress}
      >
        <View style={[
          styles.categoryDot,
          isActive && styles.categoryDotActive
        ]} />
        <Text style={[
          styles.categoryText,
          isActive && styles.categoryTextActive
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }
}

class NewsCard extends Component<{ 
  news: typeof newsData[0],
  onPress?: () => void 
}> {
  render() {
    const { news, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.newsCard} onPress={onPress}>
        <View style={styles.newsCardContent}>
          <Text numberOfLines={2} style={styles.newsTitle}>
            {news.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class EventItem extends Component<{ event: Event; categoryName: string }> {
  getCategoryStyles = (category: string) => {
    switch (category) {
      case 'intelectual': 
        return { 
          backgroundColor: '#DBEAFE', 
          color: '#1E40AF' 
        };
      case 'turistico': 
        return { 
          backgroundColor: '#FED7AA', 
          color: '#EA580C' 
        };
      case 'social': 
        return { 
          backgroundColor: '#E9D5FF', 
          color: '#7C3AED' 
        };
      default: 
        return { 
          backgroundColor: '#F3F4F6', 
          color: '#374151' 
        };
    }
  };

  render() {
    const { event, categoryName } = this.props;
    const categoryStyles = this.getCategoryStyles(event.category);

    return (
      <View style={styles.eventItem}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <View style={[
          styles.eventCategory,
          { backgroundColor: categoryStyles.backgroundColor }
        ]}>
          <Text style={{ color: categoryStyles.color }}>
            {categoryName}
          </Text>
        </View>
      </View>
    );
  }
}

class SideMenu extends Component<{
  visible: boolean;
  user: User | null;
  onClose: () => void;
}> {
  render() {
    const { visible, user, onClose } = this.props;
    
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          
          <View style={styles.sidebar}>
            {user && (
              <View style={{ flex: 1 }}>
                <View style={styles.sidebarHeader}>
                  <View style={styles.sidebarAvatar}>
                    <View style={styles.sidebarAvatarIcon}>
                      <View style={styles.personIcon}>
                        <View style={styles.personHead} />
                        <View style={styles.personBody} />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.sidebarName}>{user.name}</Text>
                  <Text style={styles.sidebarEmail}>{user.email}</Text>
                </View>
                
                <View style={styles.sidebarMenu}>
                  <TouchableOpacity style={styles.sidebarMenuItem}>
                    <View style={styles.settingsIcon} />
                    <Text style={styles.sidebarMenuText}>Configurações</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sidebarMenuItem}>
                    <View style={styles.notificationIcon} />
                    <Text style={styles.sidebarMenuText}>Notificações</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.sidebarFooter}>
                  <TouchableOpacity style={styles.logoutButton}>
                    <View style={styles.logoutIcon} />
                    <Text style={styles.logoutText}>Sair</Text>
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

class BottomNavigation extends Component<{ onNavigate: (route: string) => void; isMobile: boolean }> {
  render() {
    const { onNavigate, isMobile } = this.props;
    
    if (!isMobile) return null;

    return (
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate('/home')}
        >
          <View style={{...styles.navIcon, ...styles.navIconActive}}>
            <View style={styles.mapPin}></View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate('/calendar')}
        >
          <View style={styles.navIcon}>
            <View style={styles.calendarIcon}>
              <View style={styles.calendarTop}></View>
              <View style={styles.calendarBody}></View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate('/test')}
        >
          <View style={styles.navIcon}>
            <View style={styles.heartIcon}>
              <View style={styles.heartLeft}></View>
              <View style={styles.heartRight}></View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

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
      height: typeof window !== 'undefined' ? window.innerHeight : 1024
    }
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
    try {
      const [userData, categories, events] = await Promise.all([
        fetchUserData(),
        fetchCategories(),
        fetchEvents()
      ]);
      
      this.setState({
        userData,
        categories,
        events,
        loading: false
      });
    } catch (error) {
      console.error('Error loading data:', error);
      this.setState({ loading: false });
    }
  };

  updateFilteredEvents = async () => {
    const { events, searchQuery, activeCategories } = this.state;
    
    if (!events) return;
    
    let filtered = events;
    
    if (searchQuery) {
      filtered = await searchEvents(searchQuery, events);
    }
    
    if (activeCategories.length > 0) {
      filtered = filtered.filter(event => 
        activeCategories.includes(event.category)
      );
    }
    
    this.setState({ filteredEvents: filtered });
  };

  handleResize = () => {
    this.setState({
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  };

  isMobile = () => this.state.screenSize.width < 768;
  isTablet = () => this.state.screenSize.width >= 768 && this.state.screenSize.width < 1024;
  isDesktop = () => this.state.screenSize.width >= 1024;

  toggleCategory = (categoryId: string) => {
    this.setState(prevState => ({
      activeCategories: prevState.activeCategories.includes(categoryId)
        ? prevState.activeCategories.filter(id => id !== categoryId)
        : [...prevState.activeCategories, categoryId]
    }));
  };

  handleSearch = () => {
    console.log('Pesquisando por:', this.state.searchQuery);
  };

  navigateToRoute = (route: string) => {
    console.log('Navegando para:', route);
    this.setState({ currentRoute: route });
  };

  renderHomePage = () => {
    const { categories, filteredEvents, searchQuery } = this.state;
    
    return (
      <ScrollView style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={(searchQuery) => this.setState({ searchQuery })}
          onSubmit={this.handleSearch}
        />

        {/* Novidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Novidades</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.newsContainer}
          >
            {newsData.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </ScrollView>
        </View>

        {/* Categorias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesContainer}>
            {categories?.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                isActive={this.state.activeCategories.includes(category.id)}
                onPress={() => this.toggleCategory(category.id)}
              />
            ))}
          </View>
        </View>

        {/* Eventos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos</Text>
          <View style={styles.eventsContainer}>
            {filteredEvents.map((event) => {
              const categoryName = categories?.find(c => c.id === event.category)?.name || event.category;
              return (
                <EventItem
                  key={event.id}
                  event={event}
                  categoryName={categoryName}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  renderCurrentPage = () => {
    switch (this.state.currentRoute) {
      case '/test':
        return (
          <View style={styles.pageContainer}>
            <Text style={styles.pageTitle}>Em Desenvolvimento</Text>
            <Text style={styles.pageText}>Esta funcionalidade está em desenvolvimento...</Text>
          </View>
        );
      case '/calendar':
        return (
          <View style={styles.pageContainer}>
            <Text style={styles.pageTitle}>Calendário</Text>
            <Text style={styles.pageText}>Página do calendário em desenvolvimento...</Text>
          </View>
        );
      case '/home':
      default:
        return this.renderHomePage();
    }
  };

  render() {
    const { loading, showSidebar, userData, currentRoute } = this.state;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.appLayout}>
          <SideMenu
            visible={showSidebar}
            user={userData}
            onClose={() => this.setState({ showSidebar: false })}
          />

          <View style={styles.mainContent}>
            {currentRoute !== '/test' && (
              <Header
                onMenuPress={() => this.setState({ showSidebar: true })}
              />
            )}
            {this.renderCurrentPage()}
          </View>
        </View>

        <BottomNavigation
          onNavigate={this.navigateToRoute}
          isMobile={true}
        />
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  appLayout: {
    flex: 1,
    flexDirection: 'column'
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    paddingBottom: 80
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8, // Optional: adds rounded corners
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  menuButton: {
    padding: 4,
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  menuIcon: {
    width: 24,
    height: 24,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 3
  },
  menuLine: {
    height: 2,
    backgroundColor: '#374151',
    borderRadius: 1
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarInner: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarDot: {
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6
  },
  searchContainer: {
    padding: 0,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    position: 'relative'
  },
  searchIconCircle: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderRadius: 7,
    position: 'absolute',
    top: 0,
    left: 0
  },
  searchIconHandle: {
    width: 6,
    height: 2,
    backgroundColor: '#9CA3AF',
    transform: 'rotate(45deg)',
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderRadius: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  content: {
    flex: 1,
    padding: 0,
    paddingBottom: 80
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  newsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  newsCard: {
    flexShrink: 0,
    width: 200,
    marginRight: 16,
  },
  newsCardContent: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    height: 128,
    justifyContent: 'flex-end',
    padding: 16
  },
  newsTitle: {
    color: 'white',
    fontSize: 14, // Increased from 10
    fontWeight: '600',
    marginTop: 'auto', // Push text to bottom
    width: '100%', // Full width
    height: 'auto', // Auto height instead of 50%
    lineHeight: 20,
    textAlign: 'left'
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8
  },
  categoryChipActive: {
    backgroundColor: '#10B981'
  },
  categoryDot: {
    width: 16,
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    marginRight: 8
  },
  categoryDotActive: {
    backgroundColor: 'white'
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151'
  },
  categoryTextActive: {
    color: 'white'
  },
  eventsContainer: {
    flex: 1,
    paddingBottom: 100
  },
  eventItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  eventDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8
  },
  eventCategory: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  navIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navIconActive: {
    backgroundColor: '#10B981'
  },
  mapPin: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4
  },
  calendarIcon: {
    width: 20,
    height: 20
  },
  calendarTop: {
    width: 20,
    height: 4,
    backgroundColor: '#6B7280',
    borderRadius: 2
  },
  calendarBody: {
    width: 20,
    height: 14,
    backgroundColor: '#6B7280',
    borderRadius: 2,
    marginTop: 1
  },
  heartIcon: {
    width: 20,
    height: 18,
    position: 'relative'
  },
  heartLeft: {
    width: 10,
    height: 16,
    backgroundColor: '#6B7280',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    transform: [{ rotate: '-45deg' }] // Correct format for React Native
  },
  heartRight: {
    width: 10,
    height: 16,
    backgroundColor: '#6B7280',
    borderRadius: 10,
    position: 'absolute',
    right: 0,
    transform: [{ rotate: '45deg' }] // Correct format for React Native
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row-reverse', // Changed from 'row' to 'row-reverse'
    backgroundColor: 'transparent'
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  sidebar: {
    width: 320,
    height: '100%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderLeftWidth: 1, // Changed from borderRightWidth
    borderLeftColor: '#E5E7EB', // Changed from borderRightColor
    elevation: 5
  },
  sidebarHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  sidebarAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  sidebarAvatarIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  personIcon: {
    width: 16,
    height: 16,
    position: 'relative'
  },
  personHead: {
    width: 6,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 5
  },
  personBody: {
    width: 10,
    height: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: 3
  },
  sidebarName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 0,
    marginBottom: 0
  },
  sidebarEmail: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 0,
    marginBottom: 0
  },
  sidebarMenu: {
    marginBottom: 24
  },
  sidebarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 4
  },
  sidebarMenuText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12
  },
  settingsIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#6B7280',
    borderRadius: 8
  },
  notificationIcon: {
    width: 14,
    height: 16,
    backgroundColor: '#6B7280',
    borderRadius: 7
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 0
  },
  logoutIcon: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  logoutText: {
    fontSize: 14,
    color: '#374151'
  },
  // Generic Page Styles
  pageContainer: {
    flex: 1,
    padding: 32,
    backgroundColor: '#F9FAFB',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16
  },

  pageText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center'
  }
});

export default MobileAppInterface;