import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { getData } from '../../services/localStorage';
import { getUserData, updateUserData } from '../../services/user';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../styles/app/header';
import Footer from '../../styles/app/footer';
import Sidebar from '../../styles/app/sidebar';

export default function Profile() {
  const { theme, isDarkMode, toggleDarkMode, isLoading } = useTheme();
  const { userPhotoUri, updateUserPhoto } = useUser();
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      try {
        const token = await getData('userToken') as string;
        if (!token) return;
        const data: any = await getUserData(token);
        const b64 = data?.userData?.profilePicture?.imageBase64;
        setName(data?.userData?.name || 'Usuário');
        setEmail(data?.userData?.email || '');
        if (b64 && b64 !== 'NO-IMAGE') {
          updateUserPhoto(`data:image/png;base64,${b64}`);
        } else {
          updateUserPhoto(null);
        }
      } catch (err) {
        console.error('Erro carregando dados do usuário:', err);
        updateUserPhoto(null);
      }
    })();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permissão da Câmera",
            message: "Precisamos acessar sua câmera para que você possa tirar uma foto para seu perfil.",
            buttonNeutral: "Perguntar depois",
            buttonNegative: "Cancelar",
            buttonPositive: "Permitir"
          }
        );
        
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            "Permissão Necessária",
            "Você precisa permitir o acesso à câmera para alterar sua foto de perfil.",
            [
              { text: "OK" }
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn("Erro ao solicitar permissão da câmera:", err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Android 13 (API 33) changed media permissions: use READ_MEDIA_IMAGES
        const apiLevel = typeof Platform.Version === 'string' ? parseInt(Platform.Version as string, 10) : (Platform.Version as number);
        const permissionToRequest = apiLevel >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const result = await PermissionsAndroid.request(
          permissionToRequest,
          {
            title: "Permissão de Armazenamento",
            message: "Precisamos acessar suas fotos para que você possa escolher uma imagem para seu perfil.",
            buttonNeutral: "Perguntar depois",
            buttonNegative: "Cancelar",
            buttonPositive: "Permitir"
          }
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            "Permissão Necessária",
            "Você precisa permitir o acesso ao armazenamento para selecionar uma foto da galeria.",
            [
              { text: "OK" }
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn("Erro ao solicitar permissão de armazenamento:", err);
        return false;
      }
    }
    return true;
  };

  const showPermissionExplanation = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Precisamos da sua permissão",
        "Para alterar sua foto de perfil, precisaremos:\n\n" +
        "1. Acesso à câmera para tirar fotos\n" +
        "2. Acesso à galeria para selecionar fotos\n\n" +
        "Você permite que o aplicativo acesse esses recursos?",
        [
          {
            text: "Não permitir",
            style: "cancel",
            onPress: () => resolve(false)
          },
          {
            text: "Permitir",
            onPress: () => resolve(true)
          }
        ],
        { cancelable: false }
      );
    });
  };

  const showImageSourceDialog = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Escolher foto",
        "Como você quer adicionar sua foto?",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => resolve(null)
          },
          {
            text: "Tirar foto",
            onPress: () => resolve("camera")
          },
          {
            text: "Escolher da galeria",
            onPress: () => resolve("gallery")
          }
        ],
        { cancelable: true }
      );
    });
  };

  const checkAndRequestPermissions = async () => {
    // Primeiro verifica se já temos as permissões
    const apiLevel = typeof Platform.Version === 'string' ? parseInt(Platform.Version as string, 10) : (Platform.Version as number);
    const storagePermission = apiLevel >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasStoragePermission = await PermissionsAndroid.check(storagePermission);
    const hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

    // Se já temos todas as permissões, retorna true imediatamente
    if (hasStoragePermission && hasCameraPermission) {
      return true;
    }

    // Se falta alguma permissão, mostra explicação e solicita
    const userAccepted = await showPermissionExplanation();
    if (!userAccepted) {
      Alert.alert(
        "Permissões necessárias",
        "Sem essas permissões, não será possível alterar sua foto de perfil. Você pode mudar isso nas configurações do aplicativo quando quiser."
      );
      return false;
    }

    // Solicita apenas as permissões que ainda não foram concedidas
    if (!hasCameraPermission) {
      const cameraPermission = await requestCameraPermission();
      if (!cameraPermission) {
        return false;
      }
    }

    if (!hasStoragePermission) {
      const storagePermission = await requestStoragePermission();
      if (!storagePermission) {
        return false;
      }
    }

    return true;
  };

  const pickImage = async () => {
    try {
      // Verifica todas as permissões necessárias
      const hasPermissions = await checkAndRequestPermissions();
      if (!hasPermissions) {
        return;
      }

      // Pergunta ao usuário se quer usar câmera ou galeria
      const source = await showImageSourceDialog();
      if (!source) {
        return;
      }

      const options = {
        mediaType: 'photo' as const,
        includeBase64: true,
        maxHeight: 800,  // Reduzido pela metade
        maxWidth: 800,   // Reduzido pela metade
        quality: 1.0 as const,  // Reduzido para melhor compressão
        saveToPhotos: true,
      };

      const launchFunction = source === "camera" 
        ? ImagePicker.launchCamera 
        : ImagePicker.launchImageLibrary;

      launchFunction(options, async (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
          return;
        }

        if (response.assets && response.assets[0]?.base64) {
          const token = await getData('userToken') as string;
          if (!token) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            return;
          }

          try {
            await updateUserData(token, { 
              update: { 
                profilePicture: { 
                  imageBase64: response.assets[0].base64 
                } 
              } 
            });
            updateUserPhoto(`data:image/jpeg;base64,${response.assets[0].base64}`);
            Alert.alert('Sucesso', 'Foto do perfil atualizada.');
          } catch (err) {
            console.error('Erro ao enviar imagem ao servidor:', err);
            Alert.alert('Erro', 'Não foi possível salvar a foto no servidor.');
          }
        }
      });
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto do usuário.');
    }
  };

  if (isLoading) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>        
      <Header 
        onMenuPress={() => setSidebarVisible(true)} 
        theme={theme}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
      />

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>          
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            {userPhotoUri ? (
              <Image source={{ uri: userPhotoUri }} style={styles.avatar} />
            ) : (
              <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
            )}
          </TouchableOpacity>
          <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
          {!!email && <Text style={[styles.email, { color: theme.textSecondary }]}>{email}</Text>}
        </View>
      </ScrollView>

      <Footer theme={theme} />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  card: { alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 20, width: '100%', maxWidth: 420 },
  avatar: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: '#fff', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700' },
  email: { fontSize: 14, marginTop: 4, fontWeight: '500' },
});


