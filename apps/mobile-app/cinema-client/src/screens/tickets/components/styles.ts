import { StyleSheet } from 'react-native';
import { Colors } from '@constants/colors';

export const ticketCardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    padding: 16,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textActive,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    color: Colors.textInactive,
    fontSize: 13,
    marginLeft: 8,
  },
  
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#2ECC7120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderStatus: {
    fontSize: 11,
    color: '#2ECC71',
    fontWeight: 'bold',
  }
});

