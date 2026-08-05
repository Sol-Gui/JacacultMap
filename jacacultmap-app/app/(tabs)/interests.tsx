import React, { useState, useEffect } from 'react'
import { updateUserData } from '../../services/user';
import { validateToken } from '../../services/auth';
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallScreen = height < 700;

const Interests = () => {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnims] = useState(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  );
  const [isAnimating, setIsAnimating] = useState(true);

  const interests = [
    { id: 'intelectual', name: 'Intelectual' },
    { id: 'turistico', name: 'Turístico' },
    { id: 'social', name: 'Social' },
    { id: 'gastronomico', name: 'Gastronômico' },
    { id: 'fisico', name: 'Físico' },
    { id: 'virtual', name: 'Virtual' },
    { id: 'artistico', name: 'Artístico' }
  ];

  useEffect(() => {
    const animations = [];

    // Animação de entrada do título
    animations.push(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    );

    // Animação escalonada dos botões
    scaleAnims.forEach((anim, index) => {
      animations.push(
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          delay: index * 100,
          useNativeDriver: true,
        })
      );
    });

    // Start all animations
    const animationGroup = Animated.parallel(animations);
    animationGroup.start(({ finished }) => {
      if (finished) {
        setIsAnimating(false);
      }
    });

    // Cleanup function
    return () => {
      animationGroup.stop();
      fadeAnim.setValue(0);
      scaleAnims.forEach(anim => anim.setValue(0));
    };
  }, []);

  const handleInterestPress = (interest: { id: string, name: string }, index: number) => {
    const tempScale = new Animated.Value(1);
    
    const buttonAnimation = Animated.sequence([
      Animated.timing(tempScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tempScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);

    setSelectedInterests(prev => {
      if (prev.includes(interest.id)) {
        return prev.filter(item => item !== interest.id);
      } else {
        return [...prev, interest.id];
      }
    });

    buttonAnimation.start();
  };

  const handleContinue = () => {
    console.log('Interesses selecionados:', selectedInterests);
    validateToken().then(async (response) => {
      if (response.success && response.token) {
        await updateUserData(response.token, { "update": { "favoritedCategories": selectedInterests } });
        router.replace('/(tabs)/home');
      } else {
        console.error('Token inválido ou não encontrado');
      }
    }).catch((error) => {
      console.error('Erro ao validar token:', error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>
              Escolha os interesses
            </Text>
            <Text style={styles.subtitle}>
              que mais te agradam
            </Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => (
              <Animated.View
                key={interest.id}
                style={[
                  styles.buttonWrapper,
                  {
                    transform: [{ scale: scaleAnims[index] }],
                  }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.interestButton,
                    selectedInterests.includes(interest.id) && styles.selectedButton
                  ]}
                  onPress={() => !isAnimating && handleInterestPress(interest, index)}
                  activeOpacity={isAnimating ? 1 : 0.8}
                  disabled={isAnimating}
                >
                  <View style={styles.buttonContent}>
                    {selectedInterests.includes(interest.id) && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                    <Text 
                      style={[
                        styles.interestText,
                        selectedInterests.includes(interest.id) && styles.selectedText
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {interest.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            selectedInterests.length > 0 && styles.continueButtonActive
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={selectedInterests.length === 0}
        >
          <View style={styles.continueButtonContent}>
            <Text style={[
              styles.continueText,
              selectedInterests.length > 0 && styles.continueTextActive
            ]}>
              Continuar
            </Text>
            {selectedInterests.length > 0 && (
              <View style={styles.selectedCount}>
                <Text style={styles.selectedCountText}>
                  {selectedInterests.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 160,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.4,
    left: width * 0.8,
  },
  
  scrollContent: {
    flexGrow: 1,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    alignItems: 'center',
  },
  
  titleContainer: {
    alignItems: 'center',
    marginBottom: height * 0.04,
    marginTop: height * 0.02,
  },
  title: {
    fontSize: isSmallScreen ? 18 : (width > 768 ? 28 : 22),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: isSmallScreen ? 16 : (width > 768 ? 24 : 18),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 8 : 16,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  interestsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed to align items from top
    paddingVertical: 20,
  },
  buttonWrapper: {
    width: '75%', // 75% of screen width
    height: height * 0.05,
    marginBottom: 16,
    alignItems: 'center',
  },
  interestButton: {
    width: '100%', // Takes full width of wrapper
    height: '100%', // Takes full height of wrapper
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#e3e3e3ff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: '#81C784',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 12,
    shadowOpacity: 0.25,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align text to the left
    width: '100%', // Take full width
    paddingHorizontal: 16,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  interestText: {
    fontSize: height * 0.018,
    fontWeight: '600',
    color: '#2E7D32',
    flex: 1,
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  bottomContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  continueButton: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  continueButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    elevation: 8,
    shadowOpacity: 0.2,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  continueTextActive: {
    color: '#FFFFFF',
  },
  selectedCount: {
    marginLeft: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Interests;