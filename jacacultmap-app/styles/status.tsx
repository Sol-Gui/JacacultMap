import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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

export const useStatusStyles = () => {
  const device = useDeviceType();
  const { width, height } = useDimensions();

  return StyleSheet.create({
    body: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#457D58',
      justifyContent: 'flex-start',
      paddingTop: device.isDesktop ? verticalScale(5) : '30%',
      paddingHorizontal: device.isDesktop ? scale(20) : scale(12),
    },
    icon: {
      width: device.isDesktop ? scale(120) : device.isTablet ? scale(150) : scale(200),
      height: device.isDesktop ? scale(120) : device.isTablet ? scale(150) : scale(200),
      marginTop: device.isDesktop ? verticalScale(20) : 0,
    },
    error_text: {
      color: '#FFFFFF',
      fontSize: device.isDesktop ? scale(16) : device.isTablet ? scale(20) : scale(22),
      fontWeight: 'bold',
      padding: device.isDesktop ? verticalScale(8) : verticalScale(10),
      width: device.isDesktop ? '80%' : '100%',
      backgroundColor: '#006032',
      height: device.isDesktop ? verticalScale(50) : scale(60),
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: device.isDesktop ? scale(10) : 0,
      marginTop: device.isDesktop ? verticalScale(15) : 0,
    },
    checking_text: {
      color: '#FFFFFF',
      fontSize: device.isDesktop ? scale(10) : device.isTablet ? scale(14) : scale(12),
      fontWeight: 'normal',
      paddingTop: device.isDesktop ? verticalScale(15) : verticalScale(10),
      paddingHorizontal: device.isDesktop ? scale(30) : scale(15),
      textAlign: 'center',
      width: device.isDesktop ? '70%' : '90%',
      lineHeight: device.isDesktop ? scale(15) : scale(18),
    },
    trying_again_text: {
      color: '#FFFFFF',
      fontSize: device.isDesktop ? scale(12) : device.isTablet ? scale(16) : scale(16),
      fontWeight: 'bold',
      paddingTop: device.isDesktop ? verticalScale(15) : verticalScale(20),
      textAlign: 'center',
    },
  });
};

export const styles = StyleSheet.create({
  body: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#457D58',
      justifyContent: 'flex-start',
      paddingTop: '30%',
  },
  'icon': {
    width: scale(200),
    height: scale(200),
  },
  'error_text': {
    color: '#FFFFFF',
    fontSize: scale(22),
    fontWeight: 'bold',
    padding: verticalScale(10),
    width: '100%',
    backgroundColor: '#006032',
    height: scale(60),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  'checking_text': {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontWeight: 'normal',
    paddingTop: verticalScale(10),
    textAlign: 'center',
    width: '90%',
  },
  'trying_again_text': {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: 'bold',
    paddingTop: verticalScale(20),
    textAlign: 'center',
  }
});