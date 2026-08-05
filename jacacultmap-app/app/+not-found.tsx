import { Link, Stack } from 'expo-router';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, View } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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

import React from 'react';

export default function NotFoundScreen() {
  const device = useDeviceType();
  
  const titleFontSize = device.isDesktop 
    ? moderateScale(32)
    : device.isTablet 
    ? moderateScale(28) 
    : moderateScale(24);
    
  const linkFontSize = device.isDesktop 
    ? moderateScale(18)
    : device.isTablet 
    ? moderateScale(16) 
    : moderateScale(14);
    
  const marginTop = device.isDesktop 
    ? verticalScale(30)
    : device.isTablet 
    ? verticalScale(24) 
    : verticalScale(20);
    
  const paddingVertical = device.isDesktop 
    ? verticalScale(18)
    : device.isTablet 
    ? verticalScale(16) 
    : verticalScale(14);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { paddingHorizontal: scale(20) }]}>
        <Text style={[styles.title, { fontSize: titleFontSize }]}>This screen doesn't exist.</Text>
        <Link href="/" style={[styles.link, { marginTop }]}>
          <Text style={[styles.linkText, { fontSize: linkFontSize, paddingVertical }]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(20),
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: '#2686ff',
    textDecorationLine: 'underline',
    fontWeight: '600',
    paddingHorizontal: scale(20),
  },
});