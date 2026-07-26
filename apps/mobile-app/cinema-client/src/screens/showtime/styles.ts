import { StyleSheet } from 'react-native';
import { Colors } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerHomeButton: {
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: Colors.background,
  },
  footerPriceInfo: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: Colors.textInactive,
  },
  footerPriceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textActive,
  },
  footerButton: {
    backgroundColor: '#8B2323',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  footerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
