import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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