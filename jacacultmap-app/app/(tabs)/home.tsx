import React, { Component } from 'react';
import Footer from '../../styles/app/footer';
import Header from '../../styles/app/header';
import EventModal from '../../styles/app/eventModal';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Image,
} from 'react-native';

import { getCategoryStyles, type Category, type Event, type User } from '../../styles/app/mainPage';
import { getData } from '../../services/localStorage';
import { getLimitedEvents } from '../../services/events';
import { styles } from '../../styles/home';
import { getUserData } from '@/services/user';
import { useTheme } from '../../contexts/ThemeContext';

interface AppState {
  showSidebar: boolean;
  activeCategories: string[];
  searchQuery: string;
  filteredEvents: Event[];
  userData: User | null;
  categories: Category[] | null;
  events: Event[] | null;
  screenSize: {
    width: number;
    height: number;
  };
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isLoading: boolean;
  selectedEvent: Event | null;
  modalVisible: boolean;
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

const eventsCategories = [
  { id: 'intelectual', name: 'Intelectual' },
  { id: 'turistico', name: 'Turístico' },
  { id: 'social', name: 'Social' },
  { id: 'gastronomico', name: 'Gastronômico' },
  { id: 'fisico', name: 'Físico' },
  { id: 'virtual', name: 'Virtual' },
  { id: 'artistico', name: 'Artístico' },
];

let userToken: string | null = null;
let userData: any = null;

getData('userToken').then(token => {
  try {
    if (token) {
      userToken = token;
      getUserData(token).then(data => {
        userData = data;
      });
    }
  } catch (err) {
    console.log("Erro ao capturar token")
  }
})

const fetchCategories = async (): Promise<Category[]> => {
  try {
    if (!userToken) {
      return eventsCategories;
    }
    const favoriteIds = userData.userData?.favoritedCategories;
    
    if (!favoriteIds || favoriteIds.length === 0) {
      return eventsCategories;
    }
    
    const favoritedCategories = eventsCategories.filter(category => 
      favoriteIds.includes(category.id)
    );
    
    return favoritedCategories;
    
  } catch (error) {
    console.log('Failed to load categories:', error);
    return eventsCategories;
  }
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

interface EventItemState {
  modalVisible: boolean;
}

class EventItem extends Component<{ 
  event: Event; 
  categoryName: string; 
  theme: any;
  onEventPress: (event: Event) => void;
}, EventItemState> {
  state: EventItemState = {
    modalVisible: false
  };

  toggleModal = () => {
    this.setState(prev => ({ modalVisible: !prev.modalVisible }));
  };

  render() {
    const { event, categoryName, theme } = this.props;
    const { modalVisible } = this.state;
    const categoryStyle = getCategoryStyles(event.event_type);

    if (event.event_image_banner && event.event_image_banner.imageBase64 == 'NO-IMAGE') {
      event.event_image_banner.imageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwwAAAcECAYAAADmY4YFAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAADHkSURBVHgB7N1LiqbnnafhL21ZA0E1ITIgIAs8tacNrQWkFpC5AGkBWSvyBuwFyAuoGvWomx409KDGDQKDTZty09CVp8pXuFSSlXdmHL6I/3u4LvAGIs2TuvN5n188evz48dsTAADAe/zsBAAAEAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAAkAQDAACQBAMAAJAEAwAA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MAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAAAASTAAAABJMAAAAEkwAP/Wfh0IAAAAAAjyt55gg7IIAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYwgAAACxhAAAAljAAAABLGAAAgCUMAADAEgYAAGAJAwAAsIQBAABYARFGaMyJxOn/AAAAAElFTkSuQmCC";
    }

    return (
      <>
        <TouchableOpacity 
          style={[
            styles.eventItem, 
            { backgroundColor: '#0f7661ff' }
          ]}
          onPress={() => this.props.onEventPress(event)}
        >
          <Text 
          style={[styles.eventTitle]}
          numberOfLines={1}
          ellipsizeMode='tail'>{event.title}</Text>
          <Text 
          style={[styles.eventDescription]}
          numberOfLines={3}
          ellipsizeMode='tail'>{event.description}</Text>
          <Text style={[styles.eventDate]}>{formatDateTime(event.date)}</Text>
          <View style={[styles.eventCategory, { backgroundColor: categoryStyle.bg }]}>          
            <Text style={[styles.categoryText, { color: categoryStyle.fg }]}>{categoryName}</Text>
          </View>
            <Image
              source={{ uri: event.event_image_banner?.imageBase64 }}
              style={{
                ...styles.eventImage,
                borderColor: '#ffffff',
                borderWidth: 1
              }}
              resizeMode="cover"
            />
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
    screenSize: {
      width: typeof window !== 'undefined' ? window.innerWidth : 768,
      height: typeof window !== 'undefined' ? window.innerHeight : 1024,
    },
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    isLoading: false,
    selectedEvent: null,
    modalVisible: false,
  };

  async componentDidMount() {
    // Carrega apenas os dados, o tema é gerenciado pelo contexto
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

  openEventModal = (event: Event) => {
    this.setState({ selectedEvent: event, modalVisible: true });
  };

  closeEventModal = () => {
    this.setState({ selectedEvent: null, modalVisible: false });
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
              return <EventItem key={event.id} event={event} categoryName={categoryName} theme={theme} onEventPress={this.openEventModal} />;
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


  render() {
    return <HomeWrapper homeComponent={this} />;
  }
}

// Wrapper funcional para usar o hook useTheme
const HomeWrapper: React.FC<{ homeComponent: Home }> = ({ homeComponent }) => {
  const { theme, isDarkMode, toggleDarkMode, isLoading } = useTheme();

  if (isLoading) {
    return null; // ou um loading spinner
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>        
      <Header 
        onMenuPress={() => {}} 
        theme={theme}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
      />

      <View style={styles.mainContent}>
        {homeComponent.renderHomePage(theme)}
      </View>

      <Footer 
        theme={theme}
      />

      <EventModal
        visible={homeComponent.state.modalVisible}
        onClose={homeComponent.closeEventModal}
        event={homeComponent.state.selectedEvent}
        theme={theme}
        userData={userData}
        userToken={userToken}
      />
    </View>
  );
}

export default Home;