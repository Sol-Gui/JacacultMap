import React, { useState, useEffect } from 'react'
import { updateUserData } from '../../services/user';
import { validateToken } from '../../services/auth';
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Animated,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Interests = () => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = height < 700;
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
    <SafeAreaView className="flex-1 bg-[#2E7D32]">
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      <View className="absolute inset-0 overflow-hidden">
        <View className="absolute -right-[50px] -top-[50px] h-[200px] w-[200px] rounded-full bg-white/10" />
        <View className="absolute -bottom-[160px] -left-[30px] h-[150px] w-[150px] rounded-full bg-white/10" />
        <View className="absolute h-[100px] w-[100px] rounded-full bg-white/10" style={{ top: height * 0.4, left: width * 0.8 }} />
      </View>
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center px-5 pt-10">
          <Animated.View className="mt-4 items-center" style={{ opacity: fadeAnim }}>
            <Text className={`${isSmallScreen ? 'text-lg' : width > 768 ? 'text-[28px]' : 'text-[22px]'} mb-1 text-center font-semibold text-white`}>
              Escolha os interesses
            </Text>
            <Text className={`${isSmallScreen ? 'text-base' : width > 768 ? 'text-2xl' : 'text-lg'} mb-4 text-center text-white/90`}>
              que mais te agradam
            </Text>
            <View className="h-[3px] w-[60px] rounded-full bg-white/60" />
          </Animated.View>

          <View className="w-full items-center py-5 gap-4">
          {interests.map((interest, index) => (
            <Animated.View
              key={interest.id}
              className="h-[72px] w-full max-w-[560px] items-center"
              style={{ transform: [{ scale: scaleAnims[index] }] }}
            >
              <TouchableOpacity
                className={`h-full w-full items-center justify-center rounded-2xl border-2 px-4 shadow-lg ${selectedInterests.includes(interest.id) ? 'border-white/30 bg-[#81C784]' : 'border-transparent bg-[#e3e3e3]'}`}
                onPress={() => !isAnimating && handleInterestPress(interest, index)}
                activeOpacity={isAnimating ? 1 : 0.8}
                disabled={isAnimating}
              >
                <View className="w-full flex-row items-center px-4">
                  {selectedInterests.includes(interest.id) && (
                    <View className="mr-2 h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <Text className="text-xs font-bold text-white">✓</Text>
                    </View>
                  )}
                  <Text
                    className={`flex-1 my-3 gap-3 text-center font-semibold ${isSmallScreen ? 'text-base' : 'text-lg'} ${selectedInterests.includes(interest.id) ? 'text-black/50' : 'text-[#2E7D32]'}`}
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

      <View className="w-full bg-[#2E7D32] p-5">
        <TouchableOpacity
          className={`w-full max-w-[300px] self-center rounded-2xl border-2 px-4 py-[18px] ${selectedInterests.length > 0 ? 'border-white/40 bg-white/25' : 'border-white/20 bg-white/15'}`}
          style={selectedInterests.length > 0 ? undefined : { opacity: 0.75 }}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={selectedInterests.length === 0}
        >
          <View className="flex-row items-center justify-center">
            <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-white/70`}>
              Continuar
            </Text>
            {selectedInterests.length > 0 && (
              <View className="ml-3 h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <Text className="text-sm font-bold text-white">
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

export default Interests;
