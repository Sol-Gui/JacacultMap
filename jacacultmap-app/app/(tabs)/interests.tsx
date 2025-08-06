import React, { useState, useEffect } from 'react';
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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnims] = useState(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  );

  const interests = [
    'Turístico',
    'Social',
    'Intelectual',
    'Físico',
    'Artístico',
    'Manual',
    'Virtual'
  ];

  useEffect(() => {
    // Animação de entrada do título
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animação escalonada dos botões
    const animations = scaleAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  const handleInterestPress = (interest: string, index: number) => {
    console.log(`Interesse clicado: ${interest}`);
    
    // Animação de feedback
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleContinue = () => {
    console.log('Interesses selecionados:', selectedInterests);
    // Aqui você pode navegar para a próxima tela usando o Expo Router
    // router.push('/next-screen');
  };

  const isTablet = width > 768;
  const numColumns = isTablet ? 3 : 2;
  const horizontalPadding = 40;
  const buttonSpacing = 16;
  const buttonWidth = (width - horizontalPadding - (numColumns - 1) * buttonSpacing) / numColumns;

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
            <View style={styles.interestsGrid}>
              {interests.map((interest, index) => (
                <Animated.View
                  key={interest}
                  style={[
                    styles.buttonWrapper,
                    {
                      width: buttonWidth,
                      transform: [{ scale: scaleAnims[index] }],
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.interestButton,
                      selectedInterests.includes(interest) && styles.selectedButton
                    ]}
                    onPress={() => handleInterestPress(interest, index)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.buttonContent}>
                      {selectedInterests.includes(interest) && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                      <Text 
                        style={[
                          styles.interestText,
                          selectedInterests.includes(interest) && styles.selectedText
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {interest}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
    bottom: 100,
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
    maxWidth: 600,
    paddingVertical: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    marginBottom: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  interestButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 55,
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
    justifyContent: 'center',
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
    fontSize: width < 360 ? 12 : 14,
    fontWeight: '600',
    color: '#2E7D32',
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