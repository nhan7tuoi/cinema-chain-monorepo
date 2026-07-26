import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerHomeButton: {
    marginRight: -8,
  },
  showtimeInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  cinemaName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textActive,
    marginBottom: 4,
  },
  timeInfo: {
    fontSize: 14,
    color: Colors.textInactive,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // For absolute footer
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textActive,
    marginBottom: 16,
  },
  // Combo Item styles
  comboItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  comboImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  comboInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  comboName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textActive,
    marginBottom: 4,
  },
  comboDescription: {
    fontSize: 12,
    color: Colors.textInactive,
    marginBottom: 8,
  },
  comboPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comboPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textActive,
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32, // for safe area
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerInfo: {
    flex: 1,
    marginRight: 16,
  },
  footerTotalLabel: {
    fontSize: 12,
    color: Colors.textInactive,
    marginBottom: 2,
  },
  footerPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textActive,
  },
  selectedSummary: {
    fontSize: 12,
    color: Colors.textInactive,
    marginTop: 2,
  },
});
