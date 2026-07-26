import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@constants/colors';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.7;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerHomeButton: {
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, 
  },
  section: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textActive,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textInactive,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: Colors.textActive,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textActive,
    marginBottom: 8,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#333',
  },
  paymentName: {
    fontSize: 14,
    color: Colors.textActive,
    fontWeight: '500',
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
    color: Colors.primary,
  },
});



export const paymentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerHomeButton: {
    marginRight: -8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 32,
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textInactive,
    textAlign: 'center',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  countdownText: {
    fontSize: 14,
    color: Colors.textInactive,
    marginTop: 16,
  },
  timeText: {
    fontWeight: 'bold',
    color: Colors.textActive,
  },
});
