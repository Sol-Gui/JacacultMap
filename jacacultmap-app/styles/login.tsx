  import React from 'react';
  import { TouchableOpacity, Image, StyleSheet, View, TextInput, Dimensions, Text } from 'react-native';
  import { scale, verticalScale } from 'react-native-size-matters';
  import { MaterialCommunityIcons } from '@expo/vector-icons';

  // Hook para obter dimensões dinâmicas
  const useDimensions = () => {
    const [dimensions, setDimensions] = React.useState(() => Dimensions.get('window'));
    
    React.useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        setDimensions(window);
      });
      return () => subscription?.remove();
    }, []);
    
    return dimensions;
  };

  // Hook para detectar tipo de dispositivo dinamicamente
  const useDeviceType = () => {
    const { width } = useDimensions();
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  };

  export const SocialLoginButton = ({ onPress, icon }: { onPress: () => void; icon: any }) => {
    const device = useDeviceType();
    const iconSize = device.isDesktop ? scale(20) : device.isTablet ? scale(36) : scale(32);
    const buttonSize = device.isDesktop ? scale(33) : device.isTablet ? scale(46) : scale(46);
    
    return (
      <TouchableOpacity 
        style={[
          styles.socialButton,
          {
            width: buttonSize,
            height: buttonSize,
          }
        ]} 
        onPress={onPress} 
        activeOpacity={0.8}
      >
        <Image source={icon} style={{ width: iconSize, height: iconSize }} />
      </TouchableOpacity>
    );
  };

  export const SocialLoginContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.socialContainer}>
      {children}
    </View>
  );

  export const Divider = () => (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>OU</Text>
      <View style={styles.dividerLine} />
    </View>
  );

  export const Input = (
    { placeholder, value, onChangeText, secureTextEntry = false }: 
    { placeholder: string; value: string; onChangeText: (text: string) => void; secureTextEntry: boolean}) => {
    const device = useDeviceType();
    const inputHeight = device.isDesktop ? verticalScale(26) : device.isTablet ? verticalScale(44) : verticalScale(42);
    const fontSize = device.isDesktop ? scale(9) : device.isTablet ? scale(15) : scale(14);
    const marginBottom = device.isDesktop ? verticalScale(8) : verticalScale(12);
    
    return (
      <TextInput
        style={[styles.input, { height: inputHeight, fontSize, marginBottom }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={'#999'}
        secureTextEntry={secureTextEntry}
      />
    );
  };

  export const PasswordInput = (
    { placeholder, value, onChangeText, showPassword, onTogglePassword }: 
    { placeholder: string; value: string; onChangeText: (text: string) => void; showPassword: boolean; onTogglePassword: () => void }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const device = useDeviceType();
    const inputHeight = device.isDesktop ? verticalScale(26) : device.isTablet ? verticalScale(44) : verticalScale(42);
    const fontSize = device.isDesktop ? scale(9) : device.isTablet ? scale(15) : scale(14);
    const iconSize = device.isDesktop ? scale(12) : device.isTablet ? scale(20) : scale(18);
    const paddingRight = device.isDesktop ? scale(32) : device.isTablet ? scale(45) : scale(40);
    const buttonWidth = device.isDesktop ? scale(29) : device.isTablet ? scale(40) : scale(36);
    const marginBottom = device.isDesktop ? verticalScale(10) : verticalScale(12);
    
    return (
      <View style={[styles.passwordInputContainer, isFocused && styles.passwordInputContainerFocused, { marginBottom }]}>
        <TextInput
          style={[
            styles.input, 
            styles.passwordInput, 
            isFocused && styles.inputFocused,
            { 
              height: inputHeight, 
              fontSize,
              paddingRight,
              marginBottom: 0,
            }
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={'#999'}
          secureTextEntry={!showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity 
          onPress={() => onTogglePassword()}
          style={[
            styles.eyeIconButton,
            {
              height: inputHeight,
              width: buttonWidth,
            }
          ]}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons 
            name={showPassword ? "eye-off" : "eye"} 
            size={iconSize} 
            color="#666"
          />
        </TouchableOpacity>
      </View>
    );
  };

  export const InputContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.inputContainer}>
      {children}
    </View>
  );

  // Componente wrapper para estilos dinâmicos
  export const LoginContainer = ({ children }: { children: React.ReactNode }) => {
    const device = useDeviceType();
    const { width, height } = useDimensions();
    
    const cardWidth = device.isDesktop 
      ? Math.min(width * 0.6, 500)
      : device.isTablet 
      ? Math.min(width * 0.8, 500) 
      : Math.min(width * 1, 500);
    
    // Em web (desktop), limitar a altura máxima do card
    const maxHeight = device.isDesktop 
      ? 740
      : device.isTablet 
      ? height * 0.8
      : height - verticalScale(36);
    
    const paddingTop = device.isDesktop 
      ? verticalScale(14) 
      : device.isTablet 
      ? verticalScale(40) 
      : verticalScale(20);
    
    const paddingBottom = device.isDesktop 
      ? verticalScale(14) 
      : device.isTablet 
      ? verticalScale(40) 
      : verticalScale(30);
    
    const cardPadding = device.isDesktop 
      ? scale(30) 
      : device.isTablet 
      ? scale(32) 
      : scale(24);
    
    return (
      <View style={[styles.body, { paddingTop, paddingBottom }]}>
        <View style={[styles.formCard, { width: cardWidth, maxHeight, padding: cardPadding }]}>
          {children}
        </View>
      </View>
    );
  };

  export const LoginTitle = ({ children }: { children: React.ReactNode }) => {
    const device = useDeviceType();
    const fontSize = device.isDesktop 
      ? scale(14)
      : device.isTablet 
      ? scale(22) 
      : scale(16);
    
    return (
      <Text style={[styles.title, { fontSize }]}>
        {children}
      </Text>
    );
  };

  export const LoginSubtitle = ({ children }: { children: React.ReactNode }) => {
    const device = useDeviceType();
    const fontSize = device.isDesktop 
      ? scale(9)
      : device.isTablet 
      ? scale(16) 
      : scale(15);
    
    return (
      <Text style={[styles.subtitle, { fontSize }]}>
        {children}
      </Text>
    );
  };

  export const LoginButton = ({ onPress, children, isPrimary = true }: { onPress: () => void; children: React.ReactNode; isPrimary?: boolean }) => {
    const device = useDeviceType();
    const buttonHeight = device.isDesktop ? verticalScale(26) : device.isTablet ? verticalScale(46) : verticalScale(44);
    const fontSize = device.isDesktop 
      ? scale(9)
      : device.isTablet 
      ? scale(15) 
      : scale(14);
    const marginBottom = device.isDesktop 
      ? verticalScale(8)
      : device.isTablet 
      ? verticalScale(24) 
      : verticalScale(28);
    const marginTop = device.isDesktop 
      ? verticalScale(8)
      : verticalScale(12);
    
    return (
      <TouchableOpacity 
        onPress={onPress} 
        style={[
          isPrimary ? styles.loginButton : styles.registerButton,
          { 
            height: buttonHeight,
            marginBottom: isPrimary ? marginBottom : verticalScale(0),
            marginTop: isPrimary ? marginTop : 0,
          }
        ]}
        activeOpacity={0.9}
      >
        <Text style={[
          isPrimary ? styles.loginText : styles.registerText,
          { fontSize }
        ]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  };

  export const ForgotPasswordLink = ({ onPress }: { onPress: () => void }) => {
    const device = useDeviceType();
    const fontSize = device.isDesktop 
      ? scale(8)
      : device.isTablet 
      ? scale(14) 
      : scale(13);
    const marginTop = device.isDesktop ? verticalScale(6) : verticalScale(8);
    const marginBottom = device.isDesktop ? verticalScale(10) : verticalScale(16);
    
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.forgotPasswordText, { fontSize, marginTop, marginBottom }]}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>
    );
  };

  export const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#006032',
      justifyContent: 'center',
      paddingHorizontal: scale(12),
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: scale(24),
      marginTop: verticalScale(12),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
    inputContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      marginTop: verticalScale(2),
      maxHeight: verticalScale(280),
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: verticalScale(10),
      gap: scale(13),
    },
    socialButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: scale(16),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginVertical: verticalScale(3),
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#e0e0e0',
    },
    dividerText: {
      marginHorizontal: scale(10),
      fontSize: scale(10),
      color: '#999',
      fontWeight: '600',
    },
    input: {
      width: '100%',
      borderWidth: 1.5,
      borderColor: '#e0e0e0',
      borderRadius: scale(12),
      paddingHorizontal: scale(14),
      marginBottom: scale(10),
      backgroundColor: '#fafafa',
      color: '#333',
    },
    inputFocused: {
      borderColor: '#81b522',
      backgroundColor: '#ffffff',
    },
    passwordInputContainer: {
      width: '100%',
      position: 'relative',
      marginBottom: 0,
    },
    passwordInput: {
      width: '100%',
      marginBottom: 0,
    },
    passwordInputContainerFocused: {
      borderColor: '#81b522',
    },
    eyeIconButton: {
      position: 'absolute',
      right: scale(4),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    title: {
      fontWeight: '800',
      color: '#000000',
      marginBottom: verticalScale(3),
      textAlign: 'center',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      color: '#c8dba4',
      marginBottom: verticalScale(6),
      textAlign: 'center',
      fontWeight: '500',
    },
    forgotPasswordText: {
      color: '#2686ff',
      textDecorationLine: 'none',
      marginTop: verticalScale(12),
      marginBottom: verticalScale(20),
      width: '100%',
      textAlign: 'right',
      fontWeight: '600',
    },
    suggestion: {
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      marginTop: verticalScale(4),
      paddingVertical: verticalScale(8),
    },
    suggestionText: {
      color: '#2686ff',
      fontSize: scale(12),
      paddingHorizontal: scale(12),
    },
    suggestionsList: {
      borderWidth: 1.5,
      borderColor: '#e0e0e0',
      backgroundColor: '#ffffff',
      borderRadius: scale(10),
      maxHeight: verticalScale(100),
      marginBottom: verticalScale(8),
      marginTop: verticalScale(-4),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    loginButton: {
      backgroundColor: '#81b522',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(12),
      borderRadius: scale(12),
      shadowColor: '#81b522',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    loginText: {
      color: '#ffffff',
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    registerButton: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: scale(12),
      borderColor: '#e0e0e0',
      borderWidth: 1.5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    registerText: {
      color: '#333',
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    errorText: {
      color: '#d32f2f',
      backgroundColor: '#ffebee',
      borderColor: '#ffcdd2',
      borderWidth: 1.5,
      borderRadius: scale(12),
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(14),
      marginTop: verticalScale(8),
      marginBottom: verticalScale(4),
      textAlign: 'center',
      fontWeight: '600',
      fontSize: scale(12),
    },
    errorPopup: {
      position: 'relative',
      marginHorizontal: scale(16),
      zIndex: 100,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(8),
      marginBottom: verticalScale(4),
    },
  });
