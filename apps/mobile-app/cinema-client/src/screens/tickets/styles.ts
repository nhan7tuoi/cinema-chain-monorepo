import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@constants/colors';

const { width } = Dimensions.get('window');

export const myTicketsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textInactive,
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export const ticketDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    width: width - 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  topSection: {
    padding: 24,
    alignItems: 'center',
  },
  poster: {
    width: 140,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textActive,
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.textInactive,
    fontSize: 14,
    marginLeft: 8,
  },
  
  // Cutout and Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    position: 'relative',
  },
  cutout: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  leftCutout: {
    left: -15,
  },
  rightCutout: {
    right: -15,
  },
  dottedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },

  // Bottom Section
  bottomSection: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  detailBlock: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textInactive,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textActive,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 12,
  },
  qrPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#222',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#2ECC71',
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 12,
    color: Colors.textInactive,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  }
});

