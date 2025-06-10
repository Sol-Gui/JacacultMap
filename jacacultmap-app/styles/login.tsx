import { TouchableOpacity, Image, StyleSheet, View, TextInput } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const SocialLoginButton = ({ onPress, icon }: { onPress: () => void; icon: any }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
  </TouchableOpacity>
);

export const SocialLoginContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.SocialLogincontainer}>
    {children}
  </View>
);

export const Input = ({ placeholder, value, onChangeText }: { placeholder: string; value: string; onChangeText: (text: string) => void }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor={'#000000'}
  />
);

export const InputContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.InputContainer}>
    {children}
  </View>
);

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#006032',
  },
  InputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  SocialLogincontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: verticalScale(20),
  },
  input: {
    width: scale(280),
    height: verticalScale(35),
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(10),
    backgroundColor: '#ffffff',
    fontWeight: '100',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
    fontSize: scale(14),
    marginTop: verticalScale(16),
  },
  button: {
    marginHorizontal: scale(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: scale(50),
    height: scale(50),
    borderRadius: scale(100),
    boxShadow: '0px 2px 7px rgba(0,0,0,0.5)',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(36),
    height: scale(36),
  },
  text: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(45),
  },
  title: {
    flexDirection: 'column',
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#c8dba4',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(60),
  },
  forgotPasswordText: {
    fontSize: moderateScale(15),
    color: '#2686ff',
    textDecorationLine: 'none',
    marginBottom: verticalScale(10),
    width: scale(280),
    textAlign: 'right',
  },
  suggestion: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    marginTop: verticalScale(12)
  },
  suggestionText: {
    color: '#0000CD',
    fontSize: moderateScale(11),
    paddingHorizontal: scale(15),
  },
  suggestionsList: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#DCDCDC',
    borderRadius: 5,
    maxHeight: verticalScale(56)
  },
  loginButton: {
    backgroundColor: '#81b522',
    width: scale(280),
    height: verticalScale(38),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(64),
    marginTop: verticalScale(16),
    borderRadius: scale(32),
  },
  loginText: {
    fontSize: moderateScale(14),
    color: '#ffffff',
    fontWeight: 'bold',
  },
  registerButton: {
    width: scale(280),
    height: verticalScale(38),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: scale(32),
    marginBottom: verticalScale(16),
    borderColor: '#000000',
    borderWidth: 1,
  },
  registerText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  errorText: {
    color: '#ff3333',
    backgroundColor: '#fff0f0',
    borderColor: '#ff3333',
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: moderateScale(13),
    boxShadow: '0px 2px 8px rgba(255,51,51,0.15)',
  },
  errorPopup: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    width: scale(240), // Reduzido de 280
    backgroundColor: '#fff',
    borderRadius: scale(6),
    padding: scale(8), // Reduzido de 20
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 12px rgba(255,51,51,0.15)',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  successText: {
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: moderateScale(13),
    boxShadow: '0px 2px 8px rgba(46,125,50,0.15)',
  },
  successPopup: {
    position: 'relative',
    marginHorizontal: scale(20),
    zIndex: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 12px rgba(46,125,50,0.15)',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  }
});