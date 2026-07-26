import { StyleSheet } from 'react-native';
import { Colors } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
  },
  logoutButton: {
    width: '100%',
    marginTop: 20,
    borderColor: '#EF4444', // Red border for logout
  },
});

