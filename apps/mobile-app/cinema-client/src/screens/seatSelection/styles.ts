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
  showtimeInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  cinemaName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textActive,
    marginBottom: 4,
  },
  timeInfo: {
    fontSize: 14,
    color: Colors.primary,
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
  footerInfo: {
    flex: 1,
    paddingRight: 16,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: Colors.textInactive,
  },
  footerPriceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textActive,
    marginTop: 2,
  },
  selectedSeatsText: {
    fontSize: 14,
    color: Colors.textInactive,
    fontWeight: '500',
  },
  footerButton: {
    backgroundColor: Colors.primary,
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
