import { Dimensions, Platform } from 'react-native';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints para responsividade
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};

// Detecção de dispositivo
export const deviceType = {
  isMobile: screenWidth < breakpoints.mobile,
  isTablet: screenWidth >= breakpoints.mobile && screenWidth < breakpoints.tablet,
  isDesktop: screenWidth >= breakpoints.tablet,
  isSmallScreen: screenHeight < 700,
};

// Funções auxiliares para responsividade
export const getResponsiveValue = <T,>(mobile: T, tablet: T, desktop: T): T => {
  if (deviceType.isDesktop) return desktop;
  if (deviceType.isTablet) return tablet;
  return mobile;
};

export const getResponsiveScale = (mobile: number, tablet?: number, desktop?: number): number => {
  if (deviceType.isDesktop && desktop !== undefined) return scale(desktop);
  if (deviceType.isTablet && tablet !== undefined) return scale(tablet);
  return scale(mobile);
};

export const getResponsiveModerateScale = (mobile: number, tablet?: number, desktop?: number): number => {
  if (deviceType.isDesktop && desktop !== undefined) return moderateScale(desktop);
  if (deviceType.isTablet && tablet !== undefined) return moderateScale(tablet);
  return moderateScale(mobile);
};

export const getResponsiveVerticalScale = (mobile: number, tablet?: number, desktop?: number): number => {
  if (deviceType.isDesktop && desktop !== undefined) return verticalScale(desktop);
  if (deviceType.isTablet && tablet !== undefined) return verticalScale(tablet);
  return verticalScale(mobile);
};

// Função para obter largura máxima de conteúdo em desktop
export const getMaxContentWidth = (): number => {
  if (deviceType.isDesktop) {
    return Math.min(screenWidth * 0.8, 1200);
  }
  if (deviceType.isTablet) {
    return Math.min(screenWidth * 0.9, 800);
  }
  return screenWidth;
};

// Função para obter padding horizontal responsivo
export const getResponsivePadding = (): number => {
  if (deviceType.isDesktop) return scale(40);
  if (deviceType.isTablet) return scale(30);
  return scale(16);
};

export { screenWidth, screenHeight, scale, moderateScale, verticalScale };

