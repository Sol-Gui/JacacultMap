import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Image, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { getData } from '../../services/localStorage';
import { getUserData } from '../../services/user';
import { useTheme } from '../../contexts/ThemeContext';
import * as ImagePicker from 'react-native-image-picker';
import { sendEvent } from '../../services/events';
import Header from '../../styles/app/header';
import Footer from '../../styles/app/footer';

interface UserData {
  userData: {
    email: string;
    role: string;
    name: string;
  };
}

const CriarEvento = () => {
  console.log("Renderizando CriarEvento");
  const { theme } = useTheme();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = await getData('userToken');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado');
        router.replace('/(auth)/login');
        return;
      }

      const userData = await getUserData(token) as UserData;
      if (userData.userData.role !== 'admin') {
        Alert.alert('Acesso Negado', 'Apenas administradores podem acessar esta página');
        router.back();
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      router.back();
    }
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [locationType, setLocationType] = useState('physical');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState('');
  const [eventType, setEventType] = useState<string[]>([]);
  const [imageBanner, setImageBanner] = useState<any>(null);
  const [imageHeader, setImageHeader] = useState<any>(null);
  const [eventImages, setEventImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);

  const availableEventTypes = [
    'social',
    'turistico',
    'intelectual',
    'fisico',
    'artistico',
    'virtual',
    'gastronomico'
  ];

  const pickImage = async (type: 'banner' | 'header' | 'additional') => {
    // Configurações diferentes para cada tipo de imagem
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      quality: type === 'header' ? 0.7 : 0.5, // Maior qualidade para o header
      maxWidth: type === 'header' ? 800 : 1280,
      maxHeight: type === 'header' ? 400 : 720,
    };
    
    const result = await ImagePicker.launchImageLibrary(options);
    if (!result.didCancel && result.assets && result.assets[0]?.base64) {
      const imageData = {
        base64: result.assets[0].base64,
        type: result.assets[0].type || 'image/jpeg'
      };

      switch (type) {
        case 'banner':
          setImageBanner(imageData);
          break;
        case 'header':
          setImageHeader(imageData);
          break;
        case 'additional':
          setEventImages(prev => [...prev, imageData]);
          break;
      }
    }
  };

  // Função para processar a string base64
  const processBase64 = (base64: string, format: string) => {
    // Remove cabeçalho da string base64 se existir
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    
    // Pega apenas os primeiros 200KB da imagem se for maior que isso
    const maxLength = 200 * 1024; // 200KB em bytes
    const processedData = base64Data.length > maxLength ? base64Data.substring(0, maxLength) : base64Data;
    
    // Adiciona o prefixo correto baseado no formato
    const mimeType = format || 'image/jpeg';
    return `data:${mimeType};base64,${processedData}`;
  };

  const handleSubmit = async () => {
    try {
      if (!title || !description || !eventType[0] || !coordinates || !imageBanner || !imageHeader) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
        return;
      }

      setLoading(true);
      const token = await getData('userToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      const userData = await getUserData(token) as UserData;
      
      // Organizando os dados conforme a nova interface
      // Processando as imagens antes de montar o objeto
      const processedBanner = processBase64(imageBanner.base64, imageBanner.type);
      const processedHeader = processBase64(imageHeader.base64, imageHeader.type);
      const processedAdditional = eventImages.slice(0, 3).map(img => 
        processBase64(img.base64, img.type)
      );

      // Log para debug
      console.log('Tamanho da imagem do banner:', processedBanner.length);
      console.log('Tamanho da imagem do header:', processedHeader.length);

      const eventData = {
        title,
        description,
        id: Math.floor(Math.random() * 1000000), // ID temporário
        event_type: eventType[0], // Usando apenas o primeiro tipo selecionado
        event_image_banner: {
          imageBase64: processedBanner
        },
        event_image_header: {
          imageBase64: processedHeader
        },
        event_images: {
          imageBase64: processedAdditional
        },
        date,
        location_name: address || undefined,
        location_coordinates: coordinates,
      };

      await sendEvent(eventData);
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      Alert.alert('Erro', 'Não foi possível criar o evento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        onMenuPress={() => {}} 
        theme={theme}
        isDarkMode={false}
        onThemeToggle={() => {}}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>
          Criar Novo Evento
        </Text>

        <Text style={[styles.label, { color: theme.text }]}>Título do Evento</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
          placeholder="Digite o título do evento"
        />

        <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
          placeholder="Digite a descrição do evento"
        />

        <Text style={[styles.label, { color: theme.text }]}>Data e Hora</Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity 
            style={[styles.dateTimeButton, { backgroundColor: theme.card }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateTimeText, { color: theme.text }]}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dateTimeButton, { backgroundColor: theme.card }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={[styles.dateTimeText, { color: theme.text }]}>
              {date.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Selecionar Data</Text>
              <View style={styles.datePickerContainer}>
                <ScrollView style={styles.pickerScroll}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dateOption,
                        date.getDate() === day && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => {
                        const newDate = new Date(date);
                        newDate.setDate(day);
                        setDate(newDate);
                        setShowDatePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        date.getDate() === day && { color: '#fff' }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowTimePicker(false)}
          >
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Selecionar Hora</Text>
              <View style={styles.timePickerContainer}>
                <ScrollView style={styles.pickerScroll}>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.timeOption,
                        date.getHours() === hour && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => {
                        const newDate = new Date(date);
                        newDate.setHours(hour);
                        setDate(newDate);
                        setShowTimePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        date.getHours() === hour && { color: '#fff' }
                      ]}>
                        {hour.toString().padStart(2, '0')}:00
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Text style={[styles.label, { color: theme.text }]}>Tipo de Localização</Text>
        <View style={styles.locationTypeContainer}>
          {['physical', 'online', 'hybrid'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.locationTypeButton,
                { 
                  backgroundColor: locationType === type ? theme.primary : theme.card,
                }
              ]}
              onPress={() => setLocationType(type)}
            >
              <Text style={[
                styles.locationTypeText,
                { color: locationType === type ? '#fff' : theme.text }
              ]}>
                {type === 'physical' ? 'Presencial' : type === 'online' ? 'Online' : 'Híbrido'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Coordenadas</Text>
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateInput}>
            <Text style={[styles.coordinateLabel, { color: theme.text }]}>Latitude</Text>
            <TextInput
              value={coordinates ? coordinates[0].toString() : ''}
              onChangeText={(text) => {
                const lat = parseFloat(text);
                setCoordinates(prev => 
                  !isNaN(lat) ? [lat, prev?.[1] ?? 0] : null
                );
              }}
              style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
              placeholderTextColor={theme.textSecondary}
              placeholder="-22.9064"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.coordinateInput}>
            <Text style={[styles.coordinateLabel, { color: theme.text }]}>Longitude</Text>
            <TextInput
              value={coordinates ? coordinates[1].toString() : ''}
              onChangeText={(text) => {
                const lng = parseFloat(text);
                setCoordinates(prev => 
                  !isNaN(lng) ? [prev?.[0] ?? 0, lng] : null
                );
              }}
              style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
              placeholderTextColor={theme.textSecondary}
              placeholder="-45.9657"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Endereço ou Link</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
          placeholder="Digite o endereço ou link do evento"
        />

        <Text style={[styles.label, { color: theme.text }]}>Tipo do Evento</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.card }]}
          onPress={() => setShowEventTypePicker(true)}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Selecionar Tipo do Evento
          </Text>
        </TouchableOpacity>

        <Text style={[styles.helperText, { color: theme.textSecondary }]}>
          Selecione apenas um tipo para o evento
        </Text>
        
        <View style={styles.selectedTypesContainer}>
          {eventType.map((type, index) => (
            <View key={index} style={[styles.typeTag, { backgroundColor: theme.primary }]}>
              <Text style={styles.typeTagText}>{type}</Text>
              <TouchableOpacity 
                onPress={() => setEventType(prev => prev.filter((_, i) => i !== index))}
              >
                <Text style={styles.removeTagText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Imagem de Banner</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.card }]}
          onPress={() => pickImage('banner')}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Selecionar Banner
          </Text>
        </TouchableOpacity>

        {imageBanner?.base64 && (
          <Image
            source={{ uri: processBase64(imageBanner.base64, imageBanner.type) }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        )}

        <Text style={[styles.label, { color: theme.text }]}>Imagem de Cabeçalho</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.card }]}
          onPress={() => pickImage('header')}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Selecionar Cabeçalho
          </Text>
        </TouchableOpacity>

        {imageHeader?.base64 && (
          <Image
            source={{ uri: processBase64(imageHeader.base64, imageHeader.type) }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        )}

        <Text style={[styles.label, { color: theme.text }]}>Imagens Adicionais</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.card }]}
          onPress={() => {
            if (eventImages.length >= 3) {
              Alert.alert('Limite de Imagens', 'Você pode adicionar no máximo 3 imagens adicionais');
              return;
            }
            pickImage('additional');
          }}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Adicionar Imagem
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.helperText, { color: theme.textSecondary }]}>
          Máximo de 3 imagens adicionais. Imagens muito grandes serão redimensionadas.
        </Text>

        <ScrollView horizontal style={styles.additionalImagesContainer}>
          {eventImages.map((img, index) => (
            <View key={index} style={styles.additionalImageWrapper}>
              <Image
                source={{ uri: processBase64(img.base64, img.type) }}
                style={styles.additionalImagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setEventImages(prev => prev.filter((_, i) => i !== index))}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Modal
          visible={showEventTypePicker}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowEventTypePicker(false)}
          >
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Selecionar Tipo</Text>
              <ScrollView style={styles.typePickerScroll}>
                {availableEventTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      eventType.includes(type) && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => {
                      setEventType(prev => 
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      );
                    }}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      eventType.includes(type) && { color: '#fff' }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.doneButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowEventTypePicker(false)}
              >
                <Text style={styles.doneButtonText}>Concluído</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity 
          style={[
            styles.submitButton,
            { 
              backgroundColor: loading ? theme.card : theme.primary,
              opacity: loading ? 0.7 : 1
            }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Criando...' : 'Criar Evento'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer theme={theme} />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
    </View>
  );
}

export default CriarEvento;

const styles = StyleSheet.create({
  selectedTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  typeTagText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 6,
  },
  removeTagText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  additionalImagesContainer: {
    flexGrow: 0,
    marginVertical: 10,
  },
  additionalImageWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  additionalImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typePickerScroll: {
    maxHeight: 300,
  },
  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  typeOptionText: {
    fontSize: 16,
  },
  doneButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
  },
  locationTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationTypeButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  coordinateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  datePickerContainer: {
    height: 300,
  },
  timePickerContainer: {
    height: 300,
  },
  pickerScroll: {
    flex: 1,
  },
  dateOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  dateOptionText: {
    fontSize: 16,
  },
  timeOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 16,
  },
});